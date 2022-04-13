## Deploy smart contract with Truffle

1. Install truffle (refer https://trufflesuite.com/)
   ```sh
   yarn global add truffle
   ```
2. Initialize a truffle project
   ```sh
   truffle init
   ```
3. Install HDWalletProvider (wallet provider that signs the transaction before sending to public node)
   ```sh
   yarn add @truffle/hdwallet-provider
   ```
4. Write your migration script (example as shown in /migrations folder)
5. Update the configuration in truffle-config.js by specifying the network as well as the account to deploy the smart contract.
6. Deploy to the mainnet/testnet via:
   ```sh
   truffle deploy --network <network_name>
   ```
