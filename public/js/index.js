// 1. 连接socket.io服务
let socket = io(window.document.location.host);

// 聊天框
let chatContainer = document.querySelector(".chat-container");

// 如果直接进入该页面，判断当前用户是否登录成功。如果登录成功，就发一个事件给服务器，服务器做一个广播
let currentUser = sessionStorage.getItem('currentUser');
if (currentUser) {
    console.log('登录成功');
    currentUser = JSON.parse(currentUser);
    socket.emit('loginSuccess', currentUser);
}

// 监听添加用户的消息
socket.on('addUser', function (user) {
    let p = document.createElement('p');
    p.classList.add('tip');
    p.textContent = user.nickname + '进入了聊天室';
    chatContainer.appendChild(p);
    scrollIntoView(chatContainer);
});

// 监听用户列表的消息
socket.on('userList', function (users) {
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

    // 修改聊天室的用户总数
    document.getElementById('userCount').textContent = users.length;
});

// 监听用户离开的消息
socket.on('userLeave', function (user) {
    let p = document.createElement('p');
    p.classList.add('tip');
    p.textContent = user.nickname + '离开了聊天室';
    chatContainer.appendChild(p);
    scrollIntoView(chatContainer);
});

// 监听用户发送文本内容
socket.on('receiveMessage', function (data) {
    // 把接收到的消息显示到聊天窗口中，需要区分这个消息是自己的还是其他人发的
    let sendUser = data.sendUser;
    let html = '';
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
    let value = element.innerHTML;
    element.innerHTML = '';
    if (!value) {
        return alert('消息不能为空');
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

    sendBtn.addEventListener('click', function () {
        getMessage(textareaMsg);
    });

    textareaMsg.addEventListener('keydown', function (event) {
        if (event.key === 'Enter' && event.ctrlKey) {
            getMessage(textareaMsg);
        }
    });
}

// 聊天页滚动到页面底部可视区域
function scrollIntoView(element) {
    element.lastElementChild.scrollIntoView(false);
}

// 初始化jquery-emoji插件
function emoji() {
    let emojiBtn = document.getElementById('emojiBtn');
    emojiBtn.addEventListener('click', function () {
        $('#textareaMsg').emoji({
            button: '#emojiBtn',// 设置触发表情的按钮
            showTab: false,
            animation: "slide",
            position: "topRight",
            icons: [
                {
                    name: "QQ表情",
                    path: "images/qq/",
                    maxNum: 91,
                    excludeNums: [41, 45, 54],
                    file: ".gif",
                    placeholder: "#qq_{alias}#"
                },
                {
                    name: "emoji",
                    path: "images/emoji/",
                    maxNum: 84,
                    excludeNums: [41, 45, 54],
                    file: ".png",
                    placeholder: "#emoji_{alias}#"
                },
                {
                    name: "贴吧表情",
                    path: "images/tieba/",
                    maxNum: 50,
                    excludeNums: [41, 45, 54],
                    file: ".jpg",
                    placeholder: "#tieba{alias}#"
                }
            ]
        })
    });

}

function logout() {
    let logout = document.getElementById('logout');
    console.log('logout');
    logout.addEventListener('click', function () {
        let xhr = new XMLHttpRequest();
        xhr.onload = function () {
            location.href = '/login';
        };
        xhr.open('POST', '/logout');
        xhr.send();
    })
}

sendMessage();
emoji();
logout();
