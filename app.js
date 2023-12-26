const express = require('express');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const path = require('path');
const session = require('express-session');
const nunjucks = require('nunjucks');
const dotenv = require('dotenv');

dotenv.config(); //process.env 저장
const pageRouter= require('./routes/page.js')
const app = express();
app.set('port',process.env.PORT||8000);
app.set('view engine', 'html');
nunjucks.configure('views', {
    express: app,
    watch: true,
});

app.use(morgan('dev'));//로깅 개발모드
//(static)퍼블릭 폴더만 접근 허용
app.use(express.static(path.join(__dirname,'public')));
app.use(express.json());//json으로 값전달
app.use(express.urlencoded({extended:false}));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET,
    cookie: {
        httpOnly: true,
        secure: false,
    },
}));

app.use('/',pageRouter);
app.use((req,res,next)=>{
    const error = new Error(`${req.method} ${req.url} 라우터 없음`);
    error.status = 404;
    next(error);
});
app.use((err,req,res,next)=>{
    res.locals.message = err.message;
    res.locals.error = process.env.NODE_ENV !=='production' ? err:{};
    res.status(err.status || 500);
    res.render('error');
});

app.listen(app.get('port'),()=>{
    console.log(app.get('port'),'번 포트에서 대기 중');
});