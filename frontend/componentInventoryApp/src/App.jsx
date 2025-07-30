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

  if (!username) return <Login onLogin={onLogin} />
  if (role === 'user') return <DashboardUser username={username} />
  if (role === 'admin') return <DashboardAdmin username={username} />
}

export default App
