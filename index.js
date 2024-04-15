'use strict'
const cors = require('cors')
const express = require('express')
const { MongoClient } = require("mongodb");

const uri = "mongodb://mongo:27017";

const app = express();

app.use(cors());

app.get('/items', async (req, res) => {
    const client = new MongoClient(uri);
    try {
        await client.connect();
        await client.db("equiloot").command({ ping: 1 });
    } finally {
        await client.close();
    }
    res.json({
        'test' : 'test'
    })
})

app.listen(4000, '0.0.0.0')
