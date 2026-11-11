import { useEffect, useRef, useState } from 'react'
import { useAuth } from '../context/AuthContext.jsx'
import { imoveisApi } from '../services/api.js'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function validar({ nome, telefone, email, mensagem }) {
  const e = {}
  if (!nome.trim()) e.nome = 'Informe seu nome.'
  if (telefone.replace(/\D/g, '').length < 8) e.telefone = 'Informe um telefone válido, com DDD.'
  if (!email.trim()) e.email = 'Informe seu e-mail.'
  else if (!EMAIL_RE.test(email.trim())) e.email = 'E-mail inválido.'
  if (!mensagem.trim()) e.mensagem = 'Escreva uma mensagem.'
  return e
}

const campo = 'mt-1 w-full rounded-md border border-bruma bg-white px-3 py-2 text-sm outline-none focus:border-azul focus:ring-2 focus:ring-azul/20'
const botaoLink = 'rounded-md border border-azul px-3 py-1.5 text-center text-xs font-medium text-azul hover:bg-azul hover:text-white'

export default function ContatoModal({ imovel, contato, onFechar }) {
  const { usuario } = useAuth()
  const [form, setForm] = useState({
    nome: usuario?.nome ?? '',
    telefone: '',
    email: usuario?.email ?? '',
    mensagem: contato.corpo, // já vem com código, tipo, bairro e valor; a pessoa pode editar
  })
  const [erros, setErros] = useState({})
  const [erroEnvio, setErroEnvio] = useState(null)
  const [enviando, setEnviando] = useState(false)
  const [enviado, setEnviado] = useState(false)
  const [copiado, setCopiado] = useState(false)
  const painel = useRef(null)

  useEffect(() => {
    painel.current?.focus()
    const aoTeclar = (e) => e.key === 'Escape' && onFechar()
    document.addEventListener('keydown', aoTeclar)
    return () => document.removeEventListener('keydown', aoTeclar)
  }, [onFechar])

  const alterar = (k) => (ev) => setForm({ ...form, [k]: ev.target.value })

  async function enviar(ev) {
    ev.preventDefault()
    setErroEnvio(null)
    const v = validar(form)
    setErros(v)
    if (Object.keys(v).length) return

    setEnviando(true)
    try {
      await imoveisApi.saberMais(imovel.id, {
        nome: form.nome.trim(),
        telefone: form.telefone.trim(),
        email: form.email.trim(),
        mensagem: form.mensagem.trim(),
      })
      setEnviado(true)
    } catch (e) {
      setErroEnvio(
        e.status === 0 || e.status === 404 || e.status === 400
          ? e.message
          : 'Não foi possível enviar o e-mail agora. Tente de novo ou use uma das opções abaixo.',
      )
    } finally {
      setEnviando(false)
    }
  }

  async function copiar() {
    try {
      await navigator.clipboard.writeText(`Para: ${contato.para}\nAssunto: ${contato.assunto}\n\n${form.mensagem}`)
      setCopiado(true)
      setTimeout(() => setCopiado(false), 2500)
    } catch {
      setCopiado(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-marinho/50 p-4" onClick={onFechar}>
      <div
        ref={painel}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby="contato-titulo"
        onClick={(e) => e.stopPropagation()}
        className="max-h-full w-full max-w-lg overflow-y-auto rounded-xl bg-white p-6 shadow-xl outline-none"
      >
        <div className="flex items-start justify-between gap-4">
          <h2 id="contato-titulo" className="font-display text-xl font-bold text-marinho">Entrar em contato</h2>
          <button onClick={onFechar} aria-label="Fechar" className="text-2xl leading-none text-tinta/50 hover:text-tinta">×</button>
        </div>

        {enviado ? (
          <div className="py-8 text-center" role="status">
            <p className="text-4xl text-ciano">✓</p>
            <p className="mt-3 font-medium">E-mail enviado!</p>
            <p className="mt-1 text-sm text-tinta/70">Enviamos as informações do imóvel para {form.email}. Se não achar, olhe a caixa de spam.</p>
            <button onClick={onFechar} className="mt-6 rounded-md bg-azul px-5 py-2 text-white hover:bg-marinho">Fechar</button>
          </div>
        ) : (
          <>
            <p className="mt-2 text-sm text-tinta/70">Preencha seus dados e enviaremos um e-mail sobre este imóvel.</p>

            <form onSubmit={enviar} noValidate className="mt-4 space-y-3">
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label htmlFor="c-nome" className="text-sm font-medium">Nome</label>
                  <input id="c-nome" autoComplete="name" className={campo} value={form.nome} onChange={alterar('nome')} />
                  {erros.nome && <p className="mt-1 text-xs text-alerta">{erros.nome}</p>}
                </div>
                <div>
                  <label htmlFor="c-tel" className="text-sm font-medium">Telefone</label>
                  <input id="c-tel" type="tel" autoComplete="tel" placeholder="(55) 99999-9999" className={campo} value={form.telefone} onChange={alterar('telefone')} />
                  {erros.telefone && <p className="mt-1 text-xs text-alerta">{erros.telefone}</p>}
                </div>
              </div>
              <div>
                <label htmlFor="c-email" className="text-sm font-medium">Seu e-mail</label>
                <input id="c-email" type="email" autoComplete="email" className={campo} value={form.email} onChange={alterar('email')} />
                {erros.email && <p className="mt-1 text-xs text-alerta">{erros.email}</p>}
              </div>
              <div>
                <label htmlFor="c-msg" className="text-sm font-medium">Mensagem</label>
                <textarea id="c-msg" rows={8} className={campo} value={form.mensagem} onChange={alterar('mensagem')} />
                {erros.mensagem && <p className="mt-1 text-xs text-alerta">{erros.mensagem}</p>}
              </div>

              {erroEnvio && <p role="alert" className="rounded bg-alerta/10 p-2 text-sm text-alerta">{erroEnvio}</p>}

              <button disabled={enviando} className="w-full rounded-md bg-ciano py-2.5 font-medium text-white hover:opacity-90 disabled:opacity-60">
                {enviando ? 'Enviando…' : 'Enviar e-mail'}
              </button>
            </form>

            <div className="mt-5 border-t border-bruma pt-4">
              <p className="mb-2 text-xs text-tinta/60">Ou envie pelo seu próprio e-mail para {contato.para}:</p>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                <a href={contato.links.gmail} target="_blank" rel="noopener noreferrer" className={botaoLink}>Gmail</a>
                <a href={contato.links.outlook} target="_blank" rel="noopener noreferrer" className={botaoLink}>Outlook</a>
                <a href={contato.links.mailto} className={botaoLink}>Programa de e-mail</a>
                <button type="button" onClick={copiar} className={botaoLink}>{copiado ? '✓ Copiado' : 'Copiar'}</button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
