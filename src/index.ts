function reCalc(
  data: number[],
  days: number,
  callback: (data: number[]) => number,
) {
  const ret = []
  for (let i = data.length - 1; i > days - 2; i--) {
    ret.unshift(callback(data.slice(i - days + 1, i + 1)))
  }
  return ret
}

export function ref(data: number[], days: number) {
  return data.slice(0, data.length - days)
}

export function ma(data: number[], days: number) {
  return reCalc(
    data,
    days,
    (data) => data.reduce((pre, cur) => pre + cur) / days,
  )
}

export function sma(data: number[], days: number, weight: number) {
  const ret = [data[0]]
  for (let i = 1; i < data.length; i++)
    ret.push((data[i] * weight + ret[i - 1] * (days - weight)) / days)
  return ret
}

export function ema(data: number[], days: number) {
  return sma(data, days + 1, 2)
}

export function std(data: number[], days: number) {
  return reCalc(data, days, (data) => {
    return Math.sqrt(
      data
        .map((val) => Math.pow(val - ma(data, days)[0], 2))
        .reduce((pre, cur) => pre + cur) /
        (days - 1),
    )
  })
}

export function llv(data: number[], days: number) {
  return reCalc(data, days, (data) => Math.min.apply(null, data))
}

export function hhv(data: number[], days: number) {
  return reCalc(data, days, (data) => Math.max.apply(null, data))
}

export function aveDev(data: number[], days: number) {
  return reCalc(data, days, (data) => {
    return (
      data
        .map((v) => Math.abs(v - ma(data, days)[0]))
        .reduce((pre, cur) => pre + cur) / days
    )
  })
}

export function slope(data: number[], days: number) {
  const sumX = days * (days - 1) * 0.5
  const sumXSqr = (days * (days - 1) * (2 * days - 1)) / 6
  const divisor = sumX * sumX - days * sumXSqr
  const len = days - 1
  return reCalc(data, days, (data) => {
    let sumY = 0
    let sumXY = 0
    for (let i = len; i >= 0; i--) {
      sumY += data[len - i]
      sumXY += i * data[len - i]
    }
    return (days * sumXY - sumX * sumY) / divisor
  })
}

export function cross(line1: number[], line2: number[]) {
  const ret = []
  const minLen = Math.min(line1.length, line2.length)
  line1 = line1.slice(line1.length - minLen)
  line2 = line2.slice(line2.length - minLen)
  for (let i = 1; i < minLen; i++)
    ret.push(line1[i] > line2[i] && line1[i - 1] <= line2[i - 1])
  return ret
}
