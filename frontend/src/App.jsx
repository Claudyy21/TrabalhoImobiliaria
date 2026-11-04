import { Route, Routes } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import Home from './pages/Home.jsx'
import Login from './pages/Login.jsx'
import { AdminHome, ClienteHome, DetalheImovel } from './pages/Placeholders.jsx'
import { AcessoNegado, NaoEncontrado } from './pages/Erros.jsx'

export default function App() {
  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-8">
        <Routes>
          {/* públicas */}
          <Route path="/" element={<Home />} />
          <Route path="/imoveis/:id" element={<DetalheImovel />} />
          <Route path="/login" element={<Login />} />
          <Route path="/acesso-negado" element={<AcessoNegado />} />

          {/* cliente */}
          <Route element={<ProtectedRoute roles={['USER']} />}>
            <Route path="/cliente" element={<ClienteHome />} />
          </Route>

          {/* admin */}
          <Route element={<ProtectedRoute roles={['ADMIN']} />}>
            <Route path="/admin" element={<AdminHome />} />
          </Route>

          <Route path="*" element={<NaoEncontrado />} />
        </Routes>
      </main>
    </>
  )
}
