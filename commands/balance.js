const AWS = require('aws-sdk')
const dbGet = require('../utilities/dbGet')

const docClient = new AWS.DynamoDB.DocumentClient({ region: 'us-east-2' })

module.exports = {
    name: 'balance',
    description: 'Check balance',
    usage: '',
    cooldown: 5,
    aliases: [],
    async execute(message, args) {
        const params = {
            TableName: 'Users',
            Key: { id: message.author.id },
            ProjectionExpression: 'balance',
        }
        const balance = await dbGet(params)
        message.channel.send(balance)
    },
}
