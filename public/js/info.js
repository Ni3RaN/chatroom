let btn_back = document.getElementById('btn_back');
let userAvatarImg = document.getElementById('userAvatarImg');
let imgChoose = document.getElementById('imgChoose');


let currentUser = sessionStorage.getItem('currentUser');
currentUser = JSON.parse(currentUser);

btn_back.onclick = function(event) {
    event.preventDefault();
    self.location = '/index';
};

let index = 0;

function nowImg() {
    // let imgList = document.getElementById('imgList');
    let imgs = imgList.getElementsByTagName('img');
    for (i = 0; i < imgs.length; i++) {
        var src = imgs[i].src;
        if (src === currentUser.avatar) {
            index = i;
            imgs[i].classList.add('now');
        } else {
            imgs[i].classList.remove('now');
        }
    }
}

function selectImg() {
    let imgs = imgList.getElementsByTagName('img');
    imgList.addEventListener('click', function(event) {
        let target = event.target;
        if (target.tagName != 'IMG') {
            return;
        }
        imgs[index].classList.remove('now');
        target.classList.add('now');
        for (i = 0; i < imgs.length; i++) {
            if (imgs[i] === target) {
                index = i;
            }
        }
    });
}

userAvatarImg.onclick = function(event) {
    imgChoose.innerHTML = '';
    let html = `
    <label class="weui-cell weui-cell_active">
        <div class="weui-cell__hd"><span class="weui-label">选择头像</span></div>
        <div class="weui-cell__bd" id="imgList">
            <img class="imgList" src="images/1.jpg">
            <img class="imgList" src="images/2.jpg">
            <img class="imgList" src="images/3.jpg">
            <img class="imgList" src="images/4.jpg">
        </div>
    </label>
    `;
    imgChoose.innerHTML += html;
    nowImg();
    selectImg();
};

function change() {
    let btn_update = document.getElementById("btn_update");
    let nicknameInput = document.getElementById('nickname');
    let passwordInput = document.getElementById('password');

    btn_update.onclick = function(event) {
        event.preventDefault();
        let nickname = nicknameInput.value.trim();
        try {
            let imgs = imgList.getElementsByTagName('img');
            avatar = imgs[index].src;

        } catch (error) {
            avatar = currentUser.avatar;
        }

        if (!nickname) {
            return alert('用户名不能为空');
        }

        let password = passwordInput.value.trim();
        if (!password) {
            return alert('密码不能为空');
        }
        currentUser.nickname = nickname;
        currentUser.password = password;
        currentUser.avatar = avatar;
        sessionStorage.setItem('currentUser', JSON.stringify(currentUser));
        axios.post('/info', {
            nickname,
            password,
            avatar
        }).then(res => {
            let err_code = res.data.err_code;
            if (err_code === 0) {
                location.href = '/info';
            } else if (err_code === 1) {
                alert('昵称已存在，请重新填写');
            }
        });
    };
};

change();