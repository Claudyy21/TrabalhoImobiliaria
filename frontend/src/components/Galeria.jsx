
import { useState } from 'react'
import { escolherCapa, fotoUrl } from '../services/api.js'

// Foto grande + miniaturas. Sem foto (ou foto que não carrega) mostra um espaço reservado.
export default function Galeria({ fotos, imovelId, titulo }) {
  const [quebradas, setQuebradas] = useState([])
  const [escolhida, setEscolhida] = useState(null)

  const lista = (fotos ?? []).filter((f) => !quebradas.includes(f.id))
  const capa = escolherCapa(lista)
  const atual = lista.find((f) => f.id === escolhida) ?? capa
  const marcarQuebrada = (id) => setQuebradas((q) => [...q, id])

  if (!atual) {
    return (
      <div className="flex h-72 flex-col items-center justify-center rounded-xl bg-bruma text-azul/50 sm:h-96">
        <span className="text-6xl">⌂</span>
        <span className="mt-2 text-sm">Este imóvel ainda não tem fotos</span>
      </div>
    )
  }

  return (
    <div>
      <img
        src={fotoUrl(atual, imovelId)}
        alt={titulo}
        onError={() => marcarQuebrada(atual.id)}
        className="h-72 w-full rounded-xl bg-bruma object-cover sm:h-96"
      />
      {lista.length > 1 && (
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
          {lista.map((f, i) => (
            <button
              key={f.id}
              onClick={() => setEscolhida(f.id)}
              aria-label={`Ver foto ${i + 1}`}
              className={`h-16 w-24 shrink-0 overflow-hidden rounded-md border-2 ${f.id === atual.id ? 'border-azul' : 'border-transparent opacity-70 hover:opacity-100'}`}
            >
              <img src={fotoUrl(f, imovelId)} alt="" loading="lazy" onError={() => marcarQuebrada(f.id)} className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
