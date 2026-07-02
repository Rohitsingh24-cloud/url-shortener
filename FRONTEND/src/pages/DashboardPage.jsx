import React from 'react'
import UrlForm from '../components/UrlForm.jsx'
import UserUrl from '../components/UserUrl.jsx'

const DashboardPage = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
    <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-gray-500 mt-2">Manage all your shortened URLs</p>
      </div>
      <UrlForm/>
      <UserUrl/>
    </div>
  </div>
  )
}

export default DashboardPage