const express = require('express')
const app = express()
const port = 5000

const bodyParser = require('body-parser')

const cookieParser = require('cookie-parser')

const config = require('./config/key')

const { auth } = require('./middleware/auth')
const { User } = require('./models/User')

// applcation/x-www-from-urlencoded 데이터를 가져올수 있게
app.use(bodyParser.urlencoded({extended: true}));

// application/json 데이터를 가져올수 있게
app.use(bodyParser.json());

// 쿠키
app.use(cookieParser());

// 몽구스 설정
const mongoose = require('mongoose')
mongoose.connect(config.mongoURI, {
    // useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, userFindAndModify: false,
}).then(()=> console.log('MongoDB Connected'))
.catch(err => console.log(err))

app.get('/', (req, res) => res.send('Hello World!'))
app.get('/api/hello', (req, res) => {

    res.send('안녕')
})
app.post('/api/users/register', async (req, res) => {
    try {
        const user = new User(req.body)
        const userInfo = await user.save()

        return res.status(200).json({
            success: true,
        })
    } catch (err) {
        return res.status(400).json({
            success: false,
            err
        })
    }
})

app.post('/api/users/login', async (req, res) => {
    try {
        // 요청된 이메일을 데이터베이스에서 있는지 찾는다.
        const user = await User.findOne({ email: req.body.email })

        if (!user) {
            return res.json({
                loginSuccess: false,
                message: "제공된 이메일에 해당하는 유저가 없습니다."
            })
        }

        // 요청된 이메일이 데이터베이스에 있다면 비밀번호가 맞는 비밀번호 인지 확인
        const isMatch = await user.comparePassword(req.body.password)
     
        if (!isMatch) {
            return res.json({
                loginSuccess: false,
                message: "비밀번호가 틀렸습니다."
            })
        }

        // 비밀번호까지 맞다면 토큰 생성
        const updatedUser = await user.generateToken()

        // 토큰 저장
        return res
            .cookie("x_auth", updatedUser.token)
            .status(200)
            .json({
                loginSuccess: true,
                userId: updatedUser._id
            })

    } catch (err) {
        return res.status(400).send(err)
    }
})

app.get('/api/users/auth', auth, (req, res) => {
    res.status(200).json({
        _id: req.user._id,
        isAdmin: req.user.role === 0 ? false : true,
        isAuth: true,
        email: req.user.email,
        name: req.user.name,
        lastname: req.user.lastname,
        role: req.user.role,
        image: req.user.image
    })
})

app.get('/api/users/logout', auth, async (req, res) => {
    try {
        await User.findOneAndUpdate(
            { _id: req.user._id },
            { token: "" }
        )

        return res.status(200).json({
            success: true
        })
    } catch (err) {
        return res.status(400).json({
            success: false,
            err
        })
    }
})

// app.post('/register', (req, res) => {
//     const user = new User(req.body)

//     user.save()
//         .then(userInfo => {
//             return res.status(200).json({
//                 success: true,
//             })
//         })
//         .catch(err => {
//             return res.status(400).json({
//                 success: false,
//                 err
//             })
//         })
// })

app.listen(port, () => console.log(`Example app listening on port ${port}!`))