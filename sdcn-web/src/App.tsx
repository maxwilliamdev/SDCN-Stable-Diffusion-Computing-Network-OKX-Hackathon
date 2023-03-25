import React, { useEffect, useRef } from 'react'
import to from 'await-to-js'
import cx from 'classnames'
import { Navigate, Route, Routes } from 'react-router-dom'
import { wallet, WalletVendor } from 'wallets/wallet'

import 'antd/dist/reset.css'
import 'App.css'

import Footer from 'components/Footer'
import Header from 'components/Header'
import Nodes from 'pages/Nodes'
import Playground from 'pages/Playground'
import Portal from 'pages/Portal'
import { createPromiseReadyUtil } from 'utils/promiseReadyUtil'
import persist from 'stores/persist'
import userStore from 'stores/userStore'
import uiStore from 'stores/ui'

function App() {
  const appInitPromiseUtil = useRef(createPromiseReadyUtil())

  useEffect(() => {
    const handleWalletAccountsChanged = (accounts: string[]) => {
      if (accounts.length === 0) {
        userStore.reset()
        uiStore.reset()
      }
    }

    wallet.on('accountsChanged', handleWalletAccountsChanged)

    return () => {
      wallet.off('accountsChanged', handleWalletAccountsChanged)
    }
  }, [])

  useEffect(() => {
    const walletTasks = async () => {
      const installed = wallet.isExtensionInstalled()
      console.log('installed', installed)
      if (installed === false) {
        appInitPromiseUtil.current.resolve()
        return
      }

      const [initWalletError] = await to(wallet.init(WalletVendor.OKXWALLET))
      console.log('initWalletError', initWalletError)
      if (initWalletError !== null) {
        appInitPromiseUtil.current.resolve()
        return
      }

      const accounts = await wallet.ethAccounts()
      console.log('accounts', accounts)
      if (accounts.length === 0) {
        appInitPromiseUtil.current.resolve()
        return
      }

      const address = accounts[0]
      if (persist.getAccessToken(address) !== address) {
        appInitPromiseUtil.current.resolve()
        return
      }
      userStore.walletAddress = address
      userStore.isLoggedIn = true

      appInitPromiseUtil.current.resolve()
    }

    walletTasks()
  }, [])

  return (
    <div className={cx('App min-h-full w-full flex flex-col')}>
      <Header />
      <Routes>
        <Route path='/' element={<Portal />} />
        <Route path='/play' element={<Playground />} />
        <Route path='/nodes' element={<Nodes />} />
        <Route path='*' element={<Navigate replace to='/' />} />
      </Routes>
      <Footer />
    </div>
  )
}

export default App
