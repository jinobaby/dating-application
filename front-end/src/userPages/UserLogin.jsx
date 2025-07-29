import React, { useState } from 'react'
import '../styles/login-signup-creation.css'
import ImageShuffle from '../components/ImageShuffle';

function UserLogin() {
    const [message, setMessage] = useState('');
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
                        <input className="form-input" type="email" id="email" name="email" placeholder="Enter your Email address" autoComplete="off" />
                    </div>

                    <div className="form-group">
                        <label className="form-label" htmlFor="password">Password</label>
                        <input className="form-input" type="password" id="password" name="password" placeholder="Create your Password" autoComplete="off" />
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

                    <button style={{ marginBottom: "10px", marginTop: "10px" }} className="submit-button">Proceed →</button>

                    <div>
                        <label htmlFor="login-label-redirect">If you havent created account already click here to
                            <a href="/Signup" className="login-redirect-a" > Signup </a>
                        </label>
                    </div>

                </form>

            </div>
        </div>

    )
}

export default UserLogin