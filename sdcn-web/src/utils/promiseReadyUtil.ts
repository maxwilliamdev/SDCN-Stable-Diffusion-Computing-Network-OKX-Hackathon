/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */
// @ts-nocheck

export interface PromiseReadyUtil {
    promise: Promise<any>
    resolve: (...args: any[]) => void
    reject: (error?: Error) => void
  }
  
  export function createPromiseReadyUtil(): PromiseReadyUtil {
    const result: PromiseReadyUtil = {
      promise: undefined,
      resolve: undefined,
      reject: undefined,
    }
  
    const promise = new Promise<any>((resolve, reject) => {
      result.resolve = resolve
      result.reject = reject
    })
    result.promise = promise
  
    return result
  }