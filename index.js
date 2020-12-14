const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const ObjectId = require('mongodb').ObjectId;
const fs= require('fs');
const fileUpload = require('express-fileupload');

const app = express()
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(fileUpload());

const port = 8000

app.get('/', (req, res) => {
  res.send('Hello World!')
})

const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://reactCrud:reactCrud@cluster0.scmea.mongodb.net/reactCrud?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true , useUnifiedTopology: true });
client.connect(err => {
  const informationCollection = client.db("reactCrud").collection("information");
  // perform actions on the collection object
  console.log("hello i am connect");

  app.post('/addInformation', (req,res) => {
    const name = req.body.name;
    const email = req.body.email;
    const phone = req.body.phone;
    const description = req.body.description;
    
    informationCollection.insertOne({name,email,phone,description})
    .then(result =>{
        res.send(result.insertedCount>0)
    })

  })

  app.get('/readOrder',(req,res) => {
    informationCollection.find({})
    .toArray((err , documents)=>{
      res.send(documents)
    })
  })

  app.delete('/delete/:id', (req, res) =>{
    informationCollection.deleteOne({_id: ObjectId(req.params.id)})
    .then( result => {
      res.send(result.deletedCount > 0);
    })
  })

  app.patch('/update/:id', (req, res) => {
    informationCollection.updateOne({_id: ObjectId(req.params.id)},
    {
      $set: {name: req.body.name, email: req.body.email}
    })
    .then (result => {
      res.send(result.modifiedCount > 0)
    })
  })
});

app.listen(port)