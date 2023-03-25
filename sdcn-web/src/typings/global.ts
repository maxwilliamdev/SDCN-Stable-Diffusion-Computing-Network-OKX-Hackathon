import { Eip1193Provider } from 'ethers/types/providers'

declare global {
  interface Window {
    ethereum: Eip1193Provider & {
      isMetaMask: boolean
    },
    okexchain: Eip1193Provider & {
      isOkxWallet:boolean
    }
  }
}