import React from 'react'
import Sidebar from './Sidebar'
import { Outlet } from 'react-router'

const Layout: React.FC = () => {
  return (
    <div className="flex h-screen bg-background text-left">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-8">
        <Outlet />
      </main>
    </div>
  )
}

export default Layout
