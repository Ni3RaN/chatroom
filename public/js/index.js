// 1. 连接socket.io服务
let socket = io(window.document.location.host);

// 聊天框
let chatContainer = document.querySelector(".chat-container");

// 如果直接进入该页面，判断当前用户是否登录成功。如果登录成功，就发一个事件给服务器，服务器做一个广播
let currentUser = sessionStorage.getItem('currentUser');


let user_list = document.getElementById('user-list');

let device_icon = document.getElementById('device-icon');

let menus = document.getElementById('menus');

$('#dialogs').on('click', '.weui-dialog__btn', function() {
    $(this).parents('.js_dialog').fadeOut(200);
    $(this).parents('.js_dialog').attr('aria-hidden', 'true');
    $(this).parents('.js_dialog').removeAttr('tabindex');
});

//适配移动端
if (navigator.userAgent.match(/(iPhone|iPod|Android|ios)/i)) {
    user_list.remove();
    device_icon.innerHTML += `
    <i class="layui-icon layui-icon-left btn_logout" id="logout"></i>
    <i class="layui-icon layui-icon-more btn_mine" id="infoChange"></i>
    `;
    let html = `
        <div class="weui-cells weui-cells_form">
            <div class="weui-cell weui-cell_active">
                <div class="weui-cell__bd">
                    <textarea class="weui-textarea mobile_textarea weui-input" id="textareaMsg" rows="1"></textarea>
                </div>
                <i class="layui-icon layui-icon-release sendBtn" id="sendBtn"></i>
            </div>
        </div>
    `;
    menus.innerHTML += html;
} else {
    device_icon.innerHTML += "<i class='layui-icon layui-icon-close btn_logout' id='logout'></i>";
    let html = `
        <div class="inputContainer">
            <div id="textareaMsg" class="contentEdit  weui-input" contenteditable></div>
            <div class="sendContainer">
                <span class="sendTip">按下Ctrl+Enter发送，Enter换行</span>
                <button class="weui-btn weui-btn_primary weui-btn_mini btn_send" id="sendBtn">发送</button>
            </div>
        </div>`;
    menus.innerHTML += html;
}


if (currentUser) {
    console.log('登录成功');
    currentUser = JSON.parse(currentUser);
    socket.emit('loginSuccess', currentUser);
}

// 监听添加用户的消息
socket.on('addUser', function(user) {
    let p = document.createElement('p');
    p.classList.add('tip');
    p.textContent = user.nickname + '进入了聊天室';
    chatContainer.appendChild(p);
    scrollIntoView(chatContainer);
});
// 监听用户列表的消息
socket.on('userList', function(users) {
    if (!navigator.userAgent.match(/(iPhone|iPod|Android|ios)/i)) {
        // 把userList的数据动态渲染到左侧用户列表
        let friendsList = document.querySelector('.friends-list');
        friendsList.innerHTML = '';
        let html = '';
        for (let i = 0; i < users.length; i++) {
            let user = users[i];
            if (user.nickname === currentUser.nickname) {
                continue;
            }
            html += `      
      <div class="user-info">
        <img src="${user.avatar}" class="avatarImg">
        <span>${user.nickname}</span>
      </div>`;
        }
        friendsList.innerHTML += html;

    }
    // 修改聊天室的用户总数
    document.getElementById('userCount').textContent = users.length;
});
// 监听用户离开的消息
socket.on('userLeave', function(user) {
    let p = document.createElement('p');
    p.classList.add('weui-form__tips tips');
    p.textContent = user.nickname + '离开了聊天室';
    chatContainer.appendChild(p);
    scrollIntoView(chatContainer);
});

// 监听用户发送文本内容
socket.on('receiveMessage', function(data) {
    // 把接收到的消息显示到聊天窗口中，需要区分这个消息是自己的还是其他人发的
    let sendUser = data.sendUser;
    let html = '';
    let myDate = new Date();

    console.log(myDate);

    axios.post('/message', {
        'nickname': sendUser.nickname,
        'avatar': sendUser.avatar,
        'message': data.message,
        'date': myDate
    }).then(res => {
        let err_code = res.data.err_code;
    });

    if (sendUser.nickname === currentUser.nickname) {
        // 自己发的消息
        html = `
            <div class="sendMsg">
              <div class="sendContent">${data.message}</div>
              <img src="${sendUser.avatar}" class="avatarImg">
            </div>`;
    } else {
        // 别人发的消息
        html = `<div class="receiveMsg">
              <img src="${sendUser.avatar}" class="avatarImg">
              <div class="rightStyle">
                <span class="nickname">${sendUser.nickname}</span>
                <div class="receiveContent">${data.message}</div>
              </div>
            </div>`;
    }

    chatContainer.innerHTML += html;
    // 发送消息的时候，让聊天页面滚动到底部可视区域
    scrollIntoView(chatContainer);

});


// 获取用户输入的内容
function getMessage(element) {
    let value = '';
    if (navigator.userAgent.match(/(iPhone|iPod|Android|ios)/i)) {
        value = element.value;
        value = value.replace(/\n/g, "<br/>").replace(/\s/g, " ");
        // console.log(value)
        element.value = '';
    } else {
        value = element.innerHTML;
        element.innerHTML = '';
    }
    // console.log(textareaMsg);
    if (!value) {
        var $iosDialog1 = $('#iosDialog1');
        $iosDialog1.fadeIn(200);
        $iosDialog1.attr('aria-hidden', 'false');
        $iosDialog1.attr('tabindex', '0');
        $iosDialog1.trigger('focus');
        return;
    }

    // 把消息发给服务器
    socket.emit('sendMessage', {
        message: value,
        sendUser: currentUser
    });
}

// 4.点击发送按钮或者Ctrl + Enter键发送消息
function sendMessage() {
    let sendBtn = document.getElementById('sendBtn');
    let textareaMsg = document.getElementById('textareaMsg');
    sendBtn.addEventListener('click', function() {
        getMessage(textareaMsg);
    });

    textareaMsg.addEventListener('keydown', function(event) {
        if (event.key === 'Enter' && event.ctrlKey) {
            getMessage(textareaMsg);
        }
    });
}

// 聊天页滚动到页面底部可视区域
function scrollIntoView(element) {
    element.lastElementChild.scrollIntoView(false);
}

function logout() {
    let logout = document.getElementById('logout');
    console.log('logout');
    logout.addEventListener('click', function() {
        let xhr = new XMLHttpRequest();
        xhr.onload = function() {
            location.href = '/login';
        };
        xhr.open('POST', '/logout');
        xhr.send();
    })
}

function infoChange() {
    let infoChange = document.getElementById('infoChange');
    infoChange.addEventListener('click', function() {
        location.href = '/info';
    });
}

sendMessage();
if (navigator.userAgent.match(/(iPhone|iPod|Android|ios)/i)) {
    infoChange();
}

function getmessage() {
    axios.post('/getmessage', {}).then(res => {
        let messages = res.data;
        for (i = 0; i < messages.length; i++) {
            let html = ``;
            if (messages[i].nickname === currentUser.nickname) {
                // 自己发的消息
                html = `
                    <div class="sendMsg">
                      <div class="sendContent">${messages[i].message}</div>
                      <img src="${messages[i].avatar}" class="avatarImg">
                    </div>`;
            } else {
                // 别人发的消息
                html = `<div class="receiveMsg">
                      <img src="${messages[i].avatar}" class="avatarImg">
                      <div class="rightStyle">
                        <span class="nickname">${messages[i].nickname}</span>
                        <div class="receiveContent">${messages[i].message}</div>
                      </div>
                    </div>`;
            }
            chatContainer.innerHTML += html;
            // 发送消息的时候，让聊天页面滚动到底部可视区域
            scrollIntoView(chatContainer);
        }
    })
}
getmessage();
logout();