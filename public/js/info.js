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