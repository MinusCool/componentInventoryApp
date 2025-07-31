import React, { useState } from 'react'
import API from '../api'

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await API.post('/login', { username, password })
      onLogin(username, res.data.role)
    } catch (err) {
      alert(err.response?.data?.detail || 'Internal Server Error')
    }
  }

  return (
    <div className="flex flex-col items-center mt-12">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Component Inventory App</h1>
      <form onSubmit={handleSubmit}className="bg-white p-6 rounded-lg shadow max-w-sm mx-auto mt-16 flex flex-col gap-4">
        <h2 className="text-xl font-semibold text-center">Login</h2>
        <input 
          className="border border-gray-300 rounded px-4 py-2"
          value={username} 
          onChange={e => setUsername(e.target.value)} 
          placeholder="Username" />
        
        <input 
          type="password" 
          className="border border-gray-300 rounded px-4 py-2"
          value={password} 
          onChange={e => setPassword(e.target.value)} 
          placeholder="Password" />
        <button 
          type="submit"
          className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-2 rounded"
          >Login
        </button>
      </form>
    </div>
  )
}

export default Login
