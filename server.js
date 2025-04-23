
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
 require('dotenv').config(); // Load environment variables from .env

var db;

// Environment Variables: ensure they are set before accessing them
const url = `mongodb+srv://${process.env.USER_ID}:${process.env.DB_password}@cluster0.vhrw8jw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
const dbName = "CryptoLedger";

// Connect to MongoDB first, then start the server
MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(client => {
    console.log('Connected to Database');
    db = client.db(dbName);

    // Start the server only after the database is connected
    app.listen(3000, () => {
      console.log('listening on 3000');
    });
  })
  .catch(error => {
    console.error('Database connection error:', error);
    process.exit(1); // Exit the process if the database connection fails
  });

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));

// Middleware to check if the database is connected
const checkDbConnection = (req, res, next) => {
  if (!db) {
    return res.status(500).send('Database connection not ready');
  }
  next();
};

// Apply the middleware to all the routes
app.use(checkDbConnection)

app.get('/', (req, res) => {
  db.collection('transactions').find().toArray()
    .then(results => {
      res.render('index.ejs', { transactions: results });
    })
    .catch(error => {
      console.error('Error fetching transactions:', error);
      res.status(500).send('Error fetching transactions');
    });
});

app.post('/transactions', (req, res) => {
  db.collection('transactions').insertOne(req.body)
    .then(result => {
      console.log('saved to database');
      res.redirect('/');
    })
    .catch(error => {
      console.error('Error saving transaction:', error);
      res.status(500).send('Error saving transaction');
    });
});

app.put('/transactions', (req, res) => {
  db.collection('transactions').findOneAndUpdate({
    coin: req.body.coin,
    buyPrice: req.body.buyPrice,
    amount: req.body.amount
  }, {
    $set: {
      audit: true
    }
  }, {
    sort: { _id: -1 },
    upsert: true
  })
    .then(result => {
      if (result.lastErrorObject.updatedExisting) {
        res.send(result);
      } else {
        res.status(404).send('Document not found or not updated');
      }
    })
    .catch(error => {
      console.error('Error updating transaction:', error);
      res.status(500).send('Error updating transaction');
    });
});

app.delete('/transactions', (req, res) => {
  db.collection('transactions').findOneAndDelete({
    coin: req.body.coin,
    buyPrice: req.body.buyPrice,
    amount: req.body.amount
  })
    .then(result => {
      if (result.value) {
        res.send('Message deleted!');
      } else {
        res.status(404).send('Document not found');
      }
    })
    .catch(error => {
      console.error('Error deleting transaction:', error);
      res.status(500).send('Error deleting transaction');
    });
});