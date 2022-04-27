import type { NextPage } from "next";
import { useAppSelector, useAppDispatch } from "../store/store";
import { activate, activating, deactivate } from "../store/reducers/authSlice";
import { metaMask } from "../connectors/metamask";
import { coinbaseWallet } from "../connectors/coinbase-wallet";
import { walletConnect } from "../connectors/walletconnect";
import CoinbaseWalletLogin from "../components/auth/coinbaseWalletLogin";
import MetaMaskLogin from "../components/auth/metamaskLogin";
import { Avatar } from "../components/auth/avatar";
import { Transaction } from "../components/transaction/transaction";
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
        coinbaseWallet.deactivate();
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
    <div className="h-full flex">
      <div className="hidden lg:block relative w-0 flex-1">
        <img
          className="absolute inset-0 h-screen w-full object-cover"
          src="https://images.unsplash.com/photo-1650974727239-95f762d98e1a?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80"
          alt=""
        />
      </div>
      <div className="flex-1 flex flex-col justify-center py-16 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="mt-24 text-center text-3xl font-extrabold text-primary-600">
            Welcome to Simple Token
          </h2>
        </div>
        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          {currentAddress && (
            <>
              <Avatar />
              <hr className="my-2" />
              <Transaction />
            </>
          )}
          {!currentAddress && (
            <div className="bg-white py-8 px-4 sm:px-10">
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
    </div>
  );
};

export default Home;
