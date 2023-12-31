const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 3000

// Middleware
app.use(cors());
app.use(express.json())






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
        // await client.connect();


        const brandDB = client.db("trigun-db").collection("brandDB");
        const carsDB = client.db("trigun-db").collection("carsDB");
        const userCart = client.db("trigun-db").collection("userCart");

        // brandDB ===============
        app.get('/brands', async (req, res) => {
            const cursor = brandDB.find();
            const result = await cursor.toArray();
            res.send(result)
        })

        // carsDB ==================
        app.get('/display', async (req, res) => {
            const cursor = carsDB.find();
            const result = await cursor.toArray();
            res.send(result)
        })

        app.get('/display/:brand', async (req, res) => {
            const brand = req.params.brand;
            const query = { brand_name: brand };
            const result = await carsDB.find(query).toArray();
            res.send(result);
        })

        app.get('/cardata/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await carsDB.findOne(query);
            res.send(result);
        })

        app.post('/cardata', async (req, res) => {
            const carData = req.body;
            const result = await carsDB.insertOne(carData);
            res.send(result);
        })

        app.put('/cardata/:id', async (req, res) => {
            const id = req.params.id;
            const data = req.body;
            const query = { _id: new ObjectId(id) };
            const updatedData = {
                $set: data
            }
            const result = await carsDB.updateOne(query, updatedData)
            res.send(result)
        })

        // userCart ============  
        app.get('/cart/:email', async (req, res) => {
            const userEmail = req.params.email;
            const query = { userEmail: userEmail };
            const result = await userCart.find(query).toArray();
            res.send(result);
        })     


        app.post('/addtocart', async (req, res) => {
            const cart = req.body;
            const result = await userCart.insertOne(cart);
            res.send(result);
        })

        app.delete('/cart/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await userCart.deleteOne(query);
            res.send(result);
        })




        console.log("✅✅✅✅ connected to MongoDB! ✅✅✅✅");
    } finally {
        // await client.close();
    }
}
run().catch(console.dir);





app.get('/', (req, res) => {
    res.send("Trigun server")
})


app.listen(port)
