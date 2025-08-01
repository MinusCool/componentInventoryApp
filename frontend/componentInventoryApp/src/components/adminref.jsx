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

// ...existing code...
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
    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded font-semibold"
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
// ...existing code...