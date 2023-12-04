//로그인 가능 유무 판단
const passprot  = require('passport');
const {Strategy: LocalStrategy} = require('passport-local');
const bcrypt = require('bcrypt');//암호화 hash & 비교 compare
const User = require('../models/user');

module.exports = ()=>{
    passprot.use(new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: false//ture면 req,email--로 구성됨 async(4개 항목)
    }, async(email,password,done)=>{ //done(서버실패,성공유저,로직실패)
        try{
            const exUser = await User.findOne({where: {email}});//존재하는 이메일인지 확인
            if(exUser){//비밀번호가 있는건지 확인
                const result = await bcrypt.compare(password,exUser.password);
                if(result){//기존 비번과 일치한다면
                    done(null,exUser);//성공유저
                }
                else{
                    done(null,false,{message:'비번 불일치'});
                }    
            }
            else{
                done(null,false,{message:'가입하지 않은 회원'});
            }
        } catch(error){
            console.error(error);
            done(error);//서버 실패 전달
        }
    }));

};