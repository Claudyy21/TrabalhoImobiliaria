import { Link } from 'react-router-dom'

const Caixa = ({ titulo, texto }) => (
  <div className="py-16 text-center">
    <h1 className="font-display text-3xl font-bold">{titulo}</h1>
    <p className="mt-2 text-tinta/70">{texto}</p>
    <Link to="/" className="mt-6 inline-block rounded-md bg-azul px-4 py-2 text-white">Voltar ao início</Link>
  </div>
)

export const AcessoNegado = () => <Caixa titulo="Acesso negado" texto="Você não tem permissão para ver esta página." />
export const NaoEncontrado = () => <Caixa titulo="Página não encontrada" texto="O endereço que você digitou não existe." />
