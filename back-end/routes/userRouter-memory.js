const router = require('express').Router()
const crypto = require('crypto-js')
const JWT = require('jsonwebtoken')

// Private mock storage for testing - encapsulated for data integrity
const _mockStorage = {
    users: [],
    userIdCounter: 1
}

router.post('/Signup', async (req, res) => {
    try {
        // Arrange
        const { email, password, name, phone } = req.body

        if (!email || !password || !name || !phone) {
            return res.status(400).json({ message: "All fields are required" })
        }

        const existingUser = _mockStorage.users.find(user => user.email === email)
        if (existingUser) {
            return res.status(409).json({ message: "User already exists. Please login to proceed!" })
        }

        const encryptedPassword = crypto.AES.encrypt(password, process.env.password).toString()
        const newUser = {
            _id: _mockStorage.userIdCounter++,
            password: encryptedPassword,
            email: email,
            name: name,
            phone: phone
        }

        // Act
        _mockStorage.users.push(newUser)
        console.log('✅ New user created in memory:', newUser.email)

        // Assert
        res.status(200).json({
            message: "Account created successfully",
            user: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email
            }
        })
    } catch (error) {
        console.error('❌ Signup Error:', error.message)
        res.status(500).json({ message: 'Internal Server Error', error: error.message })
    }
})

router.post('/login', async (req, res) => {
    try {
        // Arrange
        const { email, password } = req.body

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" })
        }

        const user = _mockStorage.users.find(user => user.email === email)
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

            console.log('✅ User logged in from memory:', user.email)

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
        res.status(500).json({ message: 'Internal Server Error', error: error.message })
    }
})

module.exports = router