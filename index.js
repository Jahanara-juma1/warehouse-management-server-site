const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const port = process.env.PORT || 5000;


const app = express();

//middleware
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.vsg2t.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
    try{
         await client.connect();
         const serviceCollection = client.db('warehousemanagement').collection('site');
         const orderCollection = client.db('warehousemanagement').collection('order');

         //AUTH
         app.post('/login', async(req, res) =>{
             const user = req.body;
             const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
               expiresIn: '1d'
             });
             res.send({accessToken});
         })

          // Services API

        app.get('/site', async(req, res) =>{
          const query = {};
          const cursor = serviceCollection.find(query);
          const services = await cursor.toArray();
          res.send(services);
        });

        app.get('/site/:id', async(req, res) =>{
          const id = req.params.id;
          const query={_id: ObjectId(id)};
          const service = await serviceCollection.findOne(query);
          res.send(service);
        })

        // POST
        app.post('/site', async(req, res) =>{
          const newService = req.body;
          const result = await serviceCollection.insertOne(newService);
          res.send(result);
        })

        // Delete
        app.delete('/site/:id', async(req, res) =>{
          const id = req.params.id;
          const query = {_id: ObjectId(id)};
          const result = await serviceCollection.deleteOne(query);
          res.send(result);
        });

        

    }
    finally{

    }
}

run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('Running warehouse server');
});

app.listen(port, () =>{
    console.log('Listening to port', port);
})