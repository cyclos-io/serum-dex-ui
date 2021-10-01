import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import Wallet from '@project-serum/sol-wallet-adapter';
import { notify } from './notifications';
// import { useConnectionConfig } from './connection';
import { useLocalStorageState } from './utils';
import { WalletContextValues } from './types';
import { Button, Modal } from 'antd';
import {
  WalletAdapter,
  LedgerWalletAdapter,
  PhantomWalletAdapter,
  SolletExtensionAdapter,
  MathWalletAdapter,
  SolflareExtensionWalletAdapter,
} from '../wallet-adapters';

import {
  getPhantomWallet,
  getSolletWallet,
  getBitpieWallet,
  getBloctoWallet,
  getCoin98Wallet,
  getLedgerWallet,
  getMathWallet,
  getSafePalWallet,
  getSlopeWallet,
  getSolflareWallet,
  getSolflareWebWallet,
  getSolletExtensionWallet,
  getSolongWallet,
  // getTorusWallet,
} from '@solana/wallet-adapter-wallets';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import {
  ConnectionProvider,
  WalletProvider as NewWalletProvider,
  useWallet as newUseWallet,
} from '@solana/wallet-adapter-react';
import {
  WalletModalProvider,
} from '@solana/wallet-adapter-ant-design';

const ASSET_URL =
  'https://cdn.jsdelivr.net/gh/solana-labs/oyster@main/assets/wallets';
export const WALLET_PROVIDERS = [
  {
    name: 'sollet.io',
    url: 'https://www.sollet.io',
    icon: `${ASSET_URL}/sollet.svg`,
  },
  {
    name: 'Sollet Extension',
    url: 'https://www.sollet.io/extension',
    icon: `${ASSET_URL}/sollet.svg`,
    adapter: SolletExtensionAdapter as any,
  },
  {
    name: 'Ledger',
    url: 'https://www.ledger.com',
    icon: `${ASSET_URL}/ledger.svg`,
    adapter: LedgerWalletAdapter,
  },
  {
    name: 'Solflare',
    url: 'https://solflare.com/access-wallet',
    icon: `${ASSET_URL}/solflare.svg`,
  },
  {
    name: 'Solflare Extension',
    url: 'https://solflare.com',
    icon: `${ASSET_URL}/solflare.svg`,
    adapter: SolflareExtensionWalletAdapter,
  },
  {
    name: 'Phantom',
    url: 'https://www.phantom.app',
    icon: `https://www.phantom.app/img/logo.png`,
    adapter: PhantomWalletAdapter,
  },
  {
    name: 'MathWallet',
    url: 'https://www.mathwallet.org',
    icon: `${ASSET_URL}/mathwallet.svg`,
    adapter: MathWalletAdapter,
  },
];

const ENDPOINT_URL =
  'https://dawn-red-log.solana-mainnet.quiknode.pro/ff88020a7deb8e7d855ad7c5125f489ef1e9db71/';

const WalletContext = React.createContext<null | WalletContextValues>(null);

export function WalletProvider(props) {
  const wallets = useMemo(
    () => [
      getPhantomWallet(),
      getSolletWallet({ network: ENDPOINT_URL as WalletAdapterNetwork }),
      getCoin98Wallet(),
      getSolletExtensionWallet({
        network: ENDPOINT_URL as WalletAdapterNetwork,
      }),
      getLedgerWallet(),
      getBloctoWallet({ network: ENDPOINT_URL as WalletAdapterNetwork }),
      getMathWallet(),
      getSolflareWallet(),
      getSolflareWebWallet(),
      getSlopeWallet(),
      getBitpieWallet(),
      getSafePalWallet(),
      getSolongWallet(),
    ],
    [],
  );

  return (
    <>
      <ConnectionProvider endpoint={ENDPOINT_URL}>
        <NewWalletProvider
          wallets={wallets}
          autoConnect={true}
          onError={(error) => console.error(error)}
          localStorageKey="walletName"
        >
          <WalletModalProvider>
            <WalletInner {...props}>{props.children}</WalletInner>
          </WalletModalProvider>
        </NewWalletProvider>
      </ConnectionProvider>
    </>
  );
}

function WalletInner(props) {
  const newWallet = newUseWallet();

  useEffect(() => {
    if (newWallet.publicKey) {
      const walletPublicKey = newWallet.publicKey.toBase58();
      const keyToDisplay =
        walletPublicKey.length > 20
          ? `${walletPublicKey.substring(
            0,
            7,
          )}.....${walletPublicKey.substring(
            walletPublicKey.length - 7,
            walletPublicKey.length,
          )}`
          : walletPublicKey;

      notify({
        message: 'Wallet update',
        description: 'Connected to wallet ' + keyToDisplay,
      });
    }
    else {
      notify({
        message: 'Wallet update',
        description: 'Disconnected from wallet',
      });
    }
  }, [newWallet.connected]);

  return (
    <WalletContext.Provider
      value={{
        wallet: newWallet as any,
        connected: (newWallet.connected),
        providerName: newWallet?.wallet?.name || "",
        providerUrl: newWallet?.wallet?.url || ""
      }}
    >
      {props.children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('Missing wallet context');
  }
  const wallet = context.wallet;
  return {
    connected: context.connected,
    wallet: context.wallet,
    providerName: context.providerName,
    providerUrl: context.providerUrl
  };
}
