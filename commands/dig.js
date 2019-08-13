const moment = require('moment')
const dbGet = require('../utilities/dbGet')
const dbQuery = require('../utilities/dbQuery')
const dbUpdate = require('../utilities/dbUpdate')

const channelFlavorText = require('../channelFlavorText.json')
const directMessageFlavorText = require('../directMessageFlavorText.json')

module.exports = {
    name: 'dresser',
    description: 'dig for treasure',
    usage: '',
    cooldown: 5,
    guildOnly: true,
    aliases: [],
    async execute(message, args, dbClient) {
        message.delete(60000)
        const params = {
            TableName: 'Users',
            Key: { id: message.author.id },
            ProjectionExpression: 'lastDig',
        }
        const dbData = await dbGet(params, dbClient)
        const currentTime = moment.utc()
        // if the user hasn't been initiated or dug before or last dig was before today
        if (
            Object.entries(dbData).length === 0 ||
            Object.entries(dbData.Item).length === 0 ||
            moment
                .unix(dbData.Item.lastDig)
                .utc()
                .isBefore(currentTime, 'day')
        ) {
            if (
                !dbData.Item.lastTreasure ||
                (dbData.Item.lastTreasure &&
                    moment
                        .unix(dbData.Item.lastTreasure)
                        .utc()
                        .isBefore(currentTime, 'week'))
            ) {
                const queryParams = {
                    TableName: 'Events',
                    IndexName: 'type-startTime-index',
                    KeyConditionExpression:
                        '#type = :dig and startTime <= :time',
                    ExpressionAttributeNames: {
                        '#type': 'type',
                        '#et': 'endTime',
                    },
                    ExpressionAttributeValues: {
                        ':dig': 'dig',
                        ':time': currentTime.unix(),
                    },
                    FilterExpression: '#et >= :time',
                }
                const dbQueryData = await dbQuery(queryParams, dbClient)
                let digChannelObject = {}

                for (let index = 0; index < dbQueryData.Items.length; index++) {
                    const event = dbQuery.Items[index]
                    if (message.channel.id === event.channel && event.public) {
                        digChannelObject = event
                        break
                    } else if (message.channel.id === event.channel) {
                        digChannelObject = event
                    }
                }

                // if there is an active dig and in the right channel
                if (Object.entries(digChannelObject).length === 0) {
                    const updateParams = {
                        TableName: 'Users',
                        Key: { id: message.author.id },
                        UpdateExpression:
                            'set #balance = if_not_exists(#balance, :zero) + :value, #lastDig = :timevalue, #lastTreasure = :timevalue',
                        ExpressionAttributeNames: {
                            '#balance': 'balance',
                            '#lastDig': 'lastDig',
                            '#lastTreasure': 'lastTreasure',
                        },
                        ExpressionAttributeValues: {
                            ':value': 1,
                            ':zero': 0,
                            ':timevalue': currentTime.unix(),
                        },
                    }
                    await dbUpdate(updateParams, dbClient)
                    if (digChannelObject.public) {
                        const replyMessage = await message.channel.send(
                            channelFlavorText.digStrikeGold[0]
                        )
                        replyMessage.delete(60000)
                    } else if (digChannelObject.hits < 3) {
                        // if dig success isn't public yet update it
                        const digUpdateParams = {
                            TableName: 'Events',
                            Key: {
                                id: digChannelObject.id,
                                type: digChannelObject.type,
                            },
                            UpdateExpression:
                                'SET #public = :tru ADD #hits :one',
                            ExpressionAttributeNames: {
                                '#public': 'public',
                                '#endtime': 'endtime',
                                '#hits': 'hits',
                            },
                            ExpressionAttributeValues: {
                                ':tru': true,
                                ':time': currentTime.endOf('week').unix(),
                                ':one': 1,
                            },
                        }
                        await dbUpdate(digUpdateParams, dbClient)

                        const replyMessage = await message.channel.send(
                            channelFlavorText.digBeforeGold[0]
                        )
                        replyMessage.delete(60000)
                        message.author.send(
                            directMessageFlavorText.digHitHidden[0]
                        )
                    } else if (digChannelObject.hits >= 3) {
                        // if dig success isn't public yet update it
                        const digUpdateParams = {
                            TableName: 'Events',
                            Key: {
                                id: digChannelObject.id,
                                type: digChannelObject.type,
                            },
                            UpdateExpression:
                                'SET #public = :tru, #endtime = :time ADD #hits :one',
                            ExpressionAttributeNames: {
                                '#public': 'public',
                                '#endtime': 'endtime',
                            },
                            ExpressionAttributeValues: {
                                ':tru': true,
                                ':time': currentTime
                                    .clone()
                                    .endOf('week')
                                    .unix(),
                            },
                        }
                        await dbUpdate(digUpdateParams, dbClient)

                        const replyMessage = await message.channel.send(
                            channelFlavorText.digBeforeGold[0]
                        )
                        replyMessage.delete(60000)
                        message.author.send(
                            directMessageFlavorText.digHitUncover[0]
                        )
                    }
                } else {
                    const updateParams = {
                        TableName: 'Users',
                        Key: { id: message.author.id },
                        UpdateExpression: 'set #lastDig = :value',
                        ExpressionAttributeNames: { '#lastDig': 'lastDig' },
                        ExpressionAttributeValues: {
                            ':value': currentTime.unix(),
                        },
                    }
                    await dbUpdate(updateParams, dbClient)
                    const replyMessage = await message.channel.send(
                        channelFlavorText.digBeforeGold[0]
                    )
                    replyMessage.delete(60000)
                    message.author.send(directMessageFlavorText.digMiss[0])
                }
            } else {
                const replyMessage = await message.reply(
                    channelFlavorText.digBeforeGold[0]
                )
                replyMessage.delete(60000)
                message.author.send(directMessageFlavorText.digCooldownWeek[0])
            }
        } else {
            const replyMessage = await message.reply(
                channelFlavorText.digBeforeGold[0]
            )
            replyMessage.delete(60000)
            message.author.send(directMessageFlavorText.digCooldown[0])
        }
    },
}
