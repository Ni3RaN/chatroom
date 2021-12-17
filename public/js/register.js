function register() {
  let btn_register = document.getElementById('btn_register');
  let nicknameInput = document.getElementById('nickname');
  let password1Input = document.getElementById('password1');
  let password2Input = document.getElementById('password2');
  btn_register.onclick = function (event) {
    event.preventDefault();

    // 获取用户名、密码和头像地址
    let nickname = nicknameInput.value.trim();
    if (!nickname) {
      return alert('用户名不能为空');
    }

    let password1 = password1Input.value.trim();
    if (!password1) {
      return alert('密码不能为空');
    }

    let password2 = password2Input.value.trim();
    if (!password1) {
      return alert('密码不能为空');
    }

    if(password1!=password2){
      return alert('输入的密码不同');
    }
    let password = password1;
    
    let avatar = 'http://localhost:1625/images/1.jpg';
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
        alert('昵称已存在，请重新填写')
      }
    })
  };
}

register();
