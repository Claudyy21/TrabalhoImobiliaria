export function Carregando({ texto = 'Carregando…' }) {
  return (
    <div role="status" className="flex items-center justify-center gap-3 py-16 text-azul">
      <span className="h-5 w-5 animate-spin rounded-full border-2 border-azul border-t-transparent" />
      <span>{texto}</span>
    </div>
  )
}

export function SemResultados({ texto = 'Nenhum resultado encontrado.' }) {
  return <p className="py-16 text-center text-tinta/60">{texto}</p>
}

export function ErroMensagem({ erro, onTentarDeNovo }) {
  return (
    <div role="alert" className="mx-auto my-8 max-w-lg rounded-lg border border-alerta/40 bg-alerta/10 p-5 text-center">
      <p className="text-alerta">{erro?.message || 'Algo deu errado.'}</p>
      {onTentarDeNovo && (
        <button onClick={onTentarDeNovo} className="mt-3 rounded-md bg-alerta px-4 py-1.5 text-sm font-medium text-white hover:opacity-90">
          Tentar de novo
        </button>
      )}
    </div>
  )
}
