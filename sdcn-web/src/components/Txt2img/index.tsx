import React, { useState } from 'react'
import cx from 'classnames'
import { Form, Select, Button, Input, Typography, FormInstance } from 'antd'
import {
  ModelFormGroup,
  LoraFormGroup,
  SamplingFormGroup,
} from 'components/SettingsFormGroup'
import { txt2img, txt2imgParams } from 'api/txt2img'
import ImageWidget from 'components/ImageWidget'
import { FormFinishInfo } from 'rc-field-form/es/FormContext'
import ProcessingMask from 'components/ProcessingMask'
import { observer } from 'mobx-react-lite'
import uiStore from 'stores/ui'
import userStore from 'stores/userStore'
import { ReactComponent as sdcnWhiteIcon } from 'statics/images/sdcn-white.svg'

import styles from './index.module.css'
import Icon from '@ant-design/icons'

const { Title } = Typography
const { TextArea } = Input

function InputAndGenerateArea({
  form,
  onButtonClicked,
}: {
  form: FormInstance<null>
  onButtonClicked: () => void
}) {
  return (
    <div className={cx('flex flex-col items-start gap-6')}>
      <Title level={5}>Input keyword and generate</Title>
      <div className={cx('flex flex-col w-full items-start gap-6')}>
        <Form form={form} name='txt2imgPromptForm' style={{ width: '100%' }}>
          <Form.Item
            name='prompt'
            className={cx('self-stretch')}
            style={{ marginBottom: '0px' }}
          >
            <TextArea
              size='large'
              rows={6}
              placeholder='Enter prompts here'
              className={cx('text-base leading-6 px-4 py-2')}
            />
          </Form.Item>
        </Form>
        <Button type='primary' onClick={onButtonClicked} size='large'>
          <div className={cx('flex items-center gap-x-1')}>
            Generate (-5
            <Icon component={sdcnWhiteIcon} style={{ fontSize: '20px' }} />)
          </div>
        </Button>
      </div>
    </div>
  )
}

const sizes = [
  { value: '512x512', label: '512x512' },
  { value: '512x768', label: '512x768' },
  { value: '768x512', label: '768x512' },
]

function SettingsArea({ form }: { form: FormInstance<null> }) {
  return (
    <div className={cx('flex flex-col w-80 gap-6 bg-green-000')}>
      <Title level={5}>Settings</Title>
      <Form form={form} name='txt2imgSettingsForm' layout='vertical'>
        <ModelFormGroup label='Model' name='model' />

        <Form.Item label='Size' name='size' initialValue={sizes[0].value}>
          <Select size='large' options={sizes} />
        </Form.Item>

        <LoraFormGroup label='LoRA1' loraName='lora1' weightName='weight1' />
        <LoraFormGroup label='LoRA2' loraName='lora2' weightName='weight2' />

        <Form.Item label='Negative Prompts' name='negative_prompt'>
          <TextArea
            size='large'
            rows={4}
            placeholder='Negative Prompts'
            className={cx('self-stretch text-base leading-6 px-4 py-2')}
          />
        </Form.Item>

        <SamplingFormGroup
          methodName='sampling_method'
          stepsName='steps'
          seedName='seed'
        />
      </Form>
    </div>
  )
}

const Txt2img = () => {
  const [SettingsForm] = Form.useForm()
  const [PromptForm] = Form.useForm()

  const [imgUri, setImgUri] = useState<string | undefined>()
  const [imgLoading, setImgLoading] = useState<boolean>(false)

  const onLoginButtonClicked = () => {
    uiStore.shouldShowConnectWalletModal = true
  }

  const onGenerationButtonClicked = () => {
    // First form submit
    SettingsForm.submit()
    // Second form submit
    PromptForm.submit()
  }

  // For merging form data
  let apiParams: txt2imgParams

  const onFormSubmit = (name: string, { values }: FormFinishInfo) => {
    if (name === 'txt2imgSettingsForm') {
      // Received data in first submit, partial data
      const [widthStr, heightStr] = values.size.split('x')
      delete values.size
      apiParams = Object.assign(values)
      apiParams.width = parseInt(widthStr)
      apiParams.height = parseInt(heightStr)
      apiParams.cfg_scale = 7
      console.log('first submit', apiParams)
    }
    if (name === 'txt2imgPromptForm') {
      // Received data in second submit, full data
      apiParams = Object.assign(apiParams, values)
      console.log('second submit, merged', apiParams)
      ;(async () => {
        setImgLoading(true)
        setImgUri(await txt2img(apiParams))
        setImgLoading(false)
      })()
    }
  }

  return (
    /* when Form submitted, the parent Form.Provider received the submittion via onFormFinish */
    <Form.Provider onFormFinish={onFormSubmit}>
      <ProcessingMask open={imgLoading} text='Generating...' />
      <div
        className={cx(
          styles.wrap,
          'flex flex-col md:flex-row w-full bg-yellow-000 gap-24 mt-8',
        )}
      >
        <div className={cx('flex flex-col flex-1 bg-red-000')}>
          <InputAndGenerateArea
            onButtonClicked={
              userStore.isLoggedIn
                ? onGenerationButtonClicked
                : onLoginButtonClicked
            }
            form={PromptForm}
          />
          <ImageWidget src={imgUri} />
        </div>
        <SettingsArea form={SettingsForm} />
      </div>
    </Form.Provider>
  )
}

export default observer(Txt2img)
