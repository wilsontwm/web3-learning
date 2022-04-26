import type { NextPage } from "next";
import { useAppSelector, useAppDispatch } from "../store/store";
import { activate, activating, deactivate } from "../store/reducers/authSlice";
import { LogoutIcon } from "@heroicons/react/outline";
import { metaMask } from "../connectors/metamask";
import { coinbaseWallet } from "../connectors/coinbase-wallet";
import { walletConnect } from "../connectors/walletconnect";
import CoinbaseWalletLogin from "../components/auth/coinbaseWalletLogin";
import MetaMaskLogin from "../components/auth/metamaskLogin";
// import WalletConnectLogin from "../components/auth/walletConnectLogin";

const Home: NextPage = () => {
  const dispatch = useAppDispatch();
  const currentAddress: string = useAppSelector(
    (state) => state.auth.currentAddress
  );
  const connectorType: string = useAppSelector(
    (state) => state.auth.connectorType
  );

  const setIsActivating = (isActivating: boolean) => {
    dispatch(activating(isActivating));
  };

  const loginAccount = (currentAddress: string, connectorType: string) => {
    dispatch(
      activate({
        currentAddress,
        connectorType,
      })
    );
  };

  const logoutAccount = async () => {
    switch (connectorType) {
      case metaMask.constructor.name:
        await metaMask.deactivate();
        break;
      case coinbaseWallet.constructor.name:
        await coinbaseWallet.deactivate();
        break;
      case walletConnect.constructor.name:
        await walletConnect.deactivate();
        break;
      default:
        return;
    }
    dispatch(deactivate());
  };

  return (
    <div className="min-h-full flex flex-col justify-center py-24 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-primary-600">
          Welcome to Simple Token
        </h2>
      </div>
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        {currentAddress && (
          <>
            <h4 className="mt-3 text-center text-md text-gray-400">
              Hi, {currentAddress}
            </h4>
            <button
              onClick={logoutAccount}
              className="w-full flex justify-center mt-3 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-primary-600 hover:text-white hover:bg-primary-500 border-primary-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <LogoutIcon className="w-6 h-6 mr-2" aria-hidden="true" />
              <div>Disconnect</div>
            </button>
          </>
        )}
        {!currentAddress && (
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <MetaMaskLogin
              setIsActivating={setIsActivating}
              activate={loginAccount}
              deactivate={logoutAccount}
            />
            <CoinbaseWalletLogin
              setIsActivating={setIsActivating}
              activate={loginAccount}
              deactivate={logoutAccount}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
