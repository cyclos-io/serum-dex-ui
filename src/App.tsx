import React, { Suspense } from 'react';
import './App.less';
import { ConnectionProvider } from './utils/connection';
import { WalletProvider } from './utils/wallet';
import { GlobalStyle } from './global_style';
import { Spin } from 'antd';
import ErrorBoundary from './components/ErrorBoundary';
import { Routes } from './routes';
import { PreferencesProvider } from './utils/preferences';
import { ReferrerProvider } from './utils/referrer';

import { WalletKitProvider } from '@gokiprotocol/walletkit';

export default function App() {
  return (
    <Suspense fallback={() => <Spin size="large" />}>
      <GlobalStyle />
      <ErrorBoundary>
        <ConnectionProvider>
          <ReferrerProvider>
            <WalletKitProvider
              app={{ name: 'Cyclos-dex' }}
              networkConfigs={{
                'mainnet-beta': {
                  name: 'Custom RPC',
                  endpoint:
                    'https://dawn-red-log.solana-mainnet.quiknode.pro/ff88020a7deb8e7d855ad7c5125f489ef1e9db71/',
                },
              }}
              commitment="processed"
              onConnect={() => {}}
              onDisconnect={() => {}}
              onError={() => {}}
            >
              <WalletProvider>
                <PreferencesProvider>
                  <Suspense fallback={() => <Spin size="large" />}>
                    <Routes />
                  </Suspense>
                </PreferencesProvider>
              </WalletProvider>
            </WalletKitProvider>
          </ReferrerProvider>
        </ConnectionProvider>
      </ErrorBoundary>
    </Suspense>
  );
}
