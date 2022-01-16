function register() {
    let btn_register = document.getElementById('btn_register');
    let nicknameInput = document.getElementById('nickname');
    let password1Input = document.getElementById('password1');
    let password2Input = document.getElementById('password2');
    let hostname = 'http://' + window.document.location.host;
    $('#dialogs').on('click', '.weui-dialog__btn', function() {
        $(this).parents('.js_dialog').fadeOut(200);
        $(this).parents('.js_dialog').attr('aria-hidden', 'true');
        $(this).parents('.js_dialog').removeAttr('tabindex');
    });
    btn_register.onclick = function(event) {
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
        let password1 = password1Input.value.trim();
        if (!password1) {
            var $iosDialog2 = $('#iosDialog2');
            $iosDialog2.fadeIn(200);
            $iosDialog2.attr('aria-hidden', 'false');
            $iosDialog2.attr('tabindex', '0');
            $iosDialog2.trigger('focus');
            return;
        }

        let password2 = password2Input.value.trim();
        if (!password2) {
            var $iosDialog2 = $('#iosDialog2');
            $iosDialog2.fadeIn(200);
            $iosDialog2.attr('aria-hidden', 'false');
            $iosDialog2.attr('tabindex', '0');
            $iosDialog2.trigger('focus');
            return;
        }

        if (password1 != password2) {
            var $iosDialog5 = $('#iosDialog5');
            $iosDialog5.fadeIn(200);
            $iosDialog5.attr('aria-hidden', 'false');
            $iosDialog5.attr('tabindex', '0');
            $iosDialog5.trigger('focus');
            return;
        }
        let password = password1;
        if (!/^(\w){6,20}$/.exec(password)) {
            var $iosDialog4 = $('#iosDialog4');
            $iosDialog4.fadeIn(200);
            $iosDialog4.attr('aria-hidden', 'false');
            $iosDialog4.attr('tabindex', '0');
            $iosDialog4.trigger('focus');
            return;
        }
        let avatar = hostname + '/images/1.jpg';
        console.log(nickname, password1, avatar);

        axios.post('/register', {
            nickname,
            password,
            avatar
        }).then(res => {
            let err_code = res.data.err_code;
            if (err_code === 0) {
                location.href = '/login';
            } else if (err_code === 1) {
                var $iosDialog3 = $('#iosDialog3');
                $iosDialog3.fadeIn(200);
                $iosDialog3.attr('aria-hidden', 'false');
                $iosDialog3.attr('tabindex', '0');
                $iosDialog3.trigger('focus');
                return;
            }
        });
    };
}

register();