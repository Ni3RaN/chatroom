function register() {
  let register_form = document.getElementById('register_form');
  let nicknameInput = document.getElementById('nickname');
  let passwordInput = document.getElementById('password');
  register_form.addEventListener('submit', function (event) {
    event.preventDefault();

    // 获取用户名、密码和头像地址
    let nickname = nicknameInput.value.trim();
    if (!nickname) {
      return alert('用户名不能为空');
    }

    let password = passwordInput.value.trim();
    if (!password) {
      return alert('密码不能为空');
    }
    let avatar = 'http://localhost:1625/images/1.jpg';
    console.log(nickname, password, avatar);

    axios.post('/register', {
      nickname,
      password,
      avatar
    }).then(res => {
      let err_code = res.data.err_code;
      if (err_code === 0) {
        location.href = '/login';
      } else if (err_code === 1) {
        alert('昵称已存在，请重新填写')
      }
    })
  });
}

register();
