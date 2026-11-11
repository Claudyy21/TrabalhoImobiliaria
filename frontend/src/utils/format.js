export const moeda = (v) =>
  v == null ? '—' : Number(v).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

const norm = (s) => (s ?? '').toString().trim().toLowerCase()

export const ehAluguel = (f) => norm(f).startsWith('alug')
export const ehVenda = (f) => norm(f).startsWith('vend')

// Valor principal do card conforme a finalidade
export function valorDoImovel(i) {
  if (ehAluguel(i.finalidade)) return { valor: i.precoAluguel, sufixo: '/mês' }
  if (ehVenda(i.finalidade)) return { valor: i.precoVenda, sufixo: '' }
  return { valor: i.precoVenda ?? i.precoAluguel, sufixo: '' }
}

export const rotuloFinalidade = (f) => (ehAluguel(f) ? 'Aluguel' : ehVenda(f) ? 'Venda' : f || '—')

const STATUS = {
  dispon: { rotulo: 'Disponível', cor: 'bg-emerald-100 text-emerald-800' },
  reserv: { rotulo: 'Reservado', cor: 'bg-amber-100 text-amber-800' },
  alugad: { rotulo: 'Alugado', cor: 'bg-slate-200 text-slate-700' },
  vendid: { rotulo: 'Vendido', cor: 'bg-slate-200 text-slate-700' },
}
export function infoStatus(status) {
  const chave = Object.keys(STATUS).find((k) => norm(status).startsWith(k))
  return chave ? STATUS[chave] : { rotulo: status || '—', cor: 'bg-slate-100 text-slate-700' }
}
