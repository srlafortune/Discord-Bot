module.exports = function dbUpdate(params, dbClient) {
    return new Promise((resolve, reject) => {
        try {
            dbClient.update(params, (err, data) => {
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
