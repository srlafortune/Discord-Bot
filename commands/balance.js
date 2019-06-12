const dbGet = require('../utilities/dbGet')

module.exports = {
    name: 'balance',
    description: 'Check balance',
    usage: '',
    cooldown: 5,
    aliases: [],
    async execute(message, args, dbClient) {
        const params = {
            TableName: 'Users',
            Key: { id: message.author.id },
            ProjectionExpression: 'balance',
        }
        const dbData = await dbGet(params, dbClient)
        message.channel.send(dbData.Item.balance)
    },
}
