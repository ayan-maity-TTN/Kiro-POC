import { useState } from 'react'

export function usePagination(initialPage = 0, initialSize = 10) {
  const [page, setPage]   = useState(initialPage)
  const [size, setSize]   = useState(initialSize)
  const [sort, setSort]   = useState('id')
  const [order, setOrder] = useState('asc')

  const nextPage = () => setPage((p) => p + 1)
  const prevPage = () => setPage((p) => Math.max(0, p - 1))
  const goToPage = (p) => setPage(p)
  const reset    = () => { setPage(0) }

  return { page, size, sort, order, setPage, setSize, setSort, setOrder, nextPage, prevPage, goToPage, reset }
}
