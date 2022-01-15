let btn_login = document.getElementById('btn_login');
let nicknameInput = document.getElementById('nickname');
let passwordInput = document.getElementById('password');

$('#dialogs').on('click', '.weui-dialog__btn', function() {
    $(this).parents('.js_dialog').fadeOut(200);
    $(this).parents('.js_dialog').attr('aria-hidden', 'true');
    $(this).parents('.js_dialog').removeAttr('tabindex');
});

btn_login.onclick = function(event) {
    event.preventDefault();

    // 获取用户名、密码和头像地址
    let nickname = nicknameInput.value.trim();
    if (!nickname) {
        var $iosDialog1 = $('#iosDialog1');
        $iosDialog1.fadeIn(200);
        $iosDialog1.attr('aria-hidden', 'false');
        $iosDialog1.attr('tabindex', '0');
        $iosDialog1.trigger('focus');
        return;
    }

    let password = passwordInput.value.trim();
    if (!password) {
        var $iosDialog1 = $('#iosDialog1');
        $iosDialog1.fadeIn(200);
        $iosDialog1.attr('aria-hidden', 'false');
        $iosDialog1.attr('tabindex', '0');
        $iosDialog1.trigger('focus');
        return;
    }

    axios.post('/login', {
        nickname,
        password
    }).then(res => {
        let err_code = res.data.err_code;
        if (err_code === 0) {
            // 登录成功后把当前用户的用户名存入sessionStorage中，跳转到聊天界面
            let user = {
                nickname,
                avatar: res.data.avatar
            };
            sessionStorage.setItem('currentUser', JSON.stringify(user));
            location.href = '/index';
        } else if (err_code === 1) {
            var $iosDialog2 = $('#iosDialog2');
            $iosDialog2.fadeIn(200);
            $iosDialog2.attr('aria-hidden', 'false');
            $iosDialog2.attr('tabindex', '0');
            $iosDialog2.trigger('focus');
        }
    })
};