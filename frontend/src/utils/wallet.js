/* global BigInt */

// Wallet connection utilities for MetaMask (Ethereum/Polygon) and Phantom (Solana)

export async function connectMetaMask() {
  if (typeof window.ethereum === 'undefined') {
    throw new Error('MetaMask is not installed. Please install MetaMask extension.');
  }

  try {
    const accounts = await window.ethereum.request({
      method: 'eth_requestAccounts',
    });

    if (!accounts || accounts.length === 0) {
      throw new Error('No accounts found');
    }

    const chainId = await window.ethereum.request({
      method: 'eth_chainId',
    });

    return {
      address: accounts[0],
      chainId,
      provider: 'metamask',
    };
  } catch (err) {
    throw new Error(err.message || 'Failed to connect MetaMask');
  }
}

export async function connectPhantom() {
  if (typeof window.solana === 'undefined') {
    throw new Error('Phantom is not installed. Please install Phantom extension.');
  }

  try {
    const resp = await window.solana.connect();
    return {
      address: resp.publicKey.toString(),
      chainId: 'solana',
      provider: 'phantom',
    };
  } catch (err) {
    throw new Error(err.message || 'Failed to connect Phantom');
  }
}

export async function connectWallet(preferredProvider = null) {
  if (
    preferredProvider === 'phantom' ||
    (!preferredProvider && typeof window.solana !== 'undefined')
  ) {
    try {
      return await connectPhantom();
    } catch (err) {
      if (preferredProvider === 'phantom') throw err;
    }
  }

  if (
    preferredProvider === 'metamask' ||
    (!preferredProvider && typeof window.ethereum !== 'undefined')
  ) {
    try {
      return await connectMetaMask();
    } catch (err) {
      throw err;
    }
  }

  throw new Error('No wallet found. Please install MetaMask or Phantom.');
}

// Platform fee payment (simplified – production should use smart contracts)
export async function payPlatformFee(walletInfo, amount = '0.01') {
  const { address, provider } = walletInfo;

  if (provider === 'metamask') {
    // Convert ETH amount to wei (hex)
    const weiAmount = BigInt(
      Math.floor(parseFloat(amount) * 1e18)
    ).toString(16);

    const adminAddress =
      process.env.REACT_APP_ADMIN_WALLET ||
      '0x742d35Cc6634C0532925a3b844Bc9e7595f3Ae92';

    try {
      const txHash = await window.ethereum.request({
        method: 'eth_sendTransaction',
        params: [
          {
            from: address,
            to: adminAddress,
            value: `0x${weiAmount}`,
            gas: '0x5208', // 21000
          },
        ],
      });

      await waitForTransaction(txHash);
      return txHash;
    } catch (err) {
      throw new Error(err.message || 'Transaction failed');
    }
  }

  if (provider === 'phantom') {
    throw new Error('Solana payment not implemented. Use MetaMask for now.');
  }

  throw new Error('Unsupported wallet provider');
}

async function waitForTransaction(txHash) {
  return new Promise((resolve, reject) => {
    const interval = setInterval(async () => {
      try {
        const receipt = await window.ethereum.request({
          method: 'eth_getTransactionReceipt',
          params: [txHash],
        });

        if (receipt) {
          clearInterval(interval);
          if (receipt.status === '0x1') {
            resolve(receipt);
          } else {
            reject(new Error('Transaction failed'));
          }
        }
      } catch (err) {
        clearInterval(interval);
        reject(err);
      }
    }, 2000);

    setTimeout(() => {
      clearInterval(interval);
      reject(new Error('Transaction timeout'));
    }, 120000);
  });
}
