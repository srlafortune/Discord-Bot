const dbTransaction = require('../utilities/dbTransaction')

module.exports = {
    name: 'purchase',
    description: 'Purchase item from the shop',
    usage: '<item>',
    guildOnly: true,
    args: true,
    cooldown: 5,
    aliases: ['buy'],
    async execute(message, args, dbClient) {
        message.channel.send('Pong.')
        const params = {
            TransactItems: [
                {
                    Update: {
                        TableName: 'Shop',
                        Key: { id: args[1] },
                        ConditionExpression: 'available = :true',
                        UpdateExpression:
                            'set available = :false, ' + 'ownedBy = :player',
                        ExpressionAttributeValues: {
                            ':true': true,
                            ':false': false,
                            ':player': playerId,
                        },
                    },
                },
                {
                    Update: {
                        TableName: 'Users',
                        Key: { id: { playerId } },
                        ConditionExpression: 'coins >= :price',
                        UpdateExpression:
                            'set coins = coins - :price, ' +
                            'inventory = list_append(inventory, :items)',
                        ExpressionAttributeValues: {
                            ':items': [itemId],
                            ':price': itemPrice.toString(),
                        },
                    },
                },
            ],
        }
        await dbTransaction(params, dbClient)
    },
}
