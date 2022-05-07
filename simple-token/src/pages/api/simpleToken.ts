import { ethers } from "ethers";
import SimpleTokenContract from "../../../artifacts/contracts/SimpleToken.sol/SimpleToken.json";
import { showNotification } from "../../utils/toast";

export interface TopupBalanceResponse {
  error?: string;
  hash?: string;
}

export interface WithdrawBalanceResponse {
  error?: string;
  hash?: string;
}

export interface TransferBalanceResponse {
  error?: string;
  hash?: string;
}

export async function getBalance(): Promise<number> {
  try {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();

    const simpleToken = new ethers.Contract(
      process.env.CONTRACT_ADDRESS,
      SimpleTokenContract.abi,
      signer
    );
    const getBalanceResponse = await simpleToken.connect(signer).getBalance();

    return parseFloat(ethers.utils.formatEther(getBalanceResponse));
  } catch (e) {
    showNotification((e as Error).message, "error");
  }
  return 0;
}

export async function topupBalance(payload: {
  amount: number;
}): Promise<TopupBalanceResponse> {
  try {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const simpleToken = new ethers.Contract(
      process.env.CONTRACT_ADDRESS,
      SimpleTokenContract.abi,
      signer
    );

    const amount = ethers.utils.parseUnits(payload.amount.toString(), "ether");

    const topupResponse = await simpleToken.connect(signer).topup({
      value: amount,
    });
    showNotification("Topup successful!", "success");
    return { hash: topupResponse.hash };
  } catch (e) {
    const error = (e as Error).message;
    showNotification(error, "error");
    return { error: error };
  }
}

export async function withdrawBalance(payload: {
  amount: number;
}): Promise<WithdrawBalanceResponse> {
  try {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const simpleToken = new ethers.Contract(
      process.env.CONTRACT_ADDRESS,
      SimpleTokenContract.abi,
      signer
    );

    const amount = ethers.utils.parseUnits(payload.amount.toString(), "ether");

    const withdrawResponse = await simpleToken.connect(signer).withdraw(amount);

    showNotification("Withdraw successful!", "success");
    return { hash: withdrawResponse.hash };
  } catch (e) {
    const error = (e as Error).message;
    showNotification(error, "error");
    return { error: error };
  }
}

export async function transferBalance(payload: {
  address: string;
  amount: number;
}): Promise<TransferBalanceResponse> {
  try {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const simpleToken = new ethers.Contract(
      process.env.CONTRACT_ADDRESS,
      SimpleTokenContract.abi,
      signer
    );

    const amount = ethers.utils.parseUnits(payload.amount.toString(), "ether");

    const transferResponse = await simpleToken
      .connect(signer)
      .send(payload.address, amount);
    showNotification("Transfer successful!", "success");
    return { hash: transferResponse.hash };
  } catch (e) {
    const error = (e as Error).message;
    showNotification(error, "error");
    return { error: error };
  }
}
