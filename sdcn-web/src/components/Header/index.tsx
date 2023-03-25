import React from 'react'
import { Avatar, Button, Image, Popover } from 'antd'
import githubIcon from 'statics/images/icon_github.svg'
import logo from 'statics/images/logo.svg'
import cx from 'classnames'
import { Link, NavLink } from 'react-router-dom'
import styles from './index.module.css'
import LoginModal from 'components/LoginModal'
import userStore from 'stores/userStore'
import { observer } from 'mobx-react-lite'
import { LogoutOutlined } from '@ant-design/icons'
import defaultAvatar from 'statics/images/default-avatar.svg'
import uiStore from 'stores/ui'
import persist from 'stores/persist'

const Header = () => {
  const onLogoutClicked = () => {
    persist.removeAccessToken(userStore.walletAddress)
    userStore.reset()
    console.log('logout', userStore)
  }

  return (
    <div className={cx('sticky top-0', styles.wrap)}>
      <div
        className={cx(
          'flex justify-between items-center gap-x-6',
          styles.contentWrap,
        )}
      >
        <div className={cx(styles.left)}>
          <Link to={'/'}>
            <Image src={logo} width={120} preview={false} />
          </Link>
        </div>
        <nav className={cx('grow flex items-center gap-x-1')}>
          <NavLink
            to={'/play'}
            className={({ isActive }) =>
              isActive ? cx(styles.navLinkActive) : cx(styles.navLink)
            }
          >
            Playground
          </NavLink>
          <NavLink
            to={'/nodes'}
            className={({ isActive }) =>
              isActive ? cx(styles.navLinkActive) : cx(styles.navLink)
            }
          >
            Nodes
          </NavLink>
          <NavLink to={'/#faq'} className={cx(styles.navLink)}>
            FAQ
          </NavLink>
        </nav>
        <div className={cx('flex items-center gap-x-6', styles.right)}>
          <Button
            type='ghost'
            shape='circle'
            href={process.env.REACT_APP_GITHUB_URL}
            target='_blank'
            className={cx('flex justify-center items-center')}
          >
            <Image src={githubIcon} width={28} preview={false} />
          </Button>
          {userStore.isLoggedIn ? (
            <Popover
              content={
                <Button
                  type='text'
                  icon={<LogoutOutlined />}
                  onClick={onLogoutClicked}
                >
                  Logout
                </Button>
              }
              placement='bottomRight'
            >
              <Avatar src={userStore.userInfo.avatarImgUrl || defaultAvatar} />
            </Popover>
          ) : (
            <Button
              type='primary'
              onClick={() => {
                uiStore.shouldShowConnectWalletModal = true
              }}
            >
              Sign in
            </Button>
          )}
        </div>
      </div>
      <LoginModal
        open={uiStore.shouldShowConnectWalletModal}
        onClose={() => {
          uiStore.shouldShowConnectWalletModal = false
        }}
        onConnect={async () => {
          uiStore.shouldShowConnectWalletModal = false
        }}
      />
    </div>
  )
}

export default observer(Header)
