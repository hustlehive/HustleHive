import { useNavigate } from 'react-router-dom'

const NotFound = () => {
  const navigate = useNavigate()

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4">
      <h1 className="text-6xl font-bold text-primary">404</h1>
      <p className="text-xl text-muted-foreground">Page not found</p>
      <button
        onClick={() => navigate(-1)}
        className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:opacity-90"
      >
        Go Back
      </button>
    </div>
  )
}

export default NotFound