/**
 * `setTimeout` with promise
 * created for async await
 * @param {number} delay
 */

export default (delay) => new Promise(resolve => setTimeout(resolve, delay))
