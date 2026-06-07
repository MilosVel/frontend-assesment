import { lazy } from 'react'

import { ContentLayout } from '@/components/layout/content-layout'

const BillsPage = lazy(() => import('@/pages/bills-page'))

function App() {

  return (
    <ContentLayout title='Bills'>
      <BillsPage />
    </ContentLayout>
  )
}

export default App
