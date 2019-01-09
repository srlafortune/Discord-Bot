const AWS = require('aws-sdk')

const docClient = new AWS.DynamoDB.DocumentClient({ region: 'us-east-2' })

module.exports = {
    name: 'transfer',
    description: 'Transfer money to user',
    usage: '<user> <amount>',
    args: true,
    execute(message, args) {
        const taggedUser = message.mentions.users.first()

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
        docClient.update(params, (err, data) => {
            if (err) {
                console.log(err)
            } else {
                console.log(data)
            }
        })
    },
}
