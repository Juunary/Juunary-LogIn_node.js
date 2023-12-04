const express = require('express');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const path = require('path');
const session = require('express-session');
const nunjucks = require('nunjucks');
const dotenv = require('dotenv');
const passport = require('passport');
const {sequelize}= require('./models');

dotenv.config(); //process.env
const pageRouter = require('./routes/page');
const authRouter = require('./routes/auth');
const passportConfig = require('./passport');

const { Sequelize } = require('sequelize');

const app = express();
passportConfig();
app.set('port',process.env.PORT || 8001);
app.set('view engine','html');//페이지 확장자 NUNJUCKS로 랜더링
nunjucks.configure('views',{
    express: app,
    watch: true,

});
sequelize.sync()
    .then(()=>{
        console.log('디비 연결 성공~')
    })
    .catch((err)=>{
        console.error(err);
    })


app.use(morgan('dev'));//combined 바꿔줘야함
app.use(express.static(path.join(__dirname,'public')));//__dirnmae = lecture file
app.use(express.json()); //req.body를 ajax json 요청으로부터
app.use(express.urlencoded({extended: false})); // req.body 폼으로부터
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET,
    cookie: { 
        httpOnly: true,
        secure: false,//>>true

    }
}));//passport는 express파트 이후에 붙이기
app.use(passport.initialize());//req.user req.login req.isAutheinticate req.logout 생성 됨
app.use(passport.session());//user id만 세션 방식으로 저장
//connect.sid 라는 이름으로 새션 쿠키가 브라우저로 전송

app.use('/',pageRouter);
app.use('/auth',authRouter);

app.use((req,res,next)=>{
    const error = new Error(`${req.method} ${req.url} 라우터가 없습니다.`);
    error.status = 404;
    next(error);
});
app.use((err, req, res, next)=> {
    res.locals.message = err.message;
    res.locals.error = process.env.NODE_ENV  !== 'production' ? err : {};
    res.status(err.status || 500);
    res.render('error');//error.html 찾아서 출력
});

app.listen(app.get('port'), ()=>{//8001
    console.log(app.get('port'),'빈포트에서 대기 중');
});