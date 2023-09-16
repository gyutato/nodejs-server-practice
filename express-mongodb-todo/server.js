const express = require('express')
const MongoClient = require('mongodb').MongoClient;
const app = express();

app.use(express.urlencoded({extended: true})) 
app.set('view engine', 'ejs')

let db;
MongoClient.connect('mongodb+srv://gyutato:Qksksk!15@cluster0.vismpye.mongodb.net/?retryWrites=true&w=majority', 
  function(err, client){
    if (err) {
      return console.error(err)
    }

    db = client.db('todoApp')

    app.listen(8080, function(){
      console.log('listening on 8080')
    })
  }
)

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html')
})

app.get('/write', function(req, res){
  res.sendFile(__dirname + '/write.html')
})

app.get('/list', function(req, res){
  db.collection('post').find().toArray(function(err, _res){
    res.render('list.ejs', {posts: _res})
  });
})

app.post('/add', function(req, res){
  res.redirect('/write')
  db.collection('post').insertOne(req.body, function(err, res){});
})