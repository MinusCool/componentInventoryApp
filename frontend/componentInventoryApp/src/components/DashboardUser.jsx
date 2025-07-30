import React, { useEffect, useState } from 'react'
import API from '../api'

const DashboardUser = ({ username }) => {
  const [components, setComponents] = useState([])

  useEffect(() => {
    API.get(`/components`, { params: { username } })
      .then(res => setComponents(res.data))
      .catch(() => alert("Failed to fetch components"))
  }, [username])

  return (
    <div>
      <h2>Component List (User)</h2>
      <ul>
        {components.map(c => (
          <li key={c.id}>{c.name} ({c.quantity}) - {c.description}</li>
        ))}
      </ul>
    </div>
  )
}

export default DashboardUser
