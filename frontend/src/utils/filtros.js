import { ehAluguel, ehVenda, valorDoImovel } from './format.js'

// Só imóveis disponíveis aparecem na vitrine (reservado/alugado/vendido ficam de fora)
export const indisponivel = (i) => /^(reserv|alugad|vendid)/i.test((i.status ?? '').trim())

export const FILTROS_VAZIOS = { bairro: '', finalidade: '', min: '', max: '', ordem: '' }

export function filtrar(lista, f) {
  const min = f.min === '' ? null : Number(f.min)
  const max = f.max === '' ? null : Number(f.max)
  return lista.filter((i) => {
    if (indisponivel(i)) return false
    if (f.bairro && String(i.bairro?.id) !== String(f.bairro)) return false
    if (f.finalidade === 'venda' && !ehVenda(i.finalidade)) return false
    if (f.finalidade === 'aluguel' && !ehAluguel(i.finalidade)) return false
    const { valor } = valorDoImovel(i)
    if (min != null && (valor == null || Number(valor) < min)) return false
    if (max != null && (valor == null || Number(valor) > max)) return false
    return true
  })
}

// ordem: 'menor' (preço crescente) | 'maior' (decrescente) | '' (ordem original da API)
export function ordenar(lista, ordem) {
  if (ordem !== 'menor' && ordem !== 'maior') return lista
  const dir = ordem === 'menor' ? 1 : -1
  return [...lista].sort((a, b) => {
    const va = valorDoImovel(a).valor
    const vb = valorDoImovel(b).valor
    if (va == null && vb == null) return 0
    if (va == null) return 1 // sem preço vai para o fim, em qualquer sentido
    if (vb == null) return -1
    return (Number(va) - Number(vb)) * dir
  })
}

// Bairros que realmente têm imóveis na lista, sem repetir, em ordem alfabética
export function bairrosDaLista(lista) {
  const mapa = new Map()
  lista.forEach((i) => i.bairro?.id != null && mapa.set(i.bairro.id, i.bairro))
  return [...mapa.values()].sort((a, b) => (a.nome ?? '').localeCompare(b.nome ?? '', 'pt-BR'))
}

export function validarFaixa(min, max) {
  if ((min !== '' && Number(min) < 0) || (max !== '' && Number(max) < 0)) return 'Os valores não podem ser negativos.'
  if (min !== '' && max !== '' && Number(min) > Number(max)) return 'O valor mínimo não pode ser maior que o máximo.'
  return null
}
