import React, { useContext, useEffect } from 'react';
import { notify } from './notifications';

import {
  useSolana,
  useConnectedWallet,
  ConnectedWallet,
  WalletProviderInfo,
} from '@saberhq/use-solana';

interface NewWalletContextValues {
  wallet: ConnectedWallet | null;
  connected: boolean;
  walletProviderInfo: WalletProviderInfo | undefined;
  disconnect: () => void;
}
const WalletContext = React.createContext<null | NewWalletContextValues>(null);

export function WalletProvider({ children }) {
  const { connected, disconnect, walletProviderInfo } = useSolana();
  const wallet = useConnectedWallet();

  useEffect(() => {
    if (wallet?.publicKey) {
      localStorage.removeItem('feeDiscountKey');
      const walletPublicKey = wallet.publicKey.toBase58();
      const keyToDisplay =
        walletPublicKey.length > 20
          ? `${walletPublicKey.substring(0, 7)}.....${walletPublicKey.substring(
              walletPublicKey.length - 7,
              walletPublicKey.length,
            )}`
          : walletPublicKey;

      notify({
        message: 'Wallet update',
        description: 'Connected to wallet ' + keyToDisplay,
      });
    }
    wallet?.on('disconnect', () => {
      notify({
        message: 'Wallet update',
        description: 'Disconnected from wallet',
      });
      localStorage.removeItem('feeDiscountKey');
    });
  }, [wallet]);

  return (
    <WalletContext.Provider
      value={{
        wallet,
        connected,
        walletProviderInfo,
        disconnect,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('Missing wallet context');
  }
  return context;
}
