import axios from 'axios'

const apiHost = process.env.REACT_APP_WEB_API_HOST || ''

export interface RequestFundsResponse {
  code: number
  message: string
  txHash: string
}

export async function requestFunds(
  address: string,
  msg: string,
  sign: string,
): Promise<RequestFundsResponse> {
  return new Promise((resolve, reject) => {
    axios
      .post<RequestFundsResponse>(
        `${apiHost}/faucet?publicAddress=${address}&msg=${msg}&sign=${sign}`,
        {
          'Access-Control-Allow-Credentials': 'true',
        },
      )
      .then((res) => {
        resolve(res.data)
      })
      .catch((error) => {
        reject(error)
      })
  })
}
