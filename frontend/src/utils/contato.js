import { moeda, valorDoImovel } from './format.js'

// Monta o e-mail de interesse: assunto e corpo com código, tipo, bairro e valor do imóvel
export function montarContato(imovel, para) {
  const { valor, sufixo } = valorDoImovel(imovel)
  const tipo = imovel.tipoImovel?.nome ?? 'Imóvel'
  const bairro = imovel.bairro?.nome ?? '—'
  const assunto = `Interesse no imóvel #${imovel.id} — ${tipo} em ${bairro}`
  const linhas = [
    'Olá! Tenho interesse neste imóvel:',
    '',
    `Código: ${imovel.id}`,
    `Tipo: ${tipo}`,
    `Bairro: ${bairro}`,
    `Valor: ${moeda(valor)}${sufixo}`,
    '',
    'Gostaria de mais informações e de agendar uma visita.',
  ]
  const enc = encodeURIComponent
  return {
    para,
    assunto,
    corpo: linhas.join('\n'),
    // Cada opção abre o e-mail já escrito. Gmail/Outlook funcionam direto no navegador.
    links: {
      gmail: `https://mail.google.com/mail/?view=cm&fs=1&to=${enc(para)}&su=${enc(assunto)}&body=${enc(linhas.join('\n'))}`,
      outlook: `https://outlook.live.com/mail/0/deeplink/compose?to=${enc(para)}&subject=${enc(assunto)}&body=${enc(linhas.join('\n'))}`,
      mailto: `mailto:${para}?subject=${enc(assunto)}&body=${enc(linhas.join('\r\n'))}`,
    },
  }
}
