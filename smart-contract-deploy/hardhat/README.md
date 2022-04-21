## Deploy smart contract with Hardhat

1. Install hardhat via https://hardhat.org/
2. Initialize a hardhat project
   ```sh
   npx hardhat
   ```
3. Write your deploy script (example as shown in /scripts folder)
4. Update the configuration in hardhat.config.js by specifying the network as well as the account to deploy the smart contract.
5. Deploy to the mainnet/testnet via:
   ```sh
   npx hardhat run scripts/deploy.js --network <network_name>
   ```

## Test the smart contract

```sh
npx hardhat test
```
