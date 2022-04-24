const { expect } = require("chai");
const {
  expectRevert, // Assertions for transactions that should fail
} = require("@openzeppelin/test-helpers");

const SimpleToken = artifacts.require("SimpleToken.sol");

contract("SimpleToken", (accounts) => {
  let owner;
  let addr1;
  let addr2;
  let addr3;
  let addr4;
  let addrs;
  let simpleToken;

  // `beforeEach` will run before each test, re-deploying the contract every
  // time. It receives a callback, which can be async.
  beforeEach(async () => {
    [owner, addr1, addr2, addr3, addr4, ...addrs] = accounts;
    simpleToken = await SimpleToken.deployed();
  });

  describe("Initialization", () => {
    it("Should set the owner and the supply to minter's address", async () => {
      expect(owner).to.equal(await simpleToken.owner());
    });
  });

  describe("Transaction", function () {
    it("Should topup 100 tokens successfully and reflect in the balance", async function () {
      const amount = 100;
      const resp = await simpleToken.topup({ value: amount, from: addr1 });
      const addr1Balance = await simpleToken.getBalance({ from: addr1 });
      expect(amount).to.equal(addr1Balance.toNumber());
      let eventName = resp.logs[0].event;
      let eventRes = resp.logs[0].args;
      expect("Topup").to.equal(eventName);
      expect(addr1).to.equal(eventRes[0]);
      expect(amount).to.equal(eventRes[1].toNumber());
    });

    it("Should send 200 tokens successfully and reflect in the sender's and receiver's balance", async function () {
      const amount = 200;
      // Topup the amount into the address 2 first
      await simpleToken.topup({ value: amount, from: addr2 });
      // Transfer the amount to address 3
      const resp = await simpleToken.send(addr3, amount, {
        from: addr2,
      });
      const addr2Balance = await simpleToken.getBalance({ from: addr2 });
      expect(0).to.equal(addr2Balance.toNumber());
      const addr3Balance = await simpleToken.getBalance({ from: addr3 });
      expect(amount).to.equal(addr3Balance.toNumber());
      let eventName = resp.logs[0].event;
      let eventRes = resp.logs[0].args;
      expect("Sent").to.equal(eventName);
      expect(addr2).to.equal(eventRes[0]);
      expect(addr3).to.equal(eventRes[1]);
      expect(amount).to.equal(eventRes[2].toNumber());
    });

    it("Should fail to send 200 tokens due to insufficient fund in the balance", async () => {
      const amount = 200;
      // Transfer the amount from address 2
      const func = simpleToken.send(addr3, amount, { from: addr2 });
      await expectRevert(func, "Insufficient balance");
    });

    it("Should withdraw 8 eth successfully and reflect in the user's eth balance", async function () {
      const amount = web3.utils.toBN(web3.utils.toWei("9", "ether"));
      const withdrawAmount = web3.utils.toBN(web3.utils.toWei("8", "ether"));
      await simpleToken.topup({ value: amount, from: addr4 });

      const initialUserAccountBalance = web3.utils.toBN(
        await web3.eth.getBalance(addr4)
      );
      const withdrawTrx = await simpleToken.withdraw(withdrawAmount, {
        from: addr4,
      });
      // Get the withdrawal receipt to calculate the gas cost
      const withdrawReceipt = await web3.eth.getTransactionReceipt(
        withdrawTrx.receipt.transactionHash
      );
      const finalUserAccountBalance = web3.utils.toBN(
        await web3.eth.getBalance(addr4)
      );

      const addr4Balance = await simpleToken.getBalance({ from: addr4 });
      expect(web3.utils.fromWei(amount.sub(withdrawAmount))).to.equal(
        web3.utils.fromWei(addr4Balance)
      );
      const totalGasCost = web3.utils
        .toBN(withdrawReceipt.gasUsed)
        .mul(web3.utils.toBN(withdrawReceipt.effectiveGasPrice));

      expect(web3.utils.fromWei(withdrawAmount)).to.equal(
        web3.utils.fromWei(
          finalUserAccountBalance
            .sub(initialUserAccountBalance)
            .add(totalGasCost)
        )
      );

      let eventName = withdrawTrx.logs[0].event;
      let eventRes = withdrawTrx.logs[0].args;
      expect("Withdrew").to.equal(eventName);
      expect(addr4).to.equal(eventRes[0]);
      expect(web3.utils.fromWei(withdrawAmount)).to.equal(
        web3.utils.fromWei(eventRes[1])
      );
    });

    it("Should fail to withdraw 200 tokens due to insufficient fund in the balance", async function () {
      const amount = 200;
      const func = simpleToken.withdraw(amount, { from: addr2 });
      await expectRevert(func, "Insufficient balance");
    });
  });
});
