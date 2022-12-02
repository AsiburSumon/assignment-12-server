const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const { query } = require('express');
require('dotenv').config();
const port = process.env.PORT || 5000;

const app = express();

app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.jbfysym.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri)
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run (){
    try{
        const categoriesCollection = client.db('hondaBd').collection('categories');
        const productsCollection = client.db('hondaBd').collection('products');
        const bookCollection = client.db('hondaBd').collection('orders');
        const usersCollection = client.db('hondaBd').collection('users');

        // get categories
        app.get('/categories', async (req, res) => {
            const query = {};
            const categories = await categoriesCollection.find(query).toArray();
            res.send(categories)
        })

        // get products
        app.get('/products', async (req, res) => {
            const query = {};
            const products = await productsCollection.find(query).toArray();
            res.send(products);
        })

        app.get('/products/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id)};
            const product =await productsCollection.findOne(query)
            res.send(product);
        })

        // add orders
        app.get('/bookingOrders', async (req, res) => {
            const query = {};
            const products = await bookCollection.find(query).toArray();
            res.send(products);
        })

        app.post('/bookingOrders', async (req, res) => {
            const bookedProduct = req.body;
            const result = await bookCollection.insertOne(bookedProduct);
            res.send(result);
        })
    }
    finally{

    }
}
run().catch(err => console.error(err));

app.get('/', (req, res) => {
    res.send('server for assignment is running');
});

app.listen(port, () => console.log(`Server is running on ${port}`))