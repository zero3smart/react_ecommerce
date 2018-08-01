/**
 * allow action creator with side effect (promise) to be cancelled
 * the idea is to prevent updating store if action is cancelled
 * this will only apply while using `thunk` middleware
 * @param {Object} action Promise
 */
export function createCancelableAsyncAction (action) {
  return (...promiseArgs) => dispatch => {
    let cancelPromise
    let racedPromise
    let requestStatus = {
      isCancelled: false
    }

    // dispatch action with additional `requestStatus` param
    // as an indicator whether the promise is cancelled
    dispatch(action(...promiseArgs, requestStatus))

    // fake promise to reject promise before original promise finished
    const cancelableRequest = new Promise((resolve, reject) => {
      cancelPromise = (reason) => {
        reject(reason || 'promise cancelled')
        // mutate request status, change cancelled to true
        requestStatus.isCancelled = true
        return racedPromise
      }
    })

    // get the first finished promise
    racedPromise = Promise.race([action, cancelableRequest])
    racedPromise.cancel = cancelPromise

    return racedPromise
  }
}
