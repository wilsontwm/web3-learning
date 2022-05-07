import type { Web3ReactHooks } from "@web3-react/core";
import { CoinbaseWallet } from "@web3-react/coinbase-wallet";
import { MetaMask } from "@web3-react/metamask";
import { WalletConnect } from "@web3-react/walletconnect";
import { useEffect, useState } from "react";
import { useAppSelector } from "../../store/store";
import { CHAINS, getAddChainParameters, URLS } from "../../utils/chains";

export function AuthButton({
  accounts,
  connector,
  chainId,
  isActivating,
  error,
  isActive,
}: {
  accounts: ReturnType<Web3ReactHooks["useAccounts"]>;
  connector: MetaMask | WalletConnect | CoinbaseWallet;
  chainId: ReturnType<Web3ReactHooks["useChainId"]>;
  isActivating: ReturnType<Web3ReactHooks["useIsActivating"]>;
  error: ReturnType<Web3ReactHooks["useError"]>;
  isActive: ReturnType<Web3ReactHooks["useIsActive"]>;
}) {
  const isWalletActivating: boolean = useAppSelector(
    (state) => state.auth.isActivating
  );
  const chainIds = Object.keys(CHAINS).map((chainId) => Number(chainId));
  const [desiredChainId, setDesiredChainId] = useState<number>(-1);
  const [walletLogo, setWalletLogo] = useState<string>("");
  const [walletName, setWalletName] = useState<string>("");

  useEffect(() => {
    switch (connector.constructor) {
      case MetaMask:
        setWalletLogo("/img/wallet/mm.png");
        setWalletName("MetaMask");
        break;
      case WalletConnect:
        setWalletLogo("/img/wallet/wc.png");
        setWalletName("WalletConnect");
        break;
      case CoinbaseWallet:
        setWalletLogo("/img/wallet/cbw.png");
        setWalletName("Coinbase Wallet");
        break;
      default:
        setWalletLogo("");
    }
  }, [connector]);

  const activateWallet = async () => {
    if (isActivating) return;

    if (connector instanceof WalletConnect) {
      await connector.activate(
        desiredChainId === -1 ? undefined : desiredChainId
      );
    } else {
      await connector.activate(
        desiredChainId === -1
          ? undefined
          : getAddChainParameters(desiredChainId)
      );
    }
  };

  if (accounts?.length > 0) {
    return null;
  } else {
    return (
      <button
        onClick={activateWallet}
        disabled={isActivating || isWalletActivating}
        className="w-full flex justify-center mt-3 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-primary-600 hover:text-white hover:bg-primary-500 border-primary-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
      >
        {walletLogo ? (
          <img src={walletLogo} className="w-6 h-6 mr-2" />
        ) : undefined}
        <div>Login with {walletName}</div>
      </button>
    );
  }
}
