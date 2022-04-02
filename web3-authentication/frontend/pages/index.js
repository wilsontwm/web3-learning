import { useEffect, useState, useRef } from "react";
import { injected, walletconnect, walletlink, activateInjectedProvider } from "./../utils/wallet_connector";
import { useWeb3React } from "@web3-react/core";
import { LogoutIcon } from "@heroicons/react/outline";
import http from "../utils/http";

export default function Home() {
  const { active, account, library, connector, activate, deactivate } = useWeb3React();
  const form = useRef();
  const [token, setToken] = useState(null);
  const [currentAddress, setAddress] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(async () => {
    if (account) {
      authenticateWallet(account);
    } else {
      setToken(null);
    }
  }, [account]);

  const connectWallet = async (connector) => {
    try {
      await activate(connector);
    } catch (e) {
      console.log("Error:", e);
    }
  };

  const getNonce = async (account) => {
    const response = await http.POST("/v1/generate-nonce", {
      publicAddress: account,
    });

    if (response) {
      return response.item;
    }

    return "";
  };

  const authenticateWallet = async (account) => {
    try {
      setIsLoading(true);
      const nonce = await getNonce(account);
      if (!nonce) {
        disconnectWallet();
        return;
      }

      var from = account;
      var params = [nonce, from];
      var method = "personal_sign";
      const provider = await connector.getProvider();
      const signResponse = await provider.request({ method, params, from });
      const verifyResponse = await http.POST("/v1/verify-signature", {
        publicAddress: from,
        signature: signResponse,
      });

      if (verifyResponse && verifyResponse.token) {
        setToken(verifyResponse.token);
        setAddress(verifyResponse.address);
      }
    } catch (e) {
      console.log("Error", e);
      disconnectWallet();
    } finally {
      setIsLoading(false);
    }
  };

  const disconnectWallet = async () => {
    setToken(null);
    setAddress(null);
    deactivate();
  };

  return (
    <div className="min-h-full flex flex-col justify-center py-24 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Login to your account</h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {isLoading && <h4 className="mt-3 text-center text-md text-gray-400">Loading</h4>}
          {!isLoading && token && (
            <>
              <h4 className="mt-3 text-center text-md text-gray-400">Hi, {currentAddress}</h4>
              <button
                onClick={() => disconnectWallet()}
                className="w-full flex justify-center mt-3 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-primary-600 hover:text-white hover:bg-primary-500 border-primary-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                <LogoutIcon className="w-6 h-6 mr-2" aria-hidden="true" />
                <div>Disconnect</div>
              </button>
            </>
          )}
          {!isLoading && !token && (
            <>
              <button
                onClick={() => {
                  activateInjectedProvider(); // To select metamask
                  connectWallet(injected);
                }}
                className="w-full flex justify-center mt-3 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-primary-600 hover:text-white hover:bg-primary-500 border-primary-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                <img src="/img/wallet/mm.png" className="w-6 h-6 mr-2" />
                <div>Login with Metamask</div>
              </button>
              <button
                onClick={() => connectWallet(walletlink)}
                className="w-full flex justify-center mt-3 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-primary-600 hover:text-white hover:bg-primary-500 border-primary-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                <img src="/img/wallet/cbw.png" className="w-6 h-6 mr-2" />
                <div>Login with Coinbase Wallet</div>
              </button>
              <button
                onClick={() => connectWallet(walletconnect)}
                className="w-full flex justify-center mt-3 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-primary-600 hover:text-white hover:bg-primary-500 border-primary-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                <img src="/img/wallet/wc.png" className="w-6 h-6 mr-2" />
                <div>Login with Wallet Connect</div>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
