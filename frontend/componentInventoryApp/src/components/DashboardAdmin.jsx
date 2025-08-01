import React, { useEffect, useState } from 'react'
import API from '../api'

const DashboardAdmin = ({ username, onLogout }) => {
  const [components, setComponents] = useState([])
  const [form, setForm] = useState({ name: '', quantity: '', description: '' })
  const [editId, setEditId] = useState(null)
  const [search, setSearch] = useState('')
  const [searchInput, setSearchInput] = useState('')

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

  const filteredComponents = components.filter(comp =>
    comp.name.toLowerCase().includes(search.toLowerCase()) ||
    (comp.description || '').toLowerCase().includes(search.toLowerCase())
  )

  const handleSearch = (e) => {
    e.preventDefault()
    setSearch(searchInput)
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h2 className="text-2xl font-bold text-gray-800">Component Inventory (Admin)</h2>
        <div className="flex items-center gap-2">
          <form onSubmit={handleSearch} className="flex">
            <input
              type="text"
              placeholder="Search component..."
              value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
              className="border border-gray-300 rounded-l px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-r font-semibold"
            >
              Search
            </button>
          </form>
          <button
            onClick={onLogout}
            className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded font-semibold ml-2"
          >
            Log Out
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300 bg-white shadow rounded">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 border-b text-gray-700">Name</th>
              <th className="px-4 py-2 border-b text-gray-700">Qty</th>
              <th className="px-4 py-2 border-b text-gray-700">Description</th>
              <th className="px-4 py-2 border-b text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredComponents.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center py-4 text-gray-500">No components found.</td>
              </tr>
            ) : (
              filteredComponents.map(comp => (
                <tr key={comp.id} className="text-center hover:bg-gray-50 transition">
                  <td className="px-4 py-2 border-b">{comp.name}</td>
                  <td className="px-4 py-2 border-b">{comp.quantity}</td>
                  <td className="px-4 py-2 border-b">{comp.description}</td>
                  <td className="px-4 py-2 border-b space-x-2">
                    <button
                      onClick={() => startEdit(comp)}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded font-semibold"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(comp.id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded font-semibold"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-4 text-gray-800">{editId ? 'Edit Component' : 'Add Component'}</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
          <input
            placeholder="Name"
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
            className="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <input
            placeholder="Quantity"
            type="number"
            value={form.quantity}
            onChange={e => setForm({ ...form, quantity: e.target.value })}
            className="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <input
            placeholder="Description"
            value={form.description}
            onChange={e => setForm({ ...form, description: e.target.value })}
            className="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
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
