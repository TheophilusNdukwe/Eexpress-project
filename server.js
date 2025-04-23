const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient

var db, collection;

const url = `mongodb+srv://${process.env.USER_ID}:${process.env.DB_password}@cluster0.vhrw8jw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
const dbName = "CryptoLedger";

app.listen(3000, () => {
    MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, (error, client) => {
        if(error) {
            throw error;
        }
        db = client.db(dbName);
        console.log("Connected to `" + dbName + "`!");
    });
});

app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use(express.static('public'))

app.get('/', (req, res) => {
  db.collection('transactions').find().toArray((err, result) => {
    if (err) return console.log(err)
    res.render('index.ejs', {transactions: result})
  })
})

app.post('/transactions', (req, res) => {
  db.collection('transactions').insertOne({coin: req.body.coin, buyPrice: req.body.buyPrice, amount: req.body.amount, audit: false}, (err, result) => {
    if (err) return console.log(err)
    console.log('saved to database')
    res.redirect('/')
  })
})

app.put('/transactions', (req, res) => {
  db.collection('transactions').findOneAndUpdate({ coin: req.body.coin, buyPrice: req.body.buyPrice, amount: req.body.amount },{
      $set: {
      audit: true
    }
  }, {
    sort: {_id: -1},
    upsert: true
  }, (err, result) => {
    if (err) return res.send(err)
    res.send(result)
  })
})


app.delete('/transactions', (req, res) => {
  db.collection('transactions').findOneAndDelete({coin: req.body.coin, buyPrice: req.body.buyPrice, amount: req.body.amount}, (err, result) => {
    if (err) return res.send(500, err)
    res.send('Message deleted!')
  })
})
