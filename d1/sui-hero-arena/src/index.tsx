import React from 'react'
import ReactDOM from 'react-dom/client'
import { createSuiClient } from '@mysten/sui/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { SuiClientProvider, WalletProvider } from '@mysten/dapp-kit'
import '@mysten/dapp-kit/dist/index.css'
import App from './App'
import './index.css'

const queryClient = new QueryClient()
const suiClient = createSuiClient({ url: 'https://fullnode.testnet.sui.io:443' })

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <SuiClientProvider defaultClient={suiClient}>
        <WalletProvider>
          <App />
        </WalletProvider>
      </SuiClientProvider>
    </QueryClientProvider>
  </React.StrictMode>,
)
