const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const port = process.env.PORT || 3000;
const app = express();

app.use(cors());
app.use(express.json());


console.log(process.env.DB_USER)
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster1.ngcynwn.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        client.connect();

        const toys_collection = client.db("games-frenzy").collection("toys")

        app.get("/toys", async (req, res) => {
            const toys = toys_collection.find()
            const result = await toys.toArray()
            res.send(result)
        })

        app.get("/toy/:id", async (req, res) => {
            const id = req.params.id;
            const toy = await toys_collection.findOne({ _id: new ObjectId(id) })
            res.send(toy)
        })

        app.get('/seller', async (req, res) => {
            console.log(req.query.email);
            let query = {};
            if (req.query?.email) {
                query = { seller_email: req.query.email }
            }
            const result = await toys_collection.find(query).toArray();
            res.send(result);
        })

        app.post("/add-toy", async (req, res) => {
            const data = req.body
            const toy = {
                photo_url: data.photo_url,
                name: data.name,
                seller_name: data.seller_name,
                seller_email: data.seller_email,
                sub_category: data.sub_category,
                price: data.price,
                rating: data.rating,
                quantity: data.quantity,
                description: data.description
            }
            console.log(toy)
            const result = await toys_collection.insertOne(toy)
            res.send(result)
        })

        app.put("/update/:id", async (req, res) => {
            const id = req.params.id
            const data = req.body
            const result = await toys_collection.updateOne({_id: new ObjectId(id)}, {
                $set: {
                  photo_url: data.photo_url,
                  name: data.name,
                  seller_name: data.seller_name,
                  seller_email: data.seller_email,
                  sub_category: data.sub_category,
                  price: data.price,
                  rating: data.rating,
                  quantity: data.quantity,
                  description: data.description
                }},
                {
                    upsert: true
                }
            )
            res.send(result)
        })
        

        app.delete("/delete/:id", async (req, res) => {
            const id = req.params.id
            const result = await toys_collection.deleteOne({ _id: new ObjectId(id) })
            res.send(result)
        })


        // Send a ping to confirm a successful connection
        client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('assignment is running...... life is fata fata');
})

app.listen(port)




