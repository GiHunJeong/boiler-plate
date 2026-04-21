const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const saltRound = 10

const userSchema = mongoose.Schema({
    name: {
        type: String,
        maxlength: 50
    },
    email: {
        type: String,
        trim: true,
        unique: 1
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: Number,
        default: 0
    },
    image: String,
    token: {
        type: String
    },
    tokenExp: {
        type: Number
    }
})

// 비밀번호 암호화
userSchema.pre('save', async function () {
    const user = this

    if (!user.isModified('password')) {
        return;
    }

    const salt = await bcrypt.genSalt(saltRound)
    const hash = await bcrypt.hash(user.password, salt)

    user.password = hash
})

// 비밀번호 검증
userSchema.methods.comparePassword = async function (plainPassword) {
    return await bcrypt.compare(plainPassword, this.password)
}

// 토큰 생성
userSchema.methods.generateToken = async function () {
    const user = this

    const token = jwt.sign(user._id.toHexString(), 'secretToken')
    user.token = token

    await user.save()
    return user
}

const User = mongoose.model('User', userSchema)

module.exports = { User }