const express = require('express');
const { isLoggedIn, isNotLoggedIn } = require('../middlewares');//tlqkf 이거 안해서 1시간 버렸네
const router = express.Router();
const {renderProfile,renderJoin,renderMain} = require('../controllers/page');

router.use((req,res,next)=>{
    res.locals.user = req.user;
    res.locals.followerCount = 0;
    res.locals.followingCount = 0;
    res.locals.followingIdList = [];
    next();
});

router.get('/profile', isLoggedIn, renderProfile);
//로그인 한 사람만 랜더링
router.get('/join',isNotLoggedIn,renderJoin);
//로그인 안한 사람만 회원가입
router.get('/',renderMain);

module.exports = router;



