import { useCallback, useEffect, useState } from 'react'

// Padrão de toda tela que busca dados: carregando / erro / dados
export function useFetch(fn, deps = []) {
  const [dados, setDados] = useState(null)
  const [erro, setErro] = useState(null)
  const [carregando, setCarregando] = useState(true)

  const carregar = useCallback(() => {
    let cancelado = false
    setCarregando(true)
    setErro(null)
    fn()
      .then((d) => !cancelado && setDados(d))
      .catch((e) => !cancelado && setErro(e))
      .finally(() => !cancelado && setCarregando(false))
    return () => { cancelado = true }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  useEffect(() => carregar(), [carregar])
  return { dados, erro, carregando, recarregar: carregar }
}
