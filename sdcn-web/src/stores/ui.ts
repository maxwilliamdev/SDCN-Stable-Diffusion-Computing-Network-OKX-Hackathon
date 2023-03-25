import { makeAutoObservable } from 'mobx'

class UIStore {
  constructor() {
    makeAutoObservable(this)
  }

  private _shouldShowConnectWalletModal = false

  get shouldShowConnectWalletModal() {
    return this._shouldShowConnectWalletModal
  }

  set shouldShowConnectWalletModal(flag: boolean) {
    this._shouldShowConnectWalletModal = flag
  }

  reset() {
    this._shouldShowConnectWalletModal = false
  }
}

const uiStore = new UIStore()

export default uiStore
