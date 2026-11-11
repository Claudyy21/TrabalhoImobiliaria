import { useState } from 'react'
import { useNavigate, useLocation, useParams } from 'react-router-dom'
import ContatoModal from '../components/ContatoModal.jsx'
import Galeria from '../components/Galeria.jsx'
import { Carregando, ErroMensagem } from '../components/Feedback.jsx'
import { EMAIL_IMOBILIARIA } from '../config.js'
import { useFetch } from '../hooks.js'
import { fotosApi, imoveisApi } from '../services/api.js'
import { montarContato } from '../utils/contato.js'
import { infoStatus, moeda, rotuloFinalidade, valorDoImovel } from '../utils/format.js'

const Item = ({ rotulo, valor }) =>
  valor == null || valor === '' ? null : (
    <div className="rounded-lg bg-gelo p-3">
      <dt className="text-xs uppercase tracking-wide text-tinta/50">{rotulo}</dt>
      <dd className="mt-0.5 font-medium">{valor}</dd>
    </div>
  )

export default function DetalheImovel() {
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const [contatoAberto, setContatoAberto] = useState(false)

  const imovel = useFetch(() => imoveisApi.buscar(id), [id])
  // Falha ao buscar fotos não impede de ver o imóvel
  const fotos = useFetch(() => fotosApi.listarPorImovel(id).catch(() => []), [id])

  // Volta para a vitrine mantendo filtros e página; se abriu o link direto, vai para a vitrine
  const voltar = () => (location.key !== 'default' ? navigate(-1) : navigate('/'))

  const i = imovel.dados
  const { valor, sufixo } = i ? valorDoImovel(i) : {}
  const status = i ? infoStatus(i.status) : null
  const endereco = i && [i.endereco, i.numero && `nº ${i.numero}`, i.complemento].filter(Boolean).join(', ')

  return (
    <section>
      <button onClick={voltar} className="mb-4 text-sm font-medium text-azul hover:underline">← Voltar para a vitrine</button>

      {imovel.carregando && <Carregando />}
      {imovel.erro && (
        <ErroMensagem
          erro={imovel.erro.status === 404 ? { message: 'Imóvel não encontrado. Ele pode ter sido removido.' } : imovel.erro}
          onTentarDeNovo={imovel.erro.status === 404 ? undefined : imovel.recarregar}
        />
      )}

      {i && (
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Galeria fotos={fotos.dados} imovelId={i.id} titulo={i.titulo} />

            <h1 className="mt-6 font-display text-3xl font-bold text-marinho">{i.titulo}</h1>
            <p className="mt-1 text-tinta/70">
              {i.tipoImovel?.nome ?? 'Imóvel'} · {i.bairro?.nome ?? '—'}
              {i.bairro?.cidade ? `, ${i.bairro.cidade}` : ''}
              {i.bairro?.estado ? ` - ${i.bairro.estado}` : ''}
            </p>

            {i.descricao && <p className="mt-5 leading-relaxed text-tinta/80">{i.descricao}</p>}

            <h2 className="mb-3 mt-8 font-display text-xl font-bold">Detalhes</h2>
            <dl className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              <Item rotulo="Dormitórios" valor={i.dormitorios} />
              <Item rotulo="Banheiros" valor={i.banheiros} />
              <Item rotulo="Vagas de garagem" valor={i.garagem} />
              <Item rotulo="Área total" valor={i.areaTotal != null ? `${Number(i.areaTotal)} m²` : null} />
              <Item rotulo="Área construída" valor={i.areaConstruida ? `${Number(i.areaConstruida)} m²` : null} />
            </dl>

            {(endereco || i.cep) && (
              <>
                <h2 className="mb-2 mt-8 font-display text-xl font-bold">Localização</h2>
                <p className="text-tinta/80">{endereco}{i.cep ? ` — CEP ${i.cep}` : ''}</p>
              </>
            )}

            {i.caracteristicas && (
              <>
                <h2 className="mb-2 mt-8 font-display text-xl font-bold">Características</h2>
                <p className="text-tinta/80">{i.caracteristicas}</p>
              </>
            )}
          </div>

          <aside className="lg:col-span-1">
            <div className="sticky top-6 rounded-xl border border-bruma bg-white p-5 shadow-sm">
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-azul px-3 py-0.5 text-xs font-bold uppercase tracking-wide text-white">{rotuloFinalidade(i.finalidade)}</span>
                <span className={`rounded-full px-3 py-0.5 text-xs font-bold ${status.cor}`}>{status.rotulo}</span>
              </div>
              <p className="mt-4 font-display text-3xl font-bold text-azul">
                {moeda(valor)}<span className="text-base font-normal text-tinta/60">{sufixo}</span>
              </p>

              <button onClick={() => setContatoAberto(true)} className="mt-5 block w-full rounded-md bg-ciano py-2.5 text-center font-medium text-white hover:opacity-90">
                Entrar em contato
              </button>
              <p className="mt-2 text-center text-xs text-tinta/50">Envie um e-mail à imobiliária com os dados do imóvel já preenchidos.</p>
              {/* Próximo checkpoint: botão "Fazer oferta" (só para cliente logado e imóvel disponível) */}
            </div>
          </aside>
        </div>
      )}
      {contatoAberto && i && <ContatoModal imovel={i} contato={montarContato(i, EMAIL_IMOBILIARIA)} onFechar={() => setContatoAberto(false)} />}
    </section>
  )
}
