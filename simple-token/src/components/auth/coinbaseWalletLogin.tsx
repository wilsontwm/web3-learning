import { useEffect } from "react";
import { hooks, coinbaseWallet } from "../../connectors/coinbase-wallet";
import { AuthButton } from "./authButton";

const {
  useChainId,
  useAccounts,
  useError,
  useIsActivating,
  useIsActive,
  // useProvider,
  // useENSNames,
} = hooks;

interface CoinbaseWalletLoginProps {
  setIsActivating: (isActivating: boolean) => void;
  activate: (currentAddress: string, connectorType: string) => void;
  deactivate: () => void;
}

export default function CoinbaseWalletLogin(props: CoinbaseWalletLoginProps) {
  const chainId = useChainId();
  const accounts = useAccounts();
  const error = useError();
  const isActivating = useIsActivating();

  const isActive = useIsActive();

  // const provider = useProvider();
  // const ENSNames = useENSNames(provider);

  useEffect(() => {
    props.setIsActivating(isActivating);
  }, [isActivating]);

  useEffect(() => {
    if (isActive) {
      props.activate(accounts[0], coinbaseWallet.constructor.name);
    } else {
      props.deactivate();
    }
  }, [isActive, accounts, error]);

  return (
    <AuthButton
      accounts={accounts}
      connector={coinbaseWallet}
      chainId={chainId}
      isActivating={isActivating}
      error={error}
      isActive={isActive}
    />
  );
}
