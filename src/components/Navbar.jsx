import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

// Menu por perfil: cada role só vê as suas opções
const MENUS = {
  PUBLICO: [{ to: '/', label: 'Imóveis' }],
  USER: [
    { to: '/', label: 'Imóveis' },
    { to: '/cliente', label: 'Minha área' },
  ],
  ADMIN: [
    { to: '/', label: 'Vitrine' },
    { to: '/admin', label: 'Painel' },
  ],
}

export default function Navbar() {
  const { usuario, logout } = useAuth()
  const [aberto, setAberto] = useState(false)
  const itens = MENUS[usuario?.role] ?? (usuario ? MENUS.USER : MENUS.PUBLICO)

  const link = ({ isActive }) =>
    `rounded px-3 py-1.5 text-sm ${isActive ? 'bg-white/15 font-medium' : 'hover:bg-white/10'}`

  return (
    <header className="relative bg-marinho text-gelo">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <Link to="/" className="font-display text-xl font-bold tracking-tight">
          Imobiliária<span className="text-ciano-claro">.</span>
        </Link>

        <button className="rounded border border-white/30 px-2 py-1 text-sm md:hidden" onClick={() => setAberto(!aberto)} aria-label="Abrir menu">
          ☰
        </button>

        <div className={`${aberto ? 'flex' : 'hidden'} absolute left-0 right-0 top-full z-10 flex-col gap-1 bg-marinho p-4 md:static md:flex md:flex-row md:items-center md:p-0`}>
          {itens.map((i) => (
            <NavLink key={i.to} to={i.to} end className={link} onClick={() => setAberto(false)}>
              {i.label}
            </NavLink>
          ))}
          {usuario ? (
            <div className="flex items-center gap-3 md:ml-4">
              <span className="text-sm text-gelo/70">Olá, {usuario.nome}</span>
              <button onClick={logout} className="rounded bg-ciano px-3 py-1.5 text-sm font-medium text-white hover:opacity-90">
                Sair
              </button>
            </div>
          ) : (
            <NavLink to="/login" className="rounded bg-ciano px-3 py-1.5 text-sm font-medium text-white hover:opacity-90 md:ml-4">
              Entrar
            </NavLink>
          )}
        </div>
      </nav>
    </header>
  )
}
