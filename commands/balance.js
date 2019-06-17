const dbGet = require('../utilities/dbGet')

module.exports = {
    name: 'balance',
    description: 'Check balance',
    usage: '',
    cooldown: 5,
    aliases: [],
    async execute(message, args, dbClient) {
        if (!args.length) {
            const params = {
                TableName: 'Users',
                Key: { id: message.author.id },
                ProjectionExpression: 'balance',
            }
            const dbData = await dbGet(params, dbClient)
            if (Object.entries(dbData).length !== 0) {
                message.channel.send(`Your balance is ${dbData.Item.balance}`)
            } else {
                message.channel.send(
                    "You've never received currency before, check again later once you have some!"
                )
            }
        } else {
            message.channel.send(`You can only check your own balance`)
        }
    },
}
