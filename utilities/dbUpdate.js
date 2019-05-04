module.exports = function dbUpdate(params, dbClient) {
    return new Promise((resolve, reject) => {
        try {
            dbClient.update(params, (err, data) => {
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
