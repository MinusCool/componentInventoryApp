import React, { useState } from 'react'
import API from '../api'

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [showError, setShowError] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!username || !password) {
      setError('Username and password are required.')
      setShowError(true)
    } else {
      try {
        const res = await API.post('/login', { username, password })
        onLogin(username, res.data.role)
      } catch (err) {
        setError(err.response?.data?.detail || 'Internal Server Error')
        setShowError(true)
      }
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

      {showError && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm relative flex flex-col items-center">
            <h3 className="text-lg font-semibold mb-2 text-red-600">Login Error</h3>
            <p className="text-gray-700 mb-6">{error}</p>
            <button
              onClick={() => setShowError(false)}
              className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-2 px-6 rounded mt-4"
              aria-label="Close"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default Login
