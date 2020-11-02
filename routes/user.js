var express = require('express');
const { MongoClient } = require("mongodb");
var router = express.Router();
const mongo = require("mongodb").MongoClient;
const dsn = "mongodb://localhost:27017/jsramverkproj";
const jwt = require('jsonwebtoken');

let config;
try {
    config = require('../config/config.json');
} catch (error) {
    console.error(error);
}

const jwtSecret = process.env.JWT_SECRET || config.secret;

router.post('/', (req, res, next) => checkToken(req, res, next),
async function (req, res, next) {
    try {
        let obj = {"user": req.body.email};
        let result = await findUser(dsn, "users", obj);
        delete result.password;
        return res.status(200).json(result);
    } catch (err) {
        console.log(err);
        return res.status(500).json(err);
    }

});

router.put('/', (req, res, next) => checkToken(req, res, next),
async function (req, res, next) {
    try {
        let obj = req.body;
        let update = await updateUser(dsn, "users", obj)
        console.log(update);
        let result = await findUser(dsn, "users", {"user": obj.user});
        delete result.password;
        return res.status(200).json(result);
    } catch (err) {
        console.log(err);
        return res.status(500).json(err);
    }

});

async function findUser(dsn, colName, obj) {
    const client  = await mongo.connect(dsn);
    const db = await client.db();
    const col = await db.collection(colName);
    const response = await col.findOne(obj);

    await client.close();

    return response;
}

async function updateUser(dsn, colName, obj) {
    let user = {"user": obj.user};
    let change = {$set: obj.change};
    const client  = await mongo.connect(dsn);
    const db = await client.db();
    const col = await db.collection(colName);
    const response = await col.updateOne(user, change);

    await client.close();

    return response;
}

function checkToken(req, res, next) {
    const token = req.headers['x-access-token'];

    jwt.verify(token, jwtSecret, function(err, decoded) {
        if (err) {
            return res.status(401).json({
                errors: {
                    status: 401,
                    source: "/report",
                    title: "Could not autheticate token",
                    detail: "Could not autheticate token"
                }
            });
        }

        // Valid token send on the request
        next();
    });
}
module.exports = router;