import { BigNumberish, ethers } from 'ethers'
import { wallet } from 'wallets/wallet'
import { Erc20Abi__factory } from 'typings/Erc20Abi'
import { TransactionReceipt } from '@ethersproject/providers'

const contractAddress = '0xf93ddfc544927fd55a1bea06c412723266d232c0'

export async function transferTokens(
  to: string,
  amount: BigNumberish,
): Promise<TransactionReceipt> {
  const signer = await wallet.getSigner()
  const provider = wallet.getProvider()

  const contractInstance = Erc20Abi__factory.connect(contractAddress, signer)

  const options = {
    gasLimit: '200000',
    gasPrice: ethers.utils.parseUnits('10', 'gwei'),
  }
  await contractInstance.connect(signer)
  const tx = await contractInstance.transfer(to, amount, options)
  console.log('DAN token Transaction sent:', tx.hash)

  await tx.wait()

  const receipt = await provider.getTransactionReceipt(tx.hash)
  if (receipt.status === 1) {
    console.log('Transaction succeeded!')
  } else {
    console.error('Transaction failed:', receipt)
  }
  return receipt
}
