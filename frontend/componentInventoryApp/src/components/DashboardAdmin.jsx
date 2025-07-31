import React, { useEffect, useState } from 'react'
import API from '../api'

const DashboardAdmin = ({ username, onLogout }) => {
  const [components, setComponents] = useState([])
  const [form, setForm] = useState({ name: '', quantity: '', description: '' })
  const [editId, setEditId] = useState(null)

  const loadComponents = () => {
    API.get('/components', { params: { username } })
      .then(res => setComponents(res.data))
      .catch(() => alert("Failed to load components"))
  }

  useEffect(() => {
    loadComponents()
  }, [])

  const handleAdd = () => {
    if (!form.name || !form.quantity) return alert("Name and quantity are required.")
    API.post('/components', form, { params: { username } })
      .then(() => {
        setForm({ name: '', quantity: '', description: '' })
        loadComponents()
      })
      .catch(() => alert("Failed to add component"))
  }

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

  const handleDelete = (id) => {
    if (!confirm("Are you sure you want to delete this component?")) return
    API.delete(`/components/${id}`, { params: { username } })
      .then(loadComponents)
      .catch(() => alert("Failed to delete component"))
  }

  const startEdit = (comp) => {
    setForm({ name: comp.name, quantity: comp.quantity, description: comp.description })
    setEditId(comp.id)
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Component Inventory (Admin)</h2>
        <button
          onClick={onLogout}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
        >
          Log Out
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300 bg-white shadow rounded">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 border-b">Name</th>
              <th className="px-4 py-2 border-b">Qty</th>
              <th className="px-4 py-2 border-b">Description</th>
              <th className="px-4 py-2 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {components.map(comp => (
              <tr key={comp.id} className="text-center">
                <td className="px-4 py-2 border-b">{comp.name}</td>
                <td className="px-4 py-2 border-b">{comp.quantity}</td>
                <td className="px-4 py-2 border-b">{comp.description}</td>
                <td className="px-4 py-2 border-b space-x-2">
                  <button
                    onClick={() => startEdit(comp)}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(comp.id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-4">{editId ? 'Edit Component' : 'Add Component'}</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
          <input
            placeholder="Name"
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
            className="border border-gray-300 rounded px-4 py-2"
          />
          <input
            placeholder="Quantity"
            type="number"
            value={form.quantity}
            onChange={e => setForm({ ...form, quantity: e.target.value })}
            className="border border-gray-300 rounded px-4 py-2"
          />
          <input
            placeholder="Description"
            value={form.description}
            onChange={e => setForm({ ...form, description: e.target.value })}
            className="border border-gray-300 rounded px-4 py-2"
          />
        </div>
        {editId ? (
          <button
            onClick={handleUpdate}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded"
          >
            Update
          </button>
        ) : (
          <button
            onClick={handleAdd}
            className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-2 rounded"
          >
            Add
          </button>
        )}
      </div>
    </div>
  )
}

export default DashboardAdmin
