import { useEffect } from "react";
import { hooks, metaMask } from "../../connectors/metamask";
import { AuthButton } from "./authButton";
import { ethers } from "ethers";

const {
  useChainId,
  useAccounts,
  useError,
  useIsActivating,
  useIsActive,
  useProvider,
  // useENSNames,
} = hooks;

interface MetaMaskLoginProps {
  setIsActivating: (isActivating: boolean) => void;
  activate: (currentAddress: string, connectorType: string) => void;
  deactivate: () => void;
}

export default function MetaMaskLogin(props: MetaMaskLoginProps) {
  const chainId = useChainId();
  const accounts = useAccounts();
  const error = useError();
  const isActivating = useIsActivating();

  const isActive = useIsActive();

  const provider = useProvider();
  // const ENSNames = useENSNames(provider);

  useEffect(() => {
    props.setIsActivating(isActivating);
  }, [isActivating]);

  useEffect(() => {
    if (isActive) {
      props.activate(accounts[0], metaMask.constructor.name);
    } else {
      props.deactivate();
    }
  }, [isActive, accounts, error]);

  return (
    <AuthButton
      accounts={accounts}
      connector={metaMask}
      chainId={chainId}
      isActivating={isActivating}
      error={error}
      isActive={isActive}
    />
  );
}
