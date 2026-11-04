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
