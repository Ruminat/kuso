const genArray = (length, fn) => Array.from({ length }, (_, i) => fn(i))

function fractionalPart (num) {
  const abs = Math.abs(num)
  const sign = Math.sign(num)
  return sign * (abs - Math.trunc(abs))
}

export const min = arr => arr.reduce((p, v) => p < v ? p : v)
export const max = arr => arr.reduce((p, v) => p > v ? p : v)
export const sum = arr => arr.reduce((a, b) => a + b)
export const average = arr => sum(arr) / arr.length
export const variance = arr => {
  const avg = average(arr)
  return (1 / arr.length) * arr.reduce((a, b) => a + (b - avg)**2, 0)
}
export const std = arr => Math.sqrt(variance(arr))
export const squareAvg = arr => arr.reduce((a, b) => a + b**2, 0)
export const asymmetry = arr => {
  const avg = average(arr)
  return arr.reduce((a, b) => a + (b - avg)**3)
}
export const asymmetryK = arr => asymmetry(arr) / std(arr)**3
export const excess = arr => {
  const avg = average(arr)
  return arr.reduce((a, b) => a + (b - avg)**4)
}
export const excessK = arr => asymmetry(arr) / std(arr)**4 - 3

export const getStatistics = arr => ({
  min: min(arr),
  max: max(arr),
  sum: sum(arr),
  avg: average(arr),
  variance: variance(arr),
  std: std(arr),
  squareAvg: squareAvg(arr),
  asymmetry: asymmetry(arr),
  asymmetryK: asymmetryK(arr),
  excess: excess(arr),
  excessK: excessK(arr)
})

export function splitIntoParts (array, n) {
  const [...arr] = array
  const result = []
  const l = Math.ceil(arr.length / n)
  while (arr.length)
    result.push(arr.splice(0, l))
  return result
}

const crazy = x => Math.sin(x + Math.cos(x*x) + Math.sin(4*x))
const smash = x => crazy(1 + 4*crazy(1 + x)) - 8*crazy(2*x)
const getSign = x => x % 2 === 0 ? -1 : 1

let calls = 0
export function random (from = 0, to = 1) {
  const ms = Number(new Date())
  const m = smash(ms)
  const c = smash(calls++)
  return from + (to - from) * (fractionalPart((m + c)) + 1) / 2
}

export function randomInt (from, to) {
  return Math.round(random(from - 0.5, to + 0.5))
  // return Math.round((from - 0.5) + (to - from + 1) * Math.random())
}

// const n = 4
// const nums = genArray(n, _ => 0)

// for (let c = 0; c < 10E5; c++) {
//   const r = randomInt(0, n - 1)
//   // console.log(Math.abs(randomInt(0, n - 1)))
//   nums[r]++
// }

// console.log(`${n} numbers, avg = ${average(nums)}, var = ${std(nums)}`)
// console.log(nums)

// const n = 10000
// // const nums = genArray(n, _ => random(0, 100))
// const nums = genArray(n, _ => Math.random() * 100)
// console.log(`Statistics:`)
// console.log(`n = ${n}`)
// console.log(`sum = ${sum(nums)}`)
// console.log(`avg = ${average(nums)}`)
// console.log(`variance = ${variance(nums)}`)
// console.log(`std = ${std(nums)}`)
// console.log(`std = ${std(nums)}`)
// console.log(`squareAvg = ${squareAvg(nums)}`)
// console.log(`asymmetry = ${asymmetry(nums)}`)
// console.log(`asymmetryK = ${asymmetryK(nums)}`)
// console.log(`excess = ${excess(nums)}`)
// console.log(`excessK = ${excessK(nums)}`)
