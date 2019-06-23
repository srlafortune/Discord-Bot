const dbUpdate = require('../utilities/dbUpdate')

module.exports = {
    name: 'transfer',
    description: 'Transfer money to user',
    usage: '<user> <amount>',
    args: true,
    async execute(message, args, dbClient) {
        const taggedUser = message.mentions.users.first()
        if (!message.member.roles.some(role => role.name === 'Admiral')) {
            return message.reply(
                'you need the admin role to transfer currency!'
            )
        }
        if (!message.mentions.users.size) {
            return message.reply(
                'you need to tag a user in order to transfer money to them!'
            )
        }

        const params = {
            TableName: 'Users',
            Key: { id: taggedUser.id },
            UpdateExpression:
                'set #balance = if_not_exists(#balance, :zero) + :value',
            ExpressionAttributeNames: { '#balance': 'balance' },
            ExpressionAttributeValues: {
                ':value': parseInt(args[1]),
                ':zero': 0,
            },
        }
        await dbUpdate(params, dbClient)
        message.channel.send(`You've transfered ${parseInt(args[1])} to ${taggedUser.username}`)
    },
}
