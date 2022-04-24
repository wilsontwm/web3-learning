const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("SimpleToken", function () {
  let owner;
  let addr1;
  let addr2;
  let addrs;
  let SimpleToken;
  let simpleToken;

  // `beforeEach` will run before each test, re-deploying the contract every
  // time. It receives a callback, which can be async.
  beforeEach(async function () {
    SimpleToken = await ethers.getContractFactory("SimpleToken");
    [owner, addr1, addr2, ...addrs] = await ethers.getSigners();

    simpleToken = await SimpleToken.deploy();
  });

  describe("Initialization", function () {
    it("Should set the owner and the supply to minter's address and account balance", async function () {
      expect(await simpleToken.owner()).to.equal(owner.address);
      expect(await simpleToken.supply()).to.equal(await owner.getBalance());
    });
  });

  describe("Transaction", function () {
    it("Should topup 100 tokens successfully and reflect in the balance", async function () {
      const amount = 100;
      const resp = await simpleToken.connect(addr1).topup({ value: amount });
      const addr1Balance = await simpleToken.connect(addr1).getBalance();
      expect(addr1Balance).to.equal(amount);
      expect(resp)
        .to.emit(simpleToken, "Topup")
        .withArgs(addr1.address, amount);
    });

    it("Should send 200 tokens successfully and reflect in the sender's and receiver's balance", async function () {
      const amount = 200;
      // Topup the amount into the address 1 first
      await simpleToken.connect(addr1).topup({ value: amount });
      // Transfer the amount to address 2
      const resp = await simpleToken.connect(addr1).send(addr2.address, amount);
      const addr1Balance = await simpleToken.connect(addr1).getBalance();
      expect(addr1Balance).to.equal(0);
      const addr2Balance = await simpleToken.connect(addr2).getBalance();
      expect(addr2Balance).to.equal(amount);
      expect(resp)
        .to.emit(simpleToken, "Sent")
        .withArgs(addr1.address, addr2.address, amount);
    });

    it("Should fail to send 200 tokens due to insufficient fund in the balance", async function () {
      const amount = 200;
      const func = simpleToken.connect(addr1).send(addr2.address, amount);
      await expect(func).to.revertedWith("Insufficient balance");
    });

    it("Should withdraw 8 eth successfully and reflect in the user's eth balance", async function () {
      const amount = ethers.utils.parseEther("9.0");
      const withdrawAmount = ethers.utils.parseEther("8.0");
      await simpleToken.connect(addr1).topup({ value: amount });

      const initialUserAccountBalance = await addr1.getBalance();
      const withdrawTrx = await simpleToken
        .connect(addr1)
        .withdraw(withdrawAmount);
      // Get the withdrawal receipt to calculate the gas cost
      const withdrawReceipt = await ethers.provider.getTransactionReceipt(
        withdrawTrx.hash
      );
      const finalUserAccountBalance = await addr1.getBalance();

      const addr1Balance = await simpleToken.connect(addr1).getBalance();
      expect(addr1Balance).to.equal(amount.sub(withdrawAmount));
      const totalGasCost = withdrawReceipt.gasUsed.mul(
        withdrawReceipt.effectiveGasPrice
      );
      expect(withdrawAmount).to.equal(
        finalUserAccountBalance.sub(initialUserAccountBalance).add(totalGasCost)
      );
      expect(withdrawTrx)
        .to.emit(simpleToken, "Withdrew")
        .withArgs(addr1.address, withdrawAmount);
    });

    it("Should fail to withdraw 200 tokens due to insufficient fund in the balance", async function () {
      const amount = 200;
      const func = simpleToken.connect(addr1).withdraw(amount);
      await expect(func).to.revertedWith("Insufficient balance");
    });
  });
});
