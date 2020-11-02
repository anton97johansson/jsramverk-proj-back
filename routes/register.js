var express = require('express');
var router = express.Router();
const mongo = require("mongodb").MongoClient;
const dsn = "mongodb://localhost:27017/jsramverkproj";
const bcrypt = require('bcryptjs');
const saltRounds = 10;

router.post('/', async function(req, res, next) {
    const data = {
        data: {
            msg: "Created"
        }
    };
    bcrypt.hash(req.body.password, saltRounds, async function(err, hash) {
        let obj = {user: req.body.email, password: hash, money: 0, amount: 0} ;
        try {
            let result = await insertInCollection(dsn, "users", obj);
            return res.status(200).json(result);
        } catch (err) {
            console.log(err);
            return res.status(500).json(err);
        }
    });

});

async function insertInCollection(dsn, colName, obj) {
    const client  = await mongo.connect(dsn);
    const db = await client.db();
    const col = await db.collection(colName);
    const response = await col.insertOne(obj);

    await client.close();

    return response;
}


module.exports = router;