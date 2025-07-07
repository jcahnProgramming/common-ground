import { useAuth } from './AuthProvider'
import Auth from '../Auth'

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth()

  if (loading) return <div className="centered">Loading...</div>

  return user ? <>{children}</> : <Auth />
}

export default ProtectedRoute
