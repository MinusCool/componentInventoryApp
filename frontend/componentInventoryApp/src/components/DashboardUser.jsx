import React, { useEffect, useState } from 'react'
import API from '../api'

const DashboardUser = ({ username, onLogout}) => {
  const [components, setComponents] = useState([])
  const [amounts, setAmounts] = useState({})
  const [search, setSearch] = useState('')
  const [searchInput, setSearchInput] = useState('')


  const loadComponents = () => {
    API.get(`/components`, { params: { username } })
      .then(res => setComponents(res.data))
      .catch(() => alert("Failed to fetch components"))
  }

  useEffect(() => {
    loadComponents()
  }, [username])

  const handleTakeAll = () => {
    const takeList = components.filter(comp => {
      const amount = parseInt(amounts[comp.id] || '0')
      return amount > 0 && amount <= comp.quantity
    })

    if (takeList.length === 0) {
      alert("No valid components selected to take.")
      return
    }

    Promise.all(
      takeList.map(comp => {
        const takeAmount = parseInt(amounts[comp.id])
        const updatedComponent = {
          name: comp.name,
          quantity: comp.quantity - takeAmount,
          description: comp.description,
        }

        return API.put(`/components/${comp.id}`, updatedComponent, {
          params: { username }
        })
      })
    )
      .then(() => {
        alert("Components taken successfully.")
        loadComponents()
        setAmounts({})
      })
      .catch(err => {
        alert(err.response?.data?.detail || "Failed to update components.")
      })
  }

  const filteredcomponents = components.filter(comp =>
    comp.name.toLowerCase().includes(search.toLowerCase()) ||
    (comp.description || '').toLowerCase().includes(search.toLowerCase())
  )

  const handleSearch = (e) => {
    e.preventDefault()
    setSearch(searchInput)
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Component Inventory (User)</h2>
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
              <th className="px-4 py-2 border-b">Name</th>
              <th className="px-4 py-2 border-b">Qty</th>
              <th className="px-4 py-2 border-b">Description</th>
              <th className="px-4 py-2 border-b">Take Amount</th>
            </tr>
          </thead>
          <tbody>
            {filteredcomponents.length === 0 ?(
              <tr>
                <td colSpan={4} className="text-center py-4 text-gray-500">No components found.</td>
              </tr>
            ):(
              filteredcomponents.map(comp => (
              <tr key={comp.id} className="text-center">
                <td className="px-4 py-2 border-b">{comp.name}</td>
                <td className="px-4 py-2 border-b">
                  {comp.quantity === 0 ?(
                    <span className="text-red-500">Out of Stock</span>
                  ):(
                    comp.quantity
                  )}
                  </td>
                <td className="px-4 py-2 border-b">{comp.description}</td>
                <td className="px-4 py-2 border-b">
                  <input
                    type="number"
                    min="0"
                    max={comp.quantity}
                    value={amounts[comp.id] || ''}
                    onChange={e => {
                      let value = e.target.value
                      if (parseInt(value) > comp.quantity) value = comp.quantity
                        setAmounts(prev => ({
                          ...prev,
                          [comp.id]: value
                        }))
                    }}
                      className="border rounded px-2 py-1 w-20 text-center"
                      placeholder="Qty"
                      disabled={comp.quantity === 0}
                  />
                </td>
              </tr>
            ))
          )}
          </tbody>
        </table>
      </div>

      <div className="text-center mt-6">
        <button
          onClick={handleTakeAll}
          className="bg-green-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded"
        >
          Take
        </button>
      </div>
    </div>
  )
}

export default DashboardUser
