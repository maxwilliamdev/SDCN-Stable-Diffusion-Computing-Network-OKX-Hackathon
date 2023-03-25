class Persist {
  setAccessToken(address: string, token: string) {
    localStorage.setItem(`ACCESS_TOKEN_${address}`, token)
  }

  getAccessToken(address: string): string | null {
    return localStorage.getItem(`ACCESS_TOKEN_${address}`)
  }

  removeAccessToken(address: string) {
    localStorage.removeItem(`ACCESS_TOKEN_${address}`)
  }
}

const persist = new Persist()

export default persist
