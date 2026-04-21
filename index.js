const express = require('express')
const app = express()
const port = 5000

const bodyParser = require('body-parser')

const config = require('./config/key')

const { User } = require('./models/User')

// applcation/x-www-from-urlencoded 데이터를 가져올수 있게
app.use(bodyParser.urlencoded({extended: true}));

// application/json 데이터를 가져올수 있게
app.use(bodyParser.json());

// 몽구스 설정
const mongoose = require('mongoose')
mongoose.connect(config.mongoURI, {
    // useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, userFindAndModify: false,
}).then(()=> console.log('MongoDB Connected'))
.catch(err => console.log(err))

app.get('/', (req, res) => res.send('Hello World!'))

app.post('/register', async (req, res) => {
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