const { MongoClient } = require('mongodb')
const _uri = "mongodb://0.0.0.0:27017";
const dbConnection = (collection, cb) => {
    MongoClient.connect(_uri).then(async (client) => {
        const db = await client.db('news_scrapping').collection(collection);
        await cb(db);
        await client.close();
    }).catch();
}

module.exports = dbConnection;