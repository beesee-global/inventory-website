import React, { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Menu } from 'lucide-react'
import Sidebar from '../components/ui/Sidebar'
import SnackbarMain from '../components/feedback/SnackbarMain'
import { userAuth } from '../hooks/userAuth'

const MainLayout = () => {
  const [showSidebar, setShowSidebar] = useState(false)

  const {
    snackBarOpen,
    snackBarType,
    snackBarMessage,
    setSnackBarOpen,
  } = userAuth()

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-white text-gray-900">
      <SnackbarMain
        open={snackBarOpen}
        type={snackBarType}
        message={snackBarMessage}
        onClose={() => setSnackBarOpen(false)}
      />

      <div className="relative flex min-h-screen w-full">
        <aside
          className={`fixed inset-y-0 left-0 z-40 h-screen w-72 max-w-[85vw] overflow-y-auto border-r border-gray-200 bg-white transition-transform duration-300 md:static md:h-auto md:w-64 md:max-w-none md:flex-shrink-0 md:overflow-visible md:translate-x-0 ${
            showSidebar ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <Sidebar setShowSidebar={setShowSidebar} />
        </aside>

        {showSidebar && (
          <button
            type="button"
            onClick={() => setShowSidebar(false)}
            className="fixed inset-0 z-30 bg-black/40 md:hidden"
            aria-label="Close sidebar"
          />
        )}

        <main className="flex h-screen min-w-0 flex-1 flex-col overflow-hidden">
          <div className="sticky top-0 z-20 mb-4 flex items-center justify-between border-b border-gray-200 bg-white/95 px-2 py-3 backdrop-blur md:hidden">
            <button
              type="button"
              onClick={() => setShowSidebar(true)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-700 shadow-sm"
              aria-label="Open sidebar"
            >
              <Menu size={20} />
            </button>
            <span className="text-lg font-semibold text-gray-900">Menu</span>
          </div>

          <div className="min-h-0 w-full min-w-0 max-w-full flex-1 overflow-y-auto px-4 pb-6 pt-4 sm:px-5 md:px-6 md:py-6">
            <div className="w-full min-w-0">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default MainLayout
