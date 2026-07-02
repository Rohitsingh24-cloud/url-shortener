import React, { useState } from 'react'
import LoginForm from '../components/LoginForm.jsx'
import RegisterForm from '../components/RegisterForm.jsx'

const AuthPage = () => {

    const [login, setLogin] = useState(true)

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
            {login ? <LoginForm state={setLogin} /> : <RegisterForm state={setLogin} />}
        </div>
    )
}

export default AuthPage