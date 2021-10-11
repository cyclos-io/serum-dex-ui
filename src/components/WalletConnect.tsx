import React from 'react';
import { Button, Menu } from 'antd';
import { useWallet } from '../utils/wallet';

import { useWalletKit } from '@gokiprotocol/walletkit';

export default function WalletConnect() {

  const { disconnect, connected } = useWallet();
  const { connect } = useWalletKit();

  return connected ? (
    <Button onClick={disconnect}> Disconnect </Button>
  ) : (
    <Button onClick={connect}> Connect </Button>
  );
}
