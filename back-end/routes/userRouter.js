const router = require('express').Router()
const UserSchema = require('../models/userSchema')
const crypto = require('crypto-js')
const JWT = require('jsonwebtoken')

router.post('/Signup', async (req, res) => {
    try {
        // Arrange
        const { email, password, name, phone } = req.body

        if (!email || !password || !name || !phone) {
            return res.status(400).json({ message: "All fields are required" })
        }

        const existingUser = await UserSchema.findOne({ email: email })
        if (existingUser) {
            return res.status(409).json({ message: "User already exists. Please login to proceed!" })
        }

        const encryptedPassword = crypto.AES.encrypt(password, process.env.password).toString()

        const newUser = new UserSchema({
            password: encryptedPassword,
            email: email,
            name: name,
            phone: phone
        })

        // Act
        const savedUser = await newUser.save()
        console.log('✅ New user created:', savedUser.email)

        // Assert
        res.status(200).json({
            message: "Account created successfully",
            user: {
                id: savedUser._id,
                name: savedUser.name,
                email: savedUser.email
            }
        })
    } catch (error) {
        console.error('❌ Signup Error:', error.message)
        res.status(500).json({
            message: 'Internal Server Error',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
        })
    }
})

router.post('/login', async (req, res) => {
    try {
        // Arrange
        const { email, password } = req.body

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" })
        }

        const user = await UserSchema.findOne({ email: email })
        if (!user) {
            return res.status(404).json({ message: "User not found. Please signup to proceed!" })
        }

        const bytes = crypto.AES.decrypt(user.password, process.env.password)
        const originalPassword = bytes.toString(crypto.enc.Utf8)

        // Act
        const isPasswordValid = password === originalPassword

        // Assert
        if (isPasswordValid) {
            const token = JWT.sign(
                { id: user._id, email: user.email },
                process.env.SECRET_KEY,
                { expiresIn: '10d' }
            )

            console.log('✅ User logged in:', user.email)

            res.status(200).json({
                Token: token,
                id: user._id,
                name: user.name,
                email: user.email
            })
        } else {
            return res.status(401).json({ message: "Invalid password" })
        }
    } catch (error) {
        console.error('❌ Login Error:', error.message)
        res.status(500).json({
            message: 'Internal Server Error',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
        })
    }
})

module.exports = router