module.exports = function dbGet(params, dbClient) {
    return new Promise((resolve, reject) => {
        try {
            dbClient.get(params, (err, data) => {
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
