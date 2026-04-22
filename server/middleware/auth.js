const { User } = require("../models/User");

let auth = (req, res, next) => {
    // 인증 처리를 하는곳
    // 클라이언트 쿠키에서 토큰을 가져옴
    let token = req.cookies.x_auth;

    if (!token) {
        return res.status(401).json({ isAuth: false, error: true });
    }

    // 토큰을 복호화 유저를 찾음
    User.findByToken(token, (err, user) => {
        if (err) return res.status(400).json({ isAuth: false, error: true });
        if (!user) return res.status(401).json({ isAuth: false, error: true });

        req.token = token;
        req.user = user;
        next();
    });

    // 유저가 있으면 인증 ok
    // 유저가 없으면 x
}

module.exports = { auth };