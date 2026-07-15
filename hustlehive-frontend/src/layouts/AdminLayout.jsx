import { Outlet } from 'react-router-dom'

const AdminLayout = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        {/* Admin sidebar will go here in Module 12 */}
        <main className="flex-1 min-h-screen p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default AdminLayout