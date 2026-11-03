// Gera [1, '…', 4, 5, 6, '…', 20] sem listar todas as páginas
function janela(atual, total) {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)
  const paginas = new Set([1, total, atual, atual - 1, atual + 1])
  const ordenadas = [...paginas].filter((p) => p >= 1 && p <= total).sort((a, b) => a - b)
  const saida = []
  ordenadas.forEach((p, i) => {
    if (i > 0 && p - ordenadas[i - 1] > 1) saida.push('…')
    saida.push(p)
  })
  return saida
}

export default function Paginacao({ pagina, totalPaginas, onChange }) {
  if (totalPaginas <= 1) return null

  const base = 'min-w-9 rounded-md border px-3 py-1.5 text-sm transition'
  const normal = 'border-bruma bg-white text-azul hover:bg-azul hover:text-white'
  const ativo = 'border-azul bg-azul font-bold text-white'
  const desligado = 'cursor-not-allowed border-bruma bg-white text-tinta/30'

  return (
    <nav aria-label="Paginação" className="mt-10 flex flex-wrap items-center justify-center gap-2">
      <button className={`${base} ${pagina === 1 ? desligado : normal}`} disabled={pagina === 1} onClick={() => onChange(pagina - 1)}>
        ‹ Anterior
      </button>

      {janela(pagina, totalPaginas).map((p, i) =>
        p === '…' ? (
          <span key={`gap-${i}`} className="px-1 text-tinta/50">…</span>
        ) : (
          <button key={p} className={`${base} ${p === pagina ? ativo : normal}`} aria-current={p === pagina ? 'page' : undefined} onClick={() => onChange(p)}>
            {p}
          </button>
        ),
      )}

      <button className={`${base} ${pagina === totalPaginas ? desligado : normal}`} disabled={pagina === totalPaginas} onClick={() => onChange(pagina + 1)}>
        Próxima ›
      </button>
    </nav>
  )
}
