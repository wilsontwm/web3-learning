import { useEffect } from "react";
import { useAppSelector, useAppDispatch } from "../../store/store";
import { useWeb3React } from "@web3-react/core";
import { deactivate } from "../../store/reducers/authSlice";
import { getBalance } from "../../store/reducers/walletSlice";
import { CashIcon, DuplicateIcon, LogoutIcon } from "@heroicons/react/outline";
import { showNotification } from "../../utils/toast";

export function Avatar() {
  const { connector } = useWeb3React();
  const dispatch = useAppDispatch();
  const currentAddress: string = useAppSelector(
    (state) => state.auth.currentAddress
  );
  const balance: number = useAppSelector((state) => state.wallet.balance);

  useEffect(() => {
    refreshBalance();
  }, [currentAddress]);

  const refreshBalance = async () => {
    if (currentAddress) {
      await dispatch(getBalance());
    }
  };

  const copyAddressToClipboard = () => {
    navigator.clipboard.writeText(currentAddress);
    showNotification("Address copied!", "success");
  };

  const logoutAccount = async () => {
    await connector.deactivate();
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
              {balance}
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
