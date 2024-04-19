import {Express} from 'express';
import cors from 'cors';
import express from 'express';
import { MongoClient } from "mongodb";

const uri = "mongodb://localhost:27017";

//const uri = "mongodb://mongo:27017";         
//with docker

const app: Express = express();
  
app.use(cors())  
 
app.get('/items', async (req, res) => {
    const client = new MongoClient(uri);
    try {
        await client.connect();
        await client.db("equiloot").command({ ping: 1 });

    } finally {
        await client.close();
    }
    res.json({
        'foot': 'bare2'
    })
})

app.listen(4000, '0.0.0.0')
