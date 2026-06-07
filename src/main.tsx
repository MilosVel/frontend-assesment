import { StrictMode, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import App from '@/App'
import { AppProvider } from '@/app-provider'
import CircularProgress from '@mui/material/CircularProgress'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppProvider>
      <Suspense fallback={<CircularProgress />}>
        <App />
      </Suspense>
    </AppProvider>
  </StrictMode>,
)
