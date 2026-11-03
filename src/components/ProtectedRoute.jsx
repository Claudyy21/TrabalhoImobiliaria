import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

// <ProtectedRoute roles={['ADMIN']} />  -> envolve as rotas filhas
export default function ProtectedRoute({ roles }) {
  const { usuario } = useAuth()
  const location = useLocation()

  if (!usuario) return <Navigate to="/login" replace state={{ from: location.pathname }} />
  if (roles && !roles.includes(usuario.role)) return <Navigate to="/acesso-negado" replace />
  return <Outlet />
}
