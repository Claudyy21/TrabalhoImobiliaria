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
    `rounded-md px-4 py-2 text-sm tracking-wide transition-colors ${isActive
      ? 'bg-white/10 font-semibold text-[#e2c58e]'
      : 'text-[#d0cec8] hover:bg-white/5 hover:text-white'}`

  return (
    <header className="relative border-b border-[#d2b47c]/20 bg-[#101214] text-[#f1eee7]">
      <nav className="mx-auto flex min-h-[76px] max-w-7xl items-center justify-between px-4 py-3">
        <Link to="/" className="flex items-center font-display text-2xl font-bold tracking-tight text-[#f1eee7] hover:text-white">
          <span className="mr-3 inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[#b89459]/60 bg-[#b89459]/10 text-sm text-[#d8bd89]">⌂</span>
          <span>Imobiliária<span className="text-[#e2c58e]">.</span></span>
        </Link>

        <button className="rounded border border-white/30 px-3 py-2 text-sm text-[#f1eee7] md:hidden" onClick={() => setAberto(!aberto)} aria-label="Abrir menu">
          ☰
        </button>

        <div className={`${aberto ? 'flex' : 'hidden'} absolute left-0 right-0 top-full z-10 flex-col gap-1 border-b border-white/10 bg-[#101214] p-4 md:static md:flex md:flex-row md:items-center md:border-0 md:bg-transparent md:p-0`}>
          {itens.map((i) => (
            <NavLink key={i.to} to={i.to} end className={link} onClick={() => setAberto(false)}>
              {i.label}
            </NavLink>
          ))}
          {usuario ? (
            <div className="flex items-center gap-3 md:ml-4">
              <span className="text-sm text-[#c8c4ba]">Olá, {usuario.nome}</span>
              <button onClick={logout} className="rounded-md bg-[#b89459] px-4 py-2 text-sm font-semibold text-[#17191b] transition-colors hover:bg-[#d0b47d]">
                Sair
              </button>
            </div>
          ) : (
            <NavLink to="/login" className="rounded-md bg-[#b89459] px-4 py-2 text-sm font-semibold text-[#17191b] hover:bg-[#d0b47d] md:ml-4">
              Entrar
            </NavLink>
          )}
        </div>
      </nav>
    </header>
  )
}
