const moment = require('moment')
const dbGet = require('../utilities/dbGet')
const dbQuery = require('../utilities/dbQuery')
const dbUpdate = require('../utilities/dbUpdate')

module.exports = {
    name: 'dig',
    description: 'dig for treasure',
    usage: '',
    cooldown: 5,
    guildOnly: true,
    aliases: [],
    async execute(message, args, dbClient) {
        const params = {
            TableName: 'Users',
            Key: { id: message.author.id },
            ProjectionExpression: 'lastDig',
        }
        const dbData = await dbGet(params, dbClient)
        const currentTime = moment.utc()
        // if the user hasn't been initiated or dug before or it's been 24 hours
        if (
            Object.entries(dbData).length === 0 ||
            Object.entries(dbData.Item).length === 0 ||
            (Object.entries(dbData).length !== 0 &&
                currentTime.diff(moment.unix(dbData.Item.lastDig).utc(), 'h') >
                    24)
        ) {
            const queryParams = {
                TableName: 'Events',
                IndexName: 'type-startTime-index',
                KeyConditionExpression: '#type = :dig and startTime <= :time',
                ExpressionAttributeNames: {
                    '#type': 'type',
                },
                ExpressionAttributeValues: {
                    ':dig': 'dig',
                    ':time': currentTime.unix(),
                },
            }
            const dbQueryData = await dbQuery(queryParams, dbClient)
            console.log(dbQueryData)
            if (dbQueryData.Items.length) {
                const updateParams = {
                    TableName: 'Users',
                    Key: { id: message.author.id },
                    UpdateExpression:
                        'set #balance = if_not_exists(#balance, :zero) + :value, #lastDig = :timevalue',
                    ExpressionAttributeNames: {
                        '#balance': 'balance',
                        '#lastDig': 'lastDig',
                    },
                    ExpressionAttributeValues: {
                        ':value': 1,
                        ':zero': 0,
                        ':timevalue': currentTime.unix(),
                    },
                }
                await dbUpdate(updateParams, dbClient)
                message.channel.send('TREASURE')
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
                message.channel.send('NO TREASURE FOR YOU')
            }
        } else {
            message.reply(
                `${moment
                    .unix(dbData.Item.lastDig)
                    .utc()
                    .add(24, 'hours')
                    .fromNow()} you can dig again`
            )
        }
    },
}
