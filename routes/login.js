var express = require('express');
var router = express.Router();
const mongo = require("mongodb").MongoClient;
const dsn = "mongodb://localhost:27017/jsramverkproj";
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
let config;
try {
    config = require('../config/config.json');
} catch (error) {
    console.error(error);
}


const jwtSecret = process.env.JWT_SECRET || config.secret;

router.post('/', async function(req, res, next) {
    let obj = {"user": req.body.email};
    try {
        let dbRes = await findUser(dsn, "users", obj);
        console.log(dbRes);
        if (dbRes != null) {
            bcrypt.compare(req.body.password, dbRes.password, function(err, result) {
            if (err) {
                return res.status(500).json({
                    errors: {
                        status: 500,
                        source: "/login",
                        title: "bcrypt error",
                        detail: "bcrypt error"
                    }
                });
                }
            if (result) {
                console.log("correct");
                let payload = { email: req.body.email };
                let jwtToken = jwt.sign(payload, jwtSecret, { expiresIn: '24h' });
                return res.status(201).json({data: {
                                user: payload,
                                token: jwtToken
                            }});
                }
                return res.status(401).json({
                    errors: {
                        status: 401,
                        source: "/login",
                        title: "wrong password",
                        detail: "wrong password"
                    }
                });

            // res innehåller nu true eller false beroende på om det är rätt lösenord.

        });
        }
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
module.exports = router;