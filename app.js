//app.js文件
let express = require('express');
let User = require('./models/User');
let bodyParser = require('body-parser');
let session = require('express-session');
let app = express();
let server = require('http').createServer(app);
let io = require('socket.io')(server);
let router = require('./router'); 

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use('/',express.static('./public'));

// 配置使用art-template
app.engine('html', require('express-art-template'));

app.use(session({
    secret: 'Nie',
    resave: false,
    saveUninitialized: true
}));
  

let users = [];

app.use(router);

server.listen(1625,function(){
    console.log('localhost:1625');
});
