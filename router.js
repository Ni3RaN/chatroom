let express = require('express');
let User = require('./models/User');

let router = express.Router();

router.get('/', function (req, res) {
    let user = req.session.user;
    console.log('是否登陆：', user);
    if (user) {
        res.render('index.html', {
            user
        });
    }
    else {
        res.redirect('/login');
    }
});

// 聊天界面
router.get('/index', function (req, res) {
    let user = req.session.user;
    if (user) {
        res.render('index.html', {
            user
        });
    }
    else {
        res.redirect('/login');
    }
});

// 登录页面
router.get('/login', function (req, res) {
    res.render('login.html');
});

// 处理登录请求
router.post('/login', async function (req, res) {
    let body = req.body;
    console.log('用户请求登录：', body);
    let user = await User.findOne(body);
    if (!user) {
        return res.status(200).json({
            err_code: 1,
            message: "昵称或密码错误"
        });
    }
    req.session.user = user;
    console.log('当前登录用户：', user);
    return res.status(200).json({
        err_code: 0,
        message: "登录成功",
        avatar: user.avatar
    });
});

// 注册页面
router.get('/register', function (req, res) {
    res.render('register.html');
});

// 处理注册请求
router.post('/register', async function (req, res) {
    let body = req.body;
    console.log('用户请求注册：',body);
    let result = await User.findOne({
        nickname: body.nickname,
    });
    if (result) {
        return res.status(200).json({
            err_code: 1,
            message: '昵称已存在'
        })
    }

    let user = new User(body);
    await user.save();
    // req.session.user = user;
    return res.status(200).json({
        err_code: 0,
    })
});


module.exports = router;