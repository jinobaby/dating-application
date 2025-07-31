import React, { useState } from 'react'
import '../styles/login-signup-creation.css'
import ImageShuffle from '../components/ImageShuffle';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { userLoginApi } from '../api/userAPI';
import { userLoginData } from '../redux/userSlice';

function UserLogin() {
    const dispatch = useDispatch()
    const navigate = useNavigate()


    const [loginData, setLoginData] = useState({
        email: '',
        password: ''
    })

    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState('')

    function handleInputChange(e) {
        const { name, value } = e.target
        setLoginData((prevData) => ({
            ...prevData,
            [name]: value
        }))
    }

    async function handleLogin() {
        try {
            // Arrange
            if (!loginData.email || !loginData.password) {
                setMessage('Please fill in all fields')
                return
            }

            setLoading(true)
            setMessage('')

            console.log('Attempting login with:', loginData)

            // Act
            const response = await userLoginApi(loginData)
            console.log('Login response:', response)

            // Assert
            if (response && response.data.Token) {
                console.log('Login successful, dispatching to Redux')
                dispatch(userLoginData(response.data))
                setMessage('Login successful! Redirecting...')
                setTimeout(() => {
                    navigate('/AccountCreation')
                }, 1000)
            } else {
                setMessage(response.data?.message || 'Login failed')
            }
        } catch (error) {
            console.error('Login error:', error)
            setMessage(error.response?.data?.message || 'Login failed. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="membership-body">

            <ImageShuffle />

            <div className="form-container">

                <div className="header-area">
                    <img className="form-logo" style={{ height: "50px", width: "50px" }} src='/images/j-svg.svg' alt="Logo" />
                </div>

                <header className="form-header">
                    <h1 style={{ fontSize: "38px", color: "#f9f9f9" }} className="form-subtitle">Welcome to <b style={{ color: "blue" }} >JustUs</b></h1>
                    <a style={{ fontSize: "20px" }} className="form-title">Please enter your credentials to sign in.</a>
                </header>

                <form className="membership-form" action="/login-data" method="POST">

                    <div className="form-group">
                        <label className="form-label" htmlFor="email">Email</label>
                        <input className="form-input" type="email" id="email" name="email" placeholder="Enter your Email address" value={loginData.email}
                            onChange={handleInputChange}
                            disabled={loading} 
                            autoComplete="off" />
                    </div>

                    <div className="form-group">
                        <label className="form-label" htmlFor="password">Password</label>
                        <input className="form-input" type="password" id="password" name="password" placeholder="Create your Password" value={loginData.password}
                            onChange={handleInputChange}
                            disabled={loading} 
                            autoComplete="off" />
                    </div>

                    {message && (
                        <div className="login-error-group">
                            <p
                                className="login-error"
                                style={{
                                    textAlign: "center",
                                    fontFamily: "'Satoshi', sans-serif",
                                    fontWeight: 500,
                                    letterSpacing: "1px"
                                }}
                            >
                                {message}
                            </p>
                        </div>
                    )}

                    <button style={{ marginBottom: "10px", marginTop: "10px" }} 
                    type='button'
                    onClick={handleLogin}
                    disabled={loading}
                    className="submit-button">{loading ? 'Loading...' : 'Login →'}</button>

                    <div>
                        <label htmlFor="login-label-redirect">If you haven't created account already click here to
                            <a href="/Signup" className="login-redirect-a" > Signup </a>
                        </label>
                    </div>

                </form>

            </div>
        </div>

    )
}

export default UserLogin