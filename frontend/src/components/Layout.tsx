import React from 'react'
import Sidebar from './Sidebar'
import { Outlet } from 'react-router'
import Navbar from './ui/Navbar'

const Layout: React.FC = () => {
  return (
    <div className="flex h-screen bg-background text-left">
      <Navbar />
      <div className="pt-16 flex h-screen bg-background text-left pl-32 pr-32">
        <Sidebar />
        <main className="flex-1 overflow-y-auto pl-4">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default Layout
