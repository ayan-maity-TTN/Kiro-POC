import { RouterProvider } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useEffect } from 'react'
import router from './routes'
import { selectTheme } from './store/slices/themeSlice'

export default function App() {
  const theme = useSelector(selectTheme)

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [theme])

  return <RouterProvider router={router} />
}
