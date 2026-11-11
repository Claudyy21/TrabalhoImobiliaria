import { useEffect, useState } from 'react'
import { FILTROS_VAZIOS, validarFaixa } from '../utils/filtros.js'

const campo = 'mt-1 w-full rounded-md border border-bruma bg-white px-3 py-2 text-sm outline-none focus:border-azul focus:ring-2 focus:ring-azul/20'

export default function Filtros({ bairros, valores, onChange, onLimpar }) {
  // Os preços ficam num rascunho local e só aplicam depois que a pessoa para de digitar
  const [min, setMin] = useState(valores.min)
  const [max, setMax] = useState(valores.max)
  const erro = validarFaixa(min, max)

  useEffect(() => { setMin(valores.min); setMax(valores.max) }, [valores.min, valores.max])

  useEffect(() => {
    if (erro || (min === valores.min && max === valores.max)) return
    const t = setTimeout(() => onChange({ min, max }), 400)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [min, max])

  const filtrando = Object.keys(FILTROS_VAZIOS).some((k) => k !== 'ordem' && valores[k] !== '')

  return (
    <form onSubmit={(e) => e.preventDefault()} className="mb-8 rounded-xl border border-bruma bg-white p-4 shadow-sm" aria-label="Filtros">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <div>
          <label htmlFor="f-bairro" className="text-sm font-medium">Bairro</label>
          <select id="f-bairro" className={campo} value={valores.bairro} onChange={(e) => onChange({ bairro: e.target.value })}>
            <option value="">Todos</option>
            {bairros.map((b) => (
              <option key={b.id} value={b.id}>{b.nome}{b.cidade ? ` — ${b.cidade}` : ''}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="f-finalidade" className="text-sm font-medium">Finalidade</label>
          <select id="f-finalidade" className={campo} value={valores.finalidade} onChange={(e) => onChange({ finalidade: e.target.value })}>
            <option value="">Venda e aluguel</option>
            <option value="venda">Venda</option>
            <option value="aluguel">Aluguel</option>
          </select>
        </div>

        <div>
          <label htmlFor="f-min" className="text-sm font-medium">Preço mínimo (R$)</label>
          <input id="f-min" type="number" min="0" step="100" inputMode="numeric" placeholder="0" className={campo} value={min} onChange={(e) => setMin(e.target.value)} />
        </div>

        <div>
          <label htmlFor="f-max" className="text-sm font-medium">Preço máximo (R$)</label>
          <input id="f-max" type="number" min="0" step="100" inputMode="numeric" placeholder="Sem limite" className={campo} value={max} onChange={(e) => setMax(e.target.value)} />
        </div>

        <div>
          <label htmlFor="f-ordem" className="text-sm font-medium">Ordenar por</label>
          <select id="f-ordem" className={campo} value={valores.ordem} onChange={(e) => onChange({ ordem: e.target.value })}>
            <option value="">Padrão</option>
            <option value="menor">Menor preço</option>
            <option value="maior">Maior preço</option>
          </select>
        </div>
      </div>

      {erro && <p role="alert" className="mt-3 text-sm text-alerta">{erro}</p>}

      {filtrando && (
        <button type="button" onClick={onLimpar} className="mt-3 text-sm font-medium text-azul underline-offset-2 hover:underline">
          Limpar filtros
        </button>
      )}
    </form>
  )
}
