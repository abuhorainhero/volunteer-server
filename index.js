const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config();
const ObjectId = require('mongodb').ObjectId

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.vss5k.mongodb.net/VolunteerDB?retryWrites=true&w=majority`;

const app = express();

app.use(bodyParser.json());
app.use(cors());

const port = 5000;


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const volunteerCollection = client.db("VolunteerDB").collection("VolunteerInfo");
    const volunteerUserCollection = client.db("VolunteerDB").collection("VolunteerUser");

    app.post('/addVolunteerInfo', (req, res) => {
        const info = req.body;
        volunteerCollection.insertOne(info)
            .then(result => {
                res.send(result.insertedCount > 0)
            })
    })
    app.get('/volunteerInfo', (req, res) => {
        volunteerCollection.find({})
        .toArray((err, documents) => {
            res.send(documents);
        })
    })


    app.post('/addVolunteerUser', (req, res) => {
        const userInfo = req.body;
        console.log(userInfo);
        volunteerUserCollection.insertOne(userInfo)
        .then(result => {
            res.send(result.insertedCount > 0)
        })
    })
    app.get('/volunteerEvents', (req, res) => {
        volunteerUserCollection.find({email: req.query.email})
        .toArray((err, documents) => {
            res.send(documents);
        })
    })
    app.get('/adminPanel', (req, res) => {
        volunteerUserCollection.find({})
        .toArray((err, documents) => {
            res.send(documents);
        })
    })
    app.delete('/deleteRegister/:id', (req, res) => {
        console.log(req.params.id)
        volunteerUserCollection.deleteOne({_id: ObjectId(req.params.id)})
        .then(result => {
            res.send(result.deletedCount > 0);
        })
    })


});


app.get('/', (req, res) => {
    res.send('Hello volunteer SERVER')
})

app.listen( process.env.PORT || port)