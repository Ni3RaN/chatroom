let express = require('express');
const Message = require('./models/Message');
const crypto = require('crypto');
let User = require('./models/User');

let router = express.Router();

router.get('/', function(req, res) {
    let user = req.session.user;
    console.log('是否登录：', user);
    if (user) {
        res.render('index.html', {
            user
        });
    } else {
        res.redirect('/login');
    }
});

// 聊天界面
router.get('/index', function(req, res) {
    let user = req.session.user;
    console.log('是否登录：', user);
    if (user) {
        res.render('index.html', {
            user
        });
    } else {
        res.redirect('/login');
    }
});

// 登录页面
router.get('/login', function(req, res) {
    res.render('login.html');
});

// 处理登录请求
router.post('/login', async function(req, res) {
    let body = req.body;
    let salt = await User.find({
        nickname: body.nickname,
    });
    if (salt.length == 0) {
        return res.status(200).json({
            err_code: 1,
            message: "昵称或密码错误"
        });
    }
    let newPwd = cryptPwd(body.password, salt[0].salt);
    body.password = newPwd;
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
router.get('/register', function(req, res) {
    res.render('register.html');
});

// 处理注册请求
router.post('/register', async function(req, res) {
    let body = req.body;
    console.log('用户请求注册：', body);
    let result = await User.findOne({
        nickname: body.nickname,
    });
    if (result) {
        return res.status(200).json({
            err_code: 1,
            message: '昵称已存在'
        })
    }
    let createtime = new Date();
    let salt = createtime + getRandomSalt();
    let newPwd = cryptPwd(body.password, salt);
    body.password = newPwd;
    body.salt = salt;
    let user = new User(body);
    await user.save();
    // req.session.user = user;
    return res.status(200).json({
        err_code: 0,
    });
});

router.get('/info', function(req, res) {
    let user = req.session.user;
    if (user) {
        res.render('info.html', {
            user
        });
    } else {
        res.redirect('/login');
    }
});

router.post('/info', async function(req, res) {
    let body = req.body;
    let user = req.session.user;

    console.log('用户请求更新信息：', body);

    let result = await User.findOne({
        nickname: body.nickname,
    });

    if (result && body.nickname != user.nickname) {
        return res.status(200).json({
            err_code: 1,
            message: '昵称已存在'
        });
    }

    User.deleteMany({ nickname: user.nickname }, function(err, res) {
        if (res) {
            console.log('删除成功');
        }
    });

    user = new User({
        nickname: body.nickname,
        password: body.password,
        avatar: body.avatar
    });

    await user.save();

    req.session.user = user;
    return res.status(200).json({
        err_code: 0,
        message: '修改成功'
    });
});

//聊天记录持久化
router.post('/getmessage', async function(req, res) {
    myDate = new Date();

    myDate.setDate(myDate.getDate() - 1);

    let messages = await Message.find({
        date: { $gte: myDate }
    });

    messages = messages.map(messages => ({
        nickname: messages.nickname,
        avatar: messages.avatar,
        message: messages.message,
        date: messages.date
    }));
    return res.status(200).json(messages);


});

router.post('/message', async function(req, res) {
    let body = req.body;
    console.log('聊天记录：', body);
    let message = new Message(body);
    await message.save();
    return res.status(200).json({
        err_code: 0,
        message: '保存成功'
    });
});

// 退出登录的请求
router.post('/logout', function(req, res) {
    req.session.user = null;
    return res.status(200).json({
        err_code: 0,
        message: "已退出"
    })
});

function getRandomSalt() {
    return Math.random().toString().slice(2, 5);
}

function cryptPwd(password, salt) {
    let saltPassword = password + ':' + salt;
    let md5 = crypto.createHash('md5');
    let result = md5.update(saltPassword).digest('hex');
    return result;
}

module.exports = router;