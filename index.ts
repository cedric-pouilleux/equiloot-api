import {Express} from 'express';
import express from 'express';
import { MongoClient } from "mongodb";

var cors = require('cors');

const uri: string = process.env.MONGO_URL!;

const app: Express = express();
  
app.use(cors())
 
app.get('/items', async (req, res) => {
    const client = new MongoClient(uri);
    console.log(process.env.NODE_ENV);
    try {
        await client.connect(); 
        await client.db("equiloot").command({ ping: 1 });
    } finally { 
        await client.close();
    }
    res.json({
        '00105': 'bare2'
    })
})

app.listen(4000, '0.0.0.0');
