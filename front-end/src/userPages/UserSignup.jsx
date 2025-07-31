import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import ImageShuffle from '../components/ImageShuffle'
import { userSignupApi } from '../api/userAPI'

function UserSignup() {
  const navigate = useNavigate()

  const [userData, setUserData] = useState({
    name: '',
    phone: '',
    email: '',
    password: '',
  })

  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  function handleInputChange(e) {
    const { name, value } = e.target
    setUserData((prevData) => ({
      ...prevData,
      [name]: value
    }))
  }

  async function handleSignup(e) {
    e.preventDefault();
    try {
      // Arrange
      if (!userData.name || !userData.phone || !userData.email || !userData.password) {
        setMessage('Please fill in all fields')
        return
      }

      setLoading(true)
      setMessage('')

      console.log('Attempting signup with:', userData)

      // Act
      const response = await userSignupApi(userData)
      console.log('Signup response:', response)

      // Assert
      if (response && response.status === 200) {
        console.log('Signup successful')
        setMessage('Account generated successfully! Redirecting...')

        setUserData({
          name: '',
          phone: '',
          email: '',
          password: '',
        })

        setTimeout(() => {
          navigate('/Login')
        }, 2000)
      }
    } catch (error) {
      console.error('Signup error:', error)
      setMessage(error.response?.data?.message || 'Signup failed. Please try again.')
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
          <h1 style={{ fontSize: "38px", color: "#f9f9f9" }} className="form-subtitle">Get Started</h1>
          <a style={{ fontSize: "20px" }} className="form-title">Sign up via Email and create your own Password.</a>
        </header>

        <form className="membership-form" onSubmit={handleSignup}>
          <div className="form-group">
            <label className="form-label" htmlFor="name">Name</label>
            <input className="form-input" type="text" id="name" name="name"
              value={userData.name}
              onChange={handleInputChange}
              disabled={loading} required />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="email">Email</label>
            <input className="form-input" type="email" id="email" name="email"
              value={userData.email}
              onChange={handleInputChange}
              disabled={loading} required />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="phone">Phone</label>
            <input className="form-input" type="text" id="phone" name="phone"
              value={userData.phone}
              onChange={handleInputChange}
              disabled={loading} required />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="password">Password</label>
            <input className="form-input" type="password" id="password" name="password"
              value={userData.password}
              onChange={handleInputChange}
              disabled={loading} required />
          </div>

          {message && <div style={{ color: "var(--primary-red)", marginTop: 10 }}>{message}</div>}

          <button style={{ marginBottom: "10px" }}
            type="submit"
            disabled={loading}
            className="submit-button">Proceed →</button>

          <p>Already have an account? <Link to="/Login">Login here</Link></p>

        </form>

      </div>

    </div>

  )
}

export default UserSignup