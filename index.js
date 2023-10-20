const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config()
// require("dotenv").config();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json())



const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_NAME}:${process.env.DB_PASSWORD}@trigun-cars.tfbanll.mongodb.net/?retryWrites=true&w=majority`;


const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        await client.connect();





        await client.db("admin").command({ ping: 1 });
        console.log("✅✅✅✅ connected to MongoDB! ✅✅✅✅");
    } finally {
        await client.close();
    }
}
run().catch(console.dir);





app.get('/', (req, res) => {
    res.send("Trigun server")
})


app.listen(port)
