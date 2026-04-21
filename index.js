const express = require('express')
const app = express()
const port = 5000

// 몽구스 설정
const mongoose = require('mongoose')
mongoose.connect('mongodb+srv://johnnigeug:1324@boilerplate.bml5gsi.mongodb.net', {
    // useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, userFindAndModify: false,
}).then(()=> console.log('MongoDB Connected'))
.catch(err => console.log(err))

app.get('/', (req, res) => res.send('Hello World!'))

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
