import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import UserLogin from './userPages/UserLogin'
import UserSignup from './userPages/UserSignup'
import AccountCreation from './userPages/AccountCreation'
import UserPrivate from './components/UserPrivate'
import Userlayout from './components/UserLayout'


function App() {

  return (
    <div>

      <Router>
        <Routes>

          {/* Default redirect */}
          <Route path='/' element={<Navigate to='/Login' replace />} />

          {/* User Public Login */}
          <Route path='/Signup' element={<UserSignup />} />
          <Route path='/Login' element={<UserLogin />} />

          {/* User Private */}
          <Route element={<UserPrivate> <Userlayout /> </UserPrivate>}>
            <Route path='/AccountCreation' element={<AccountCreation />} />
            <Route path='/home' element={<AccountCreation />} />
          </Route>

        </Routes>
      </Router>

    </div>
  )
}

export default App