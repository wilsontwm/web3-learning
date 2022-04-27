import "../styles/globals.css";
import "react-toastify/dist/ReactToastify.css";
import type { AppProps } from "next/app";
import { Provider } from "react-redux";
import { store } from "../store/store";
import { Web3ReactProvider, Web3ReactHooks } from "@web3-react/core";
import { CoinbaseWallet } from "@web3-react/coinbase-wallet";
import { MetaMask } from "@web3-react/metamask";
import { WalletConnect } from "@web3-react/walletconnect";
import {
  coinbaseWallet,
  hooks as coinbaseWalletHooks,
} from "../connectors/coinbase-wallet";
import { hooks as metaMaskHooks, metaMask } from "../connectors/metamask";
import {
  hooks as walletConnectHooks,
  walletConnect,
} from "../connectors/walletconnect";
import { ToastContainer } from "react-toastify";

const connectors: [
  MetaMask | WalletConnect | CoinbaseWallet,
  Web3ReactHooks
][] = [
  [metaMask, metaMaskHooks],
  [walletConnect, walletConnectHooks],
  [coinbaseWallet, coinbaseWalletHooks],
];

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <Web3ReactProvider connectors={connectors}>
        <Component {...pageProps} />
        <ToastContainer />
      </Web3ReactProvider>
    </Provider>
  );
}

export default MyApp;
