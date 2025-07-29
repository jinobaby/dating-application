import React from 'react'
import ImageShuffle from '../components/ImageShuffle'

function UserSignup() {
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

                <form className="membership-form" action="/signup-data" method="POST">
                    <div className="form-group">
                        <label className="form-label" htmlFor="email">Email</label>
                        <input className="form-input" type="email" id="email" name="email" placeholder="Enter your Email address" autoComplete="off" />
                    </div>

                    <div className="form-group">
                        <label className="form-label" htmlFor="password">Password</label>
                        <input className="form-input" type="password" id="password" name="password" placeholder="Create your Password" autoComplete="off" />
                    </div>

                    <button style={{ marginBottom: "10px" }} className="submit-button">Proceed →</button>

                    <div className="consent-group">
                        <label className="consent-label" htmlFor="consent">
                            By continuing, you agree to our
                            <a className="consent-link" href="#">terms and conditions</a>
                            , and
                            <a className="consent-link" href="#">privacy policy.</a>
                        </label>
                    </div>

                </form>

            </div>

        </div>

    )
}

export default UserSignup