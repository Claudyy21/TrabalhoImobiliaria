import { useEffect, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import ImovelCard from '../components/ImovelCard.jsx'
import Paginacao from '../components/Paginacao.jsx'
import { Carregando, ErroMensagem, SemResultados } from '../components/Feedback.jsx'
import { useFetch } from '../hooks.js'
import { imoveisApi } from '../services/api.js'

// 4 colunas x 2 linhas. Para testar a paginação com poucos imóveis, diminua (ex.: 4).
const POR_PAGINA = 8

// Só imóveis disponíveis aparecem na vitrine (reservado/alugado/vendido ficam de fora)
const indisponivel = (i) => /^(reserv|alugad|vendid)/i.test((i.status ?? '').trim())

export default function Home() {
  const { dados, erro, carregando, recarregar } = useFetch(() => imoveisApi.listar())
  // A página fica na URL (?pagina=2): o botão "voltar" e o link compartilhado funcionam
  const [params, setParams] = useSearchParams()

  const disponiveis = useMemo(() => (dados ?? []).filter((i) => !indisponivel(i)), [dados])
  const totalPaginas = Math.max(1, Math.ceil(disponiveis.length / POR_PAGINA))
  const pagina = Math.min(Math.max(parseInt(params.get('pagina')) || 1, 1), totalPaginas)
  const visiveis = disponiveis.slice((pagina - 1) * POR_PAGINA, pagina * POR_PAGINA)

  const irPara = (p) => {
    setParams(p === 1 ? {} : { pagina: p })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Se a URL pedir uma página que não existe, volta para a última
  useEffect(() => {
    if (!carregando && dados && pagina !== (parseInt(params.get('pagina')) || 1)) irPara(pagina)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [carregando, dados])

  return (
    <section>
      <div className="mb-8">
        <h1 className="font-display text-4xl font-bold text-marinho">Encontre seu próximo endereço</h1>
        <p className="mt-2 text-tinta/70">
          Imóveis para alugar e comprar.
          {!carregando && !erro && disponiveis.length > 0 && (
            <span className="ml-1">
              {disponiveis.length} {disponiveis.length === 1 ? 'imóvel disponível' : 'imóveis disponíveis'}.
            </span>
          )}
        </p>
      </div>

      {carregando && <Carregando />}
      {erro && <ErroMensagem erro={erro} onTentarDeNovo={recarregar} />}
      {!carregando && !erro && disponiveis.length === 0 && <SemResultados texto="Nenhum imóvel disponível no momento." />}
      {!carregando && !erro && visiveis.length > 0 && (
        <>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {visiveis.map((i) => <ImovelCard key={i.id} imovel={i} />)}
          </div>
          <Paginacao pagina={pagina} totalPaginas={totalPaginas} onChange={irPara} />
        </>
      )}
    </section>
  )
}
