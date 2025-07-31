import React, { useState } from 'react'
import Login from './components/Login'
import DashboardUser from './components/DashboardUser'
import DashboardAdmin from './components/DashboardAdmin'

const App = () => {
  const [username, setUsername] = useState(null)
  const [role, setRole] = useState(null)

  const onLogin = (uname, userRole) => {
    setUsername(uname)
    setRole(userRole)
  }
  
  const handleLogout = () => {
    setUsername(null)
    setRole(null)
  }

  if (!username) return <Login onLogin={onLogin} />
  if (role === 'user') return <DashboardUser username={username} onLogout={handleLogout}/>
  if (role === 'admin') return <DashboardAdmin username={username} onLogout={handleLogout}/>
}

export default App
