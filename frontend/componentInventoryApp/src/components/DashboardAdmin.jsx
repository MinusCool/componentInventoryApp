import React, { useEffect, useState } from 'react'
import API from '../api'

const DashboardAdmin = ({ username, onLogout }) => {
  const [components, setComponents] = useState([])
  const [form, setForm] = useState({ name: '', quantity: '', description: '' })
  const [editId, setEditId] = useState(null)
  const [search, setSearch] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const [showUpdate, setShowUpdate] = useState(false)
  const [showAdd, setShowAdd] = useState(false)
  const [error, setError] = useState('')
  const [showError, setShowError] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [deleteId, setDeleteId] = useState(null)

  const loadComponents = () => {
    API.get('/components', { params: { username } })
      .then(res => setComponents(res.data))
      .catch(() => setError("Failed to load components"))
  }

  useEffect(() => {
    loadComponents()
  }, [])

  const handleAdd = () => {
    if (!form.name || !form.quantity) {
      //setError("Name and quantity are required.")
      //setShowError(true)
      return
    }
    API.post('/components', form, { params: { username } })
      .then(() => {
        setForm({ name: '', quantity: '', description: '' })
        loadComponents()
      })
      .catch(() => setError("Failed to add component"))
      //setShowError(true)
  }

  const handleUpdate = () => {
    if (!form.name || !form.quantity) {
      //setError("Name and quantity are required.")
      //setShowError(true)
      return
    }
    API.put(`/components/${editId}`, form, { params: { username } })
      .then(() => {
        closeUpdate()
        loadComponents()
      })
      .catch(() => setError("Failed to update component"))
      //setShowError(true)
  }

  const startEdit = (comp) => {
    setForm({ name: comp.name, quantity: comp.quantity, description: comp.description })
    setEditId(comp.id)
    setShowUpdate(true)
  }

  const closeUpdate = () =>{
    setShowUpdate(false)
    setEditId(null)
    setForm({ name: '', quantity: '', description: '' })
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
            onClick={() => setShowAdd(true)}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 ronded font-semibold"
          >
            Add Component
          </button>
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
                  <td className="px-4 py-2 border-b">
                    {comp.quantity === 0 ?(
                    <span className="text-red-500">Out of Stock</span>
                  ):(
                    comp.quantity
                  )}
                  </td>
                  <td className="px-4 py-2 border-b">{comp.description}</td>
                  <td className="px-4 py-2 border-b space-x-2">
                    <button
                      onClick={() => startEdit(comp)}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded font-semibold"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => {
                        setDeleteId(comp.id)
                        setShowConfirm(true)
                      }}
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

      {showUpdate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md relative">
            <button
              onClick={closeUpdate}
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-2xl font-bold"
              aria-label="Close"
            >
              &times;
            </button>
            <h3 className="text-xl font-semibold mb-4 text-gray-800">Edit Component</h3>
            <div className="grid grid-cols-1 gap-4 mb-4">
              <input
                placeholder="Name"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                className="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <input
                placeholder="Quantity"
                type="number"
                min="0"
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
            <button
              onClick={handleUpdate}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded w-full"
            >
              Update
            </button>
          </div>
        </div>
      )}
      
      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md relative">
            <button
              onClick={() => {
                setShowAdd(false)
                setForm({ name: '', quantity: '', description: '' })
              }}
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-2xl font-bold"
              aria-label="Close"
            >
              &times;
            </button>
            <h3 className="text-xl font-semibold mb-4 text-gray-800">Add Component</h3>
            <div className="grid grid-cols-1 gap-4 mb-4">
              <input
                placeholder="Name"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                className="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <input
                placeholder="Quantity"
                type="number"
                min="0"
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
            <button
              onClick={() => {
                handleAdd()
                setShowAdd(false)
              }}
              className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-2 rounded w-full"
            >
              Add
            </button>
          </div>
        </div>
      )}

      {showError && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm relative flex flex-col items-center">
            <h3 className="text-lg font-semibold mb-2 text-red-600">Error</h3>
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

      {showConfirm && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
        <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm relative flex flex-col items-center">
          <h3 className="text-lg font-semibold mb-2 text-red-600">Confirm Delete</h3>
          <p className="text-gray-700 mb-6">Are you sure you want to delete this component?</p>
          <div className="flex gap-4">
            <button
              onClick={() => {
                API.delete(`/components/${deleteId}`, { params: { username } })
                  .then(() => {
                    setShowConfirm(false)
                    setDeleteId(null)
                    loadComponents()
                  })
                  .catch(() => {
                    setError("Failed to delete component")
                    setShowError(true)
                    setShowConfirm(false)
                    setDeleteId(null)
                  })
              }}
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded"
            >
              Delete
            </button>
            <button
              onClick={() => {
                setShowConfirm(false)
                setDeleteId(null)
              }}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-6 rounded"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    )}
    </div>
  )
}

export default DashboardAdmin
