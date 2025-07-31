import React, { useEffect, useState } from 'react'
import API from '../api'

const DashboardAdmin = ({ username }) => {
  const [components, setComponents] = useState([])
  const [form, setForm] = useState({ name: '', quantity: '', description: '' })
  const [editId, setEditId] = useState(null)

  // Ambil data komponen dari backend
  const loadComponents = () => {
    API.get('/components', { params: { username } })
      .then(res => setComponents(res.data))
      .catch(() => alert("Failed to load components"))
  }

  useEffect(() => {
    loadComponents()
  }, [])

  // Tambah komponen baru
  const handleAdd = () => {
    if (!form.name || !form.quantity) return alert("Name and quantity are required.")
    API.post('/components', form, { params: { username } })
      .then(() => {
        setForm({ name: '', quantity: '', description: '' })
        loadComponents()
      })
      .catch(() => alert("Failed to add component"))
  }

  // Update komponen yang sedang diedit
  const handleUpdate = () => {
    if (!form.name || !form.quantity) return alert("Name and quantity are required.")
    API.put(`/components/${editId}`, form, { params: { username } })
      .then(() => {
        setForm({ name: '', quantity: '', description: '' })
        setEditId(null)
        loadComponents()
      })
      .catch(() => alert("Failed to update component"))
  }

  // Hapus komponen berdasarkan id
  const handleDelete = (id) => {
    if (!confirm("Are you sure you want to delete this component?")) return
    API.delete(`/components/${id}`, { params: { username } })
      .then(loadComponents)
      .catch(() => alert("Failed to delete component"))
  }

  // Isi form untuk mode edit
  const startEdit = (comp) => {
    setForm({ name: comp.name, quantity: comp.quantity, description: comp.description })
    setEditId(comp.id)
  }

  return (
    <div>
      <h2>Component Inventory (Admin)</h2>

      <table border="1" cellPadding="8" cellSpacing="0">
        <thead>
          <tr>
            <th>Name</th>
            <th>Qty</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {components.map(comp => (
            <tr key={comp.id}>
              <td>{comp.name}</td>
              <td>{comp.quantity}</td>
              <td>{comp.description}</td>
              <td>
                <button onClick={() => startEdit(comp)}>Edit</button>
                <button onClick={() => handleDelete(comp.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3>{editId ? 'Edit Component' : 'Add Component'}</h3>
      <input
        placeholder="Name"
        value={form.name}
        onChange={e => setForm({ ...form, name: e.target.value })}
      />
      <input
        placeholder="Quantity"
        type="number"
        value={form.quantity}
        onChange={e => setForm({ ...form, quantity: e.target.value })}
      />
      <input
        placeholder="Description"
        value={form.description}
        onChange={e => setForm({ ...form, description: e.target.value })}
      />
      {editId ? (
        <button onClick={handleUpdate}>Update</button>
      ) : (
        <button onClick={handleAdd}>Add</button>
      )}
    </div>
  )
}

export default DashboardAdmin
