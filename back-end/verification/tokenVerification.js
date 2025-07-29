const JWT = require('jsonwebtoken')

const verifyToken = (req, res, next) => {
    try {
        // Arrange
        const token = req.headers.authorization
        
        if (!token) {
            console.log('❌ Token is missing')
            return res.status(401).json({ message: 'Token is missing' })
        }
        
        // Act
        JWT.verify(token, process.env.SECRET_KEY, (error, user) => {
            // Assert
            if (error) {
                console.log('❌ Token verification failed:', error.message)
                return res.status(401).json({ message: 'Token not valid' })
            }

            console.log('✅ Token verification success')
            req.user = user
            next()
        })
    } catch (error) {
        console.error('❌ Token verification error:', error.message)
        return res.status(500).json({ message: 'Internal server error' })
    }
}

module.exports = verifyToken    