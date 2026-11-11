import { useEffect, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import Filtros from '../components/Filtros.jsx'
import ImovelCard from '../components/ImovelCard.jsx'
import Paginacao from '../components/Paginacao.jsx'
import { Carregando, ErroMensagem, SemResultados } from '../components/Feedback.jsx'
import { useFetch } from '../hooks.js'
import { imoveisApi } from '../services/api.js'
import { bairrosDaLista, filtrar, indisponivel, ordenar } from '../utils/filtros.js'

// 4 colunas x 2 linhas. Para testar a paginação com poucos imóveis, diminua (ex.: 4).
const POR_PAGINA = 8

export default function Home() {
  const { dados, erro, carregando, recarregar } = useFetch(() => imoveisApi.listar())
  // Filtros, ordem e página ficam na URL (?bairro=2&finalidade=venda&ordem=menor&pagina=2):
  // o botão "voltar" e o link compartilhado funcionam.
  const [params, setParams] = useSearchParams()

  const valores = {
    bairro: params.get('bairro') ?? '',
    finalidade: params.get('finalidade') ?? '',
    min: params.get('min') ?? '',
    max: params.get('max') ?? '',
    ordem: params.get('ordem') ?? '',
  }

  const atualizar = (mudancas, { manterPagina = false, replace = false } = {}) => {
    const prox = new URLSearchParams(params)
    Object.entries(mudancas).forEach(([k, v]) => (v ? prox.set(k, v) : prox.delete(k)))
    if (!manterPagina) prox.delete('pagina') // mudou o filtro: volta para a página 1
    setParams(prox, { replace })
  }

  const todos = dados ?? []
  const disponiveis = useMemo(() => todos.filter((i) => !indisponivel(i)), [dados]) // eslint-disable-line react-hooks/exhaustive-deps
  const bairros = useMemo(() => bairrosDaLista(disponiveis), [disponiveis])
  const resultado = useMemo(
    () => ordenar(filtrar(disponiveis, valores), valores.ordem),
    [disponiveis, valores.bairro, valores.finalidade, valores.min, valores.max, valores.ordem], // eslint-disable-line react-hooks/exhaustive-deps
  )

  const totalPaginas = Math.max(1, Math.ceil(resultado.length / POR_PAGINA))
  const pedida = parseInt(params.get('pagina')) || 1
  const pagina = Math.min(Math.max(pedida, 1), totalPaginas)
  const visiveis = resultado.slice((pagina - 1) * POR_PAGINA, pagina * POR_PAGINA)

  const irPara = (p) => {
    atualizar({ pagina: p > 1 ? String(p) : '' }, { manterPagina: true })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Se a URL pedir uma página que não existe, corrige para a última
  useEffect(() => {
    if (!carregando && dados && pagina !== pedida) atualizar({ pagina: pagina > 1 ? String(pagina) : '' }, { manterPagina: true, replace: true })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [carregando, dados, pagina, pedida])

  const limpar = () => setParams({})
  const filtrando = ['bairro', 'finalidade', 'min', 'max'].some((k) => valores[k] !== '')

  return (
    <section>
      <div className="mb-6">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[.28em] text-[#c6a56a]">Curadoria imobiliária</p>
        <h1 className="font-display text-4xl font-bold text-marinho">Encontre um lugar <span className="text-[#c6a56a]">para chamar de seu.</span></h1>
        <p className="mt-3 max-w-xl text-tinta/70">Uma seleção especial de imóveis para comprar ou alugar, com o espaço certo para o seu próximo capítulo.</p>
      </div>

      {!carregando && !erro && disponiveis.length > 0 && (
        <Filtros
          bairros={bairros}
          valores={valores}
          onChange={(m) => atualizar(m)}
          onLimpar={limpar}
        />
      )}

      {carregando && <Carregando />}
      {erro && <ErroMensagem erro={erro} onTentarDeNovo={recarregar} />}
      {!carregando && !erro && disponiveis.length === 0 && <SemResultados texto="Nenhum imóvel disponível no momento." />}

      {!carregando && !erro && disponiveis.length > 0 && (
        <p className="mb-4 text-sm text-tinta/70" aria-live="polite">
          {resultado.length} {resultado.length === 1 ? 'imóvel encontrado' : 'imóveis encontrados'}
          {filtrando && ` (de ${disponiveis.length})`}
        </p>
      )}

      {!carregando && !erro && disponiveis.length > 0 && resultado.length === 0 && (
        <div className="py-10 text-center">
          <SemResultados texto="Nenhum imóvel encontrado com esses filtros." />
          <button onClick={limpar} className="rounded-md bg-azul px-4 py-2 text-white hover:bg-marinho">Limpar filtros</button>
        </div>
      )}

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
