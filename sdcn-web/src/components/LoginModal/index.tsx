import React, { Fragment, useCallback, useState } from 'react'
import { Modal, Image, Button, message } from 'antd'
import to from 'await-to-js'
import cx from 'classnames'
import logo from 'statics/images/logo.svg'
import { ReactComponent as okxIcon } from 'statics/images/okx.svg'
import Icon from '@ant-design/icons'
import ProcessingMask from 'components/ProcessingMask'
import persist from 'stores/persist'
import userStore from 'stores/userStore'
import { wallet } from 'wallets/wallet'

interface Props {
  open: boolean
  onClose: () => void
  onConnect: () => void
}
const LoginModal = (props: Props) => {
  const { open, onClose, onConnect } = props
  const [isConnecting, setIsConnecting] = useState(false)

  const handleClickConnect = useCallback(async () => {
    setIsConnecting(true)

    console.log('wallet', wallet, wallet.isExtensionInstalled())

    if (wallet.isExtensionInstalled() === false) {
      message.warning('Please install okxWallet plugin first')
      setIsConnecting(false)
      onClose()
      return
    }

    const [ethRequestAccountsError, as] = await to(wallet.ethRequestAccounts())
    console.log('ethRequestAccounts result', ethRequestAccountsError, as)
    if (ethRequestAccountsError !== null) {
      setIsConnecting(false)
      onClose()
      return
    }

    const [ethAccountsError, accounts] = await to(wallet.ethAccounts())
    if (ethAccountsError !== null) {
      setIsConnecting(false)
      onClose()
      return
    }

    const address = accounts[0]
    /*
    const nonce = nanoid()
    const signMsg = `Welcome to SDCN!\n\nClick to sign in and accept the SDCN Terms of Service.\n\nThis request will not trigger a blockchain transaction or cost any gas fees.\n\nWallet address:\n${address}\n\nNonce:\n${nonce}`
    const [personalSignError, signature] = await to(
      wallet.personalSign(signMsg, address),
    )
    if (personalSignError !== null) {
      setIsConnecting(false)
      onClose()
      return
    }
    const [loginError, accessToken] = await to<string, AxiosError>(
      userApi.login(signMsg, signature, address),
    )
    console.log('login result', loginError, accessToken)
    if (loginError !== null) {
      onClose()
      message.error(`登录失败（${loginError.response?.status ?? 'unknown'}）`)
      return
    }
    */

    persist.setAccessToken(address, address)
    userStore.updateUserInfo({
      userId: address,
      nickname: `USER#${address}`,
    })
    userStore.walletAddress = address
    userStore.isLoggedIn = true

    message.success('SUCCESS')

    setIsConnecting(false)
    onConnect()
  }, [onClose, onConnect])

  return (
    <Fragment>
      <Modal
        open={open && !isConnecting}
        keyboard={false}
        maskClosable={true}
        onCancel={onClose}
        footer={null}
        centered={true}
      >
        <div
          className={cx('flex flex-col justify-center')}
          style={{ height: '254px' }}
        >
          <div className={cx('flex')}>
            <div className={cx('grow flex justify-center')}>
              <Image src={logo} width={200} preview={false} />
            </div>
            <div className={cx('grow flex flex-col justify-center gap-3')}>
              <Button type='default' size='large' onClick={handleClickConnect}>
                <Icon component={okxIcon} />
                Connect with okxWallet
              </Button>
            </div>
          </div>
        </div>
      </Modal>
      <ProcessingMask open={isConnecting} text='Processing...' />
    </Fragment>
  )
}

export default LoginModal
