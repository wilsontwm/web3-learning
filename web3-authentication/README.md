# Web3 Authentication

In this folder, it demonstrates how to authenticate users using Metamask, Coinbase Wallet, Wallet Connect etc. It consists of frontend (using React.js) and backend (using Go) servers which have to be run together.

## How It Works

![how it works](https://user-images.githubusercontent.com/49806519/162005890-06b79353-d2de-416c-8148-8dc3e753a276.jpg)

1. User connect to the selected crypto wallet
2. Frontend sends the public address of the wallet account to backend
3. Backend creates a new user account if not exists and generate nonce
4. The nonce is returned to the frontend
5. User signs the nonce and send the signature to backend
6. Backend verifies the signature and generate JWT token
7. JWT token is passed to the frontend
8. The JWT token is then added in the authorization header in the subsequent requests to backend

## References

1. [Metamask Documentation](https://docs.metamask.io/guide/#why-metamask)
2. [WalletConnect Documentation](https://docs.walletconnect.com/)
3. [Login tutorial using Metamask by Toptal](https://www.toptal.com/ethereum/one-click-login-flows-a-metamask-tutorial)
