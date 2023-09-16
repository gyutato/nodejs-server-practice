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

app.get('/detail/:id', function(req, res){
  const _id = parseInt(req.params.id)
  db.collection('post').findOne({_id}, function(err, _res){
    res.render('detail.ejs', {data: _res})
  })
})

app.post('/add', function(req, res){
  res.redirect('/write')
  db.collection('counter').findOne({name: '게시물 갯수'}, function(err, res){
    let count = res.totalPost
    db.collection('post').insertOne({...req.body, _id: count + 1}, function(err, res){
      db.collection('counter').updateOne({name: '게시물 갯수'}, {$inc: {totalPost: 1}}, function() {})
    });
  })

})

app.delete('/delete', function(req, res){
  console.log(req.body)
  req.body._id = parseInt(req.body._id)
  db.collection('post').deleteOne(req.body, function(err, res){
    console.log('삭제완료', req.body._id)
  })
})