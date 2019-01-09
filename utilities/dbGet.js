const AWS = require('aws-sdk')

const docClient = new AWS.DynamoDB.DocumentClient({ region: 'us-east-2' })

module.exports = function dbGet(params) {
    return new Promise((resolve, reject) => {
        try {
            docClient.get(params, (err, data) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(data.Item.balance)
                }
            })
        } catch (err) {
            reject(err)
        }
    })
}
