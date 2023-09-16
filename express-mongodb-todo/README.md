# express-mongoDB-TODO
express와 mongoDB를 사용해 TODO CRUD에 필요한 API를 구현합니다.

### REST API
- REST한 API
- API: Application Programming Interface
  - 서버와 클라이언트 간의 요청 방식 (규약)
- REST: Representational State Transfer
  - **Uniform interface**
    - 하나의 URL이 하나의 자료를 나타냄
    - URL이 예측 가능해야 함 (일정한 규칙을 따라야 함)
    - 요청과 응답에 충분한 정보가 들어있어야 함
- Client(요청) - Server(응답) 역할 구분
  - Stateless
    - 클라이언트의 정보를 기억하지 않음
    - 각 요청 사이에 의존성이 없어야 함
  - Cacheable
    - 캐싱을 지원해야 함
  - Layered system
  - Code on demand

### 서버란?
- 클라이언트의 **요청**을 받으면 서비스, 데이터를 제공하는 컴퓨터 혹은 **프로그램**

### Express
- 노드 기반의 서버 **프레임워크**
  ```js
  // 기본 라우팅을 위한 express 인스턴스 생성
  const app = express()
  ```
- `listen()`: UNIX 소켓을 시작하고, 클라이언트 요청을 수신 대기 
  - 노드의 http.Server.listen()와 동일
  ```js
  app.listen(8080, function(){
    console.log('listening on 8080')
  })
  ```
- `Routing`: 서버가 특정 엔드포인트에 대한 클라이언트 요청에 응답하는 방법
  - 경로 + 요청 메서드 (ex. HTTP: GET, POST, ...) + 핸들러
  ```js
  app.METHOD(PATH, HANDLER)

  app.get('/', (req, res) => {
    res.send('Hello World!')
  })

  app.post('/', (req, res) => {
    res.send('Got a POST request')
  })
  ```
- response(`res`) 객체 역시 메서드를 가짐 [(docs)](https://expressjs.com/en/guide/routing.html)
  - `status`, `send`, `sendFile`, `json`, `render`, `redirect`, ...
    ```js
    res.status(400).send({message: '실패했습니다'})
    ```
  - res 메서드 중 하나를 반드시 호출해야 한다. (브라우저가 멈춤)


### MongoDB
- MongoDB Atlas
  - DB 호스팅 (DB를 컴퓨터에 설치하는 대신, 클라우드에 띄워서 접속)
    - Database: 어플리케이션의 전체 데이터 (저장 공간)
    - Collections: 각 데이터 묶음
  - Clusters - Connect Application 
    - server.js에서 MongoClient.connect()로 connect
      ```js
      MongoClient.connect('mongodb+srv://username:password@cluster0.vismpye.mongodb.net/?retryWrites=true&w=majority', 
        function(err, client){
          if (err) {
            return console.error(err)
          }

          app.listen(PORT, function(){
              console.log(`listening on ${PORT}`)
          })
        }
      )
      ```
    - DB에 connect 되었을 때만 서버가 실행되도록 connect() 의 콜백 안에서 listen
- `MongoClient`: MongoDB에 연결(connect)하기 위한 클래스
  ```js
  const MongoClient = require('mongodb').MongoClient;
  MongoClient.connect(url, function(err, client) {...});
  ```
  - `connect()`: Connect to MongoDB using a url
- DB 접근: `db()`
  ```js
  function(err, client){
    let db = client.db('todoApp')   
  }
  ```
  - Create a new Db instance sharing the current socket connections(that of `client`).
- collections 접근: `db.collections()`
  ```js
  function(err, client){
    let db = client.db('todoApp')
    db.collections('post').insertOne({data}, function(err, res){...})
  }
  ```
- DB 업데이트: update 메서드
 - `updateOne()` 등
 - 갱신 제한자(update operators): 문서의 부분 갱신 연산을 효율적으로 수행하는 데 사용되는 특수 키
   - `$set`, `$inc`, `$unset`, ...

### AJAX
- 새로고침 없이 서버 요청을 구현하는 데 사용되는 JS 문법
  - 페이지 전체가 아닌, 데이터가 업데이트된 UI만 갱신할 수 있음
- `$.ajax()`: jQuery를 사용한 ajax 메서드 **(추후 jQuery 삭제 및 fetch로 수정 예정)**
  ```js
  $('.delete').click((e) => {
    $.ajax({
    method: 'DELETE',
    url: '/delete',
    data: {_id: e.target.dataset.id}
    })
      .done(function(res){...})
      .fail(function(res){...})
  })
  ```
  - method: 요청 메서드
  - data: 요청 payload. 서버에서 req.body 필드로 확인
  - url: 요청 엔드포인트
  - 위 예시의 DELETE 요청의 경우, 페이지 UI 상의 변화는 없음. (페이지가 들고 있던 데이터의 값이 변한 게 없으므로)
    - 따라서 강제로 페이지를 새로고침하거나, done 콜백 안에서 해당 엘리먼트를 삭제하는 식의 로직이 필요함

### URL Parameter
```js
app.get('/detail/:id', function(req, res){
  db.collection('post').findOne({_id: req.params.id}, function(err, _res){
    res.render('detail.ejs', {post: _res})
  })
})
```
- `:{paramKey}`: url 파라미터
  - 함수의 파라미터가 함수에서 사용되는 변수인 것처럼, url 파라미터 역시 해당 url의 변수와 같이 사용함
- 서버에서 `req.params` 필드로 접근 가능