const bcrypt = require('bcrypt');
const passport = require('passport');
const User = require('../models/user');


exports.join = async (req, res, next) => {
  const { email, nick, password } = req.body;
  try {
    const exUser = await User.findOne({ where: { email } });
    if (exUser) {
      return res.redirect('/join?error=exist');
    }
    const hash = await bcrypt.hash(password, 12);
    await User.create({
      email,
      nick,
      password: hash,
      provider: 'local', // provider 값을 지정 <<<gpt 는 GOAT
    });
    return res.redirect('/');
  } catch (error) {
    console.error(error);
    return next(error);
  }
}

//POST /auth/login
exports.login = (req, res, next) => {//done호출 시 실행 
    passport.authenticate('local', (authError, user, info) => {
    if (authError) {//서버에러
      console.error(authError);
      return next(authError);//에러처리 미들웨어로 넘겨버리기
    }
    if (!user) {//로직 실패
      return res.redirect(`/?error=${info.message}`);
    }
    return req.login(user, (loginError) => {//로그인 성공
      if (loginError) {
        console.error(loginError);
        return next(loginError);
      }
      return res.redirect('/');
    });
  })(req, res, next); // 미들웨어 내의 미들웨어에는 (req, res, next)를 붙입니다.
};

exports.logout = (req, res) => {
  req.logout(() => {
    res.redirect('/');
  });
};