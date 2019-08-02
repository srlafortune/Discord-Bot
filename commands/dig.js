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
        message.delete(15000)
        // const params = {
        //     TableName: 'Users',
        //     Key: { id: message.author.id },
        //     ProjectionExpression: 'lastDig',
        // }
        // const dbData = await dbGet(params, dbClient)
        // const currentTime = moment.utc()
        // // if the user hasn't been initiated or dug before or last dig was before today
        // if (
        //     Object.entries(dbData).length === 0 ||
        //     Object.entries(dbData.Item).length === 0 ||
        //     moment
        //         .unix(dbData.Item.lastDig)
        //         .utc()
        //         .isBefore(currentTime, 'day')
        // ) {
        //     const queryParams = {
        //         TableName: 'Events',
        //         IndexName: 'type-startTime-index',
        //         KeyConditionExpression: '#type = :dig and startTime <= :time',
        //         ExpressionAttributeNames: {
        //             '#type': 'type',
        //             '#et': 'endTime',
        //         },
        //         ExpressionAttributeValues: {
        //             ':dig': 'dig',
        //             ':time': currentTime.unix(),
        //         },
        //         FilterExpression: '#et >= :time',
        //     }
        //     const dbQueryData = await dbQuery(queryParams, dbClient)
        //     console.log(dbQueryData)
        //     let digChannelObject = {}
        //     if (
        //         dbQueryData.Items.length &&
        //         dbQueryData.Items.some(event => {
        //             if (message.channel.id === event.channel) {
        //                 digChannelObject = event
        //                 return true
        //             }
        //             return false
        //         })
        //     ) {
        //         const updateParams = {
        //             TableName: 'Users',
        //             Key: { id: message.author.id },
        //             UpdateExpression:
        //                 'set #balance = if_not_exists(#balance, :zero) + :value, #lastDig = :timevalue',
        //             ExpressionAttributeNames: {
        //                 '#balance': 'balance',
        //                 '#lastDig': 'lastDig',
        //             },
        //             ExpressionAttributeValues: {
        //                 ':value': 1,
        //                 ':zero': 0,
        //                 ':timevalue': currentTime.unix(),
        //             },
        //         }
        //         await dbUpdate(updateParams, dbClient)
        //         if (digChannelObject.public) {
        //             const replyMessage = await message.channel.send(
        //                 'Yarghhhh treasure acquired me bucko! Have some pants'
        //             )
        //             replyMessage.delete(15000)
        //         } else {
        //             // if dig success isn't public yet update it
        //             const digUpdateParams = {
        //                 TableName: 'Events',
        //                 Key: {
        //                     id: digChannelObject.id,
        //                     type: digChannelObject.type,
        //                 },
        //                 UpdateExpression: 'set #public = :tru',
        //                 ExpressionAttributeNames: {
        //                     '#public': 'public',
        //                 },
        //                 ExpressionAttributeValues: {
        //                     ':tru': true,
        //                 },
        //             }
        //             await dbUpdate(digUpdateParams, dbClient)

        //             const replyMessage = await message.channel.send(
        //                 'Message received'
        //             )
        //             replyMessage.delete(15000)
        //             message.author.send(
        //                 'Yarghhhh treasure acquired me bucko! Have some pants'
        //             )
        //         }
        //     } else {
        //         const updateParams = {
        //             TableName: 'Users',
        //             Key: { id: message.author.id },
        //             UpdateExpression: 'set #lastDig = :value',
        //             ExpressionAttributeNames: { '#lastDig': 'lastDig' },
        //             ExpressionAttributeValues: {
        //                 ':value': currentTime.unix(),
        //             },
        //         }
        //         await dbUpdate(updateParams, dbClient)
        //         const replyMessage = await message.channel.send(
        //             'Message received'
        //         )
        //         replyMessage.delete(15000)
        //         message.author.send(
        //             'Argh a valiant attempt, try again tomorrow!'
        //         )
        //     }
        // } else {
        const replyMessage = await message.reply(
            'Digging under construction, come back soon!'
        )
        replyMessage.delete(15000)
        message.author.send('Digging under construction, come back soon!')
        // }
    },
}
