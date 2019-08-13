module.exports = function dbBatchWrite(params, dbClient) {
    return new Promise((resolve, reject) => {
        try {
            dbClient.batchWrite(params, (err, data) => {
                if (err) {
                    console.error(err)
                    reject(err)
                } else {
                    resolve(data)
                }
            })
        } catch (err) {
            console.error(err)
            reject(err)
        }
    })
}
