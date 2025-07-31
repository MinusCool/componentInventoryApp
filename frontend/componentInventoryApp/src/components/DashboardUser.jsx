import React, { useEffect, useState } from 'react'
import API from '../api'

const DashboardUser = ({ username, onLogout}) => {
  const [components, setComponents] = useState([])
  const [amounts, setAmounts] = useState({})

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

  return (
    <div>
      <button onClick={onLogout} style={{ float: 'right' }}>Log Out</button>
      <h2>Component Inventory (User)</h2>
      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>Name</th>
            <th>Qty</th>
            <th>Description</th>
            <th>Take Amount</th>
          </tr>
        </thead>
        <tbody>
          {components.map(comp => (
            <tr key={comp.id}>
              <td>{comp.name}</td>
              <td>{comp.quantity}</td>
              <td>{comp.description}</td>
              <td>
                {comp.quantity > 0 ? (
                  <input
                    type="number"
                    min="0"
                    max={comp.quantity}
                    value={amounts[comp.id] || ''}
                    onChange={e => {
                      let value = e.target.value
                      if (parseInt(value)>comp.quantity) value = comp.quantity
                      setAmounts(prev => ({
                        ...prev,
                        [comp.id]: value
                      }))
                    }}
                    style={{ width: '60px' }}
                    placeholder="Qty"
                  />
                ) : (
                  <span style={{ color: 'red' }}>Out of stock</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <br />
      <button onClick={handleTakeAll}>Take</button>
    </div>
  )
}

export default DashboardUser
