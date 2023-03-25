import EventEmitter from 'events'
import { ethers, Signer } from 'ethers'
import { Web3Provider, ExternalProvider } from '@ethersproject/providers'

interface WalletEvents {
  accountsChanged: (accounts: string[]) => void
}

export enum WalletVendor {
  DEFAULT = 'default',
  METAMASK = 'metamask',
  OKXWALLET = 'okxWallet',
}

function getVendorProvider(vendor: WalletVendor): ExternalProvider {
  return vendor === WalletVendor.OKXWALLET ? window.okexchain : window.ethereum
}

WalletVendor.DEFAULT
declare interface WalletWrapper {
  on<U extends keyof WalletEvents>(event: U, cb: WalletEvents[U]): this
  off<U extends keyof WalletEvents>(event: U, cb: WalletEvents[U]): this
  emit<U extends keyof WalletEvents>(
    event: U,
    ...args: Parameters<WalletEvents[U]>
  ): boolean
}

class WalletWrapper extends EventEmitter {
  private vendor: WalletVendor = WalletVendor.DEFAULT
  private provider: Web3Provider | undefined

  private signer: Signer | undefined

  isMetaMaskInstalled = (): boolean => {
    return window.ethereum?.isMetaMask === true
  }

  isOkxWalletInstalled = (): boolean => {
    return window.okexchain?.isOkxWallet === true
  }

  isExtensionInstalled: () => boolean = this.isMetaMaskInstalled

  init = async (vendor: WalletVendor) => {
    this.vendor = vendor ?? WalletVendor.DEFAULT

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    getVendorProvider(this.vendor).on(
      'accountsChanged',
      (accounts: string[]) => {
        this.emit('accountsChanged', accounts)
      },
    )
  }

  getProvider = (): Web3Provider => {
    this.provider =
      this.provider ??
      new ethers.providers.Web3Provider(getVendorProvider(this.vendor))
    return this.provider
  }

  getSigner = async (): Promise<Signer> => {
    const provider = this.getProvider()
    this.signer = this.signer ?? (await provider.getSigner())
    return this.signer
  }

  ethAccounts = async (): Promise<string[]> =>
    new Promise((resolve, reject) => {
      if (this.isExtensionInstalled() === false) {
        reject(new Error(`${this.vendor} not installed`))
        return
      }

      const provider = this.getProvider()
      provider
        .send('eth_accounts', [])
        .then((result) => {
          resolve(result)
        })
        .catch((e) => {
          reject(new Error(e))
        })
    })

  ethRequestAccounts = async (): Promise<string[]> =>
    new Promise((resolve, reject) => {
      if (this.isExtensionInstalled() === false) {
        reject(new Error(`${this.vendor} not installed`))
        return
      }

      const provider = this.getProvider()
      provider
        .send('eth_requestAccounts', [])
        .then((result) => {
          resolve(result)
        })
        .catch((e) => {
          reject(new Error(e))
        })
    })

  personalSign = async (msg: string, from: string): Promise<string> =>
    new Promise((resolve, reject) => {
      if (this.isExtensionInstalled() === false) {
        reject(new Error(`${this.vendor} not installed`))
        return
      }

      const provider = this.getProvider()
      provider
        .send('personal_sign', [msg, from])
        .then((result) => {
          resolve(result)
        })
        .catch((e) => {
          reject(new Error(e))
        })
    })

  sendTransaction = async (address: string, count: string): Promise<void> => {
    if (this.isExtensionInstalled() === false) {
      throw new Error(`${this.vendor} not installed`)
    }

    const signer = await this.getSigner()
    const tx = await signer.sendTransaction({
      to: address,
      value: count,
    })
    await tx.wait()
  }
}

export const wallet = new WalletWrapper()
