module.exports = function dbTransaction(params, dbClient) {
    return new Promise((resolve, reject) => {
        try {
            dbClient.transactWrite(params, (err, data) => {
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
