//routers/page.js 에서 발생한 컨트롤러 선언

exports.renderProfile = (req, res, next) => {
    res.render('profile', { title: 'NodeBird' });
};

exports.renderJoin = (req, res, next) => {
    res.render('join', { title: '회원가입 - NodeBird' });
};

exports.renderMain = (req, res, next) => {
    res.render('main', {
        title: 'NodeBird',
        twits: [],
    });
};
