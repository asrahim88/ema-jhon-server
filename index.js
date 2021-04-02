const express = require('express');
const port = 8000;
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();
const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.6cglq.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const app = express();
app.use(bodyParser.json());
app.use(cors());

// mongo
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const collection = client.db("emaJhonStore").collection("products");
    const ordersCollection = client.db("emaJhonStore").collection("orders");

    // post to database 
    app.post('/addProduct', (req, res) => {
        const product = req.body;
        console.log(product);
        collection.insertOne(product)
            .then(result => {
                res.send(result.insertedCount)
            })
    })

    // orders post to database
    app.post('/addOrder', (req, res) => {
        const order = req.body;
        ordersCollection.insertOne(order)
            .then(result => {
                res.send(result.insertedCount > 0) 
            })
    })


    //  load all data from database read data from database
    app.get("/products", (req, res) => {
        collection.find({})
            .toArray((error, documents) => {
                res.send(documents);
            })
    })

    //  load single data from database read data from database
    app.get("/product/:key", (req, res) => {
        collection.find({ key: req.params.key })
            .toArray((error, documents) => {
                res.send(documents[0]);
            })
    })

    // load data by keys from database or read data by keys from database
    app.post('/productsByKeys', (req, res) => {
        const productsKye = req.body;
        collection.find({ key: { $in: productsKye } })
            .toArray((error, documents) => {
                res.send(documents);
            })
    })
});

// // mongo 


app.listen(process.env.PORT || port)