import React, { useEffect, useState } from 'react'
import API from '../api'

const DashboardAdmin = ({ username }) => {
  const [components, setComponents] = useState([])
  const [form, setForm] = useState({ name: '', quantity: '', description: '' })

  const loadComponents = () => {
    API.get('/components', { params: { username } }).then(res => setComponents(res.data))
  }

  useEffect(() => {
    loadComponents()
  }, [username])

  const handleAdd = () => {
    API.post('/components', form, { params: { username } })
      .then(() => {
        loadComponents()
        setForm({ name: '', quantity: '', description: '' })
      })
      .catch(() => alert("Failed to add"))
  }

  const handleDelete = (id) => {
    API.delete(`/components/${id}`, { params: { username } })
      .then(loadComponents)
      .catch(() => alert("Failed to delete"))
  }

  return (
    <div>
      <h2>Component List (Admin)</h2>
      <ul>
        {components.map(c => (
          <li key={c.id}>
            {c.name} ({c.quantity}) - {c.description}
            <button onClick={() => handleDelete(c.id)}>Delete</button>
          </li>
        ))}
      </ul>

      <h3>Add Component</h3>
      <input placeholder="Name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
      <input placeholder="Quantity" value={form.quantity} onChange={e => setForm({...form, quantity: e.target.value})} />
      <input placeholder="Description" value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
      <button onClick={handleAdd}>Add</button>
    </div>
  )
}

export default DashboardAdmin
