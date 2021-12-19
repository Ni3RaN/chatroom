let btn_back = document.getElementById('btn_back');
let userAvatarImg = document.getElementById('userAvatarImg');
let imgChoose = document.getElementById('imgChoose');


btn_back.onclick = function(event) {
    event.preventDefault();
    self.location = '/index';
};

userAvatarImg.onclick = function(event) {
    imgChoose.innerHTML = '';
    let html = `
    <label class="weui-cell weui-cell_active">
        <div class="weui-cell__hd"><span class="weui-label">选择头像</span></div>
        <div class="weui-cell__bd">
            <img class="imgList" src="images/1.jpg">
            <img class="imgList" src="images/2.jpg">
            <img class="imgList" src="images/3.jpg">
            <img class="imgList" src="images/4.jpg">
            <img class="imgList" src="images/5.jpg">
            <img class="imgList" src="images/6.jpg">
        </div>
    </label>
    `;
    imgChoose.innerHTML += html;
};

function change() {
    let btn_update = document.getElementById("btn_update");
    let nicknameInput = document.getElementById('nickname');
    let passwordInput = document.getElementById('password');

    btn_update.onclick = function(event) {
        event.preventDefault();
        let nickname = nicknameInput.value.trim();
        //暂时不做avatar
        let hostname = 'http://' + window.document.location.host;
        let avatar = hostname + '/images/1.jpg';
        if (!nickname) {
            return alert('用户名不能为空');
        }

        let password = passwordInput.value.trim();
        if (!password) {
            return alert('密码不能为空');
        }
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