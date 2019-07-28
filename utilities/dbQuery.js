module.exports = function dbQuery(params, dbClient) {
    return new Promise((resolve, reject) => {
        try {
            dbClient.query(params, (err, data) => {
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
