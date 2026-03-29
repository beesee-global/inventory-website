import React from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from '../components/ui/Sidebar'
import SnackbarMain from '../components/feedback/SnackbarMain'
import { userAuth } from '../hooks/userAuth'

const MainLayout = () => {

  const { 
    snackBarOpen, 
    snackBarType, 
    snackBarMessage, 
    setSnackBarOpen 
  } = userAuth()
  return (
    <div className="min-h-screen w-full bg-white text-white">
      <SnackbarMain
        open={snackBarOpen}
        type={snackBarType}
        message={snackBarMessage}
        onClose={() => setSnackBarOpen(false)}
      />

      <div className="relative min-h-screen ">
        <div className="flex min-h-screen">
          <aside className="w-64 border-r"> 
            <Sidebar />
          </aside>
          <main className="flex-1 p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  )
}

export default MainLayout
