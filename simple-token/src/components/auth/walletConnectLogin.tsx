import { useEffect } from "react";
import { hooks, walletConnect } from "../../connectors/walletconnect";
import { AuthButton } from "./authButton";

const {
  useChainId,
  useAccounts,
  useError,
  useIsActivating,
  useIsActive,
  useProvider,
  useENSNames,
} = hooks;

interface WalletConnectLoginProps {
  setIsActivating: (isActivating: boolean) => void;
  activate: (currentAddress: string, connectorType: string) => void;
  deactivate: () => void;
}

export default function WalletConnectLogin(props: WalletConnectLoginProps) {
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
    if (accounts?.length > 0) {
      props.activate(accounts[0], walletConnect.constructor.name);
    } else {
      props.deactivate();
    }
  }, [isActive, accounts, error]);

  return (
    <AuthButton
      accounts={accounts}
      connector={walletConnect}
      chainId={chainId}
      isActivating={isActivating}
      error={error}
      isActive={isActive}
    />
  );
}
