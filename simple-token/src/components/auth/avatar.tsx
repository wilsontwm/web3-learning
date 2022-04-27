import { useAppSelector, useAppDispatch } from "../../store/store";
import { deactivate } from "../../store/reducers/authSlice";
import { metaMask } from "../../connectors/metamask";
import { coinbaseWallet } from "../../connectors/coinbase-wallet";
import { walletConnect } from "../../connectors/walletconnect";
import { CashIcon, DuplicateIcon, LogoutIcon } from "@heroicons/react/outline";
import { showNotification } from "../../utils/toast";

export function Avatar() {
  const dispatch = useAppDispatch();
  const currentAddress: string = useAppSelector(
    (state) => state.auth.currentAddress
  );
  const connectorType: string = useAppSelector(
    (state) => state.auth.connectorType
  );

  const refreshBalance = () => {};

  const copyAddressToClipboard = () => {
    navigator.clipboard.writeText(currentAddress);
    showNotification("Address copied!", "success");
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
    <div className="flex-shrink-0 group block">
      <div className="flex items-center">
        <div>
          <img
            className="inline-block h-9 w-9 rounded-full"
            src="https://picsum.photos/200"
            alt=""
          />
        </div>
        <div className="ml-3">
          <div className="text-sm font-medium text-gray-700 group-hover:text-gray-900 w-80 truncate">
            {currentAddress}
          </div>
          <div>
            <button
              className="ml-2 mt-2 text-xs background-transparent inline-flex hover:text-primary-600"
              onClick={refreshBalance}
            >
              <CashIcon className="w-4 h-4 mr-1" aria-hidden="true" />
              0.00025
            </button>
            <button
              className="ml-2 mt-2 text-xs background-transparent inline-flex hover:text-primary-600"
              onClick={copyAddressToClipboard}
            >
              <DuplicateIcon className="w-4 h-4 mr-1" aria-hidden="true" /> Copy
              my address
            </button>
            <button
              className="ml-2 mt-2 text-xs background-transparent inline-flex hover:text-primary-600"
              onClick={logoutAccount}
            >
              <LogoutIcon className="w-4 h-4 mr-1" aria-hidden="true" /> Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
