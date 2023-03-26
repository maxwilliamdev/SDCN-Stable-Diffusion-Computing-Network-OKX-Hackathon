import React from 'react'
import { Button, Image } from 'antd'
import cx from 'classnames'

import styles from './index.module.css'

import githubIcon from 'statics/images/icon_github.svg'

const Footer = () => {
  return (
    <div className={cx('mt-auto', styles.wrap)}>
      <div
        className={cx('flex justify-between items-center', styles.contentWrap)}
      >
        <div className={cx(styles.left)}>
          Copyright ©2023 Decentralized AIGC Network. All rights reserved.
        </div>

        <div className={cx(styles.right)}>
          <Button
            type='ghost'
            shape='circle'
            href={process.env.REACT_APP_GITHUB_URL}
            target='_blank'
            className={cx('flex justify-center items-center')}
          >
            <Image src={githubIcon} width={24} preview={false} />
          </Button>
        </div>
      </div>
    </div>
  )
}

export default Footer
