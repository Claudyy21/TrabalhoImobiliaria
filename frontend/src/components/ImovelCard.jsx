import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useFetch } from '../hooks.js'
import { escolherCapa, fotosApi, fotoUrl } from '../services/api.js'
import { moeda, rotuloFinalidade, valorDoImovel, ehAluguel } from '../utils/format.js'

function Capa({ imovel }) {
  // Falha ao buscar fotos não deve quebrar o card: cai no ícone
  const { dados: fotos } = useFetch(() => fotosApi.listarPorImovel(imovel.id).catch(() => []), [imovel.id])
  const [quebrou, setQuebrou] = useState(false)
  const url = fotoUrl(escolherCapa(fotos), imovel.id)

  if (!url || quebrou) return <span className="text-4xl text-azul/40">⌂</span>
  return (
    <img
      src={url}
      alt={imovel.titulo}
      loading="lazy"
      onError={() => setQuebrou(true)}
      className="h-full w-full object-cover"
    />
  )
}

export default function ImovelCard({ imovel }) {
  const { valor, sufixo } = valorDoImovel(imovel)
  return (
    <article className="flex flex-col overflow-hidden rounded-xl border border-bruma bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="relative flex h-44 items-center justify-center overflow-hidden bg-bruma">
        <Capa imovel={imovel} />
        <span className={`absolute left-3 top-3 rounded-full px-3 py-0.5 text-xs font-bold uppercase tracking-wide text-white shadow ${ehAluguel(imovel.finalidade) ? 'bg-azul' : 'bg-ciano'}`}>
          {rotuloFinalidade(imovel.finalidade)}
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-1 p-4">
        <p className="text-xs uppercase tracking-wider text-tinta/50">{imovel.tipoImovel?.nome ?? 'Imóvel'}</p>
        <h3 className="font-display text-lg font-bold leading-snug">{imovel.titulo}</h3>
        <p className="text-sm text-tinta/70">
          {imovel.bairro?.nome ?? '—'}
          {imovel.bairro?.cidade ? `, ${imovel.bairro.cidade}` : ''}
        </p>
        <p className="mt-auto pt-3 font-display text-xl font-bold text-azul">
          {moeda(valor)}
          <span className="text-sm font-normal text-tinta/60">{sufixo}</span>
        </p>
        <Link to={`/imoveis/${imovel.id}`} className="mt-2 rounded-md border border-azul py-1.5 text-center text-sm font-medium text-azul hover:bg-azul hover:text-white">
          Ver detalhes
        </Link>
      </div>
    </article>
  )
}
