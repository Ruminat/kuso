<template lang="pug">
.main.container(style="text-align: center")
  h2 Random
  div
    .plot#sin
    .plot#kek
  div
    .plot#corrMutual
  div
    .plot#corrMy
    .plot#corrJS
  div
    .plot#myRandomChart
    .plot#jsRandomChart
  div
    .plot#myRandomPlot
    .plot#jsRandomPlot

  //- h2 Parameters
  //- parameters

  //- h2 Plots
  //- plot
  //- plot
  //- br
  //- plot
  //- plot
</template>

<script>
import Plot from '@/components/Plot.vue'
import Parameters from '@/components/Parameters.vue'

import Plotly from 'plotly.js'

import { random, randomInt, getStatistics, splitIntoParts, average } from '@/modules/statistisc.js'
import { genArray } from '@/modules/utils.js'

export default {
  name: 'kuso',
  components: { Plot, Parameters },
  computed: {},
  mounted () {
    console.log('mounted')
    // Parameters
    const n = 10**5 // number of points
    const from = -100 // min y
    const to = 100 // max y
    const x1 = -5 // min x
    const x2 = 5 // max x
    const step = (x2 - x1) / n
    const margin = 30
    const layout = {
      width: 375,
      height: 375,
      margin: { l: margin, r: margin, t: margin, b: margin }
    }
    // Random data
    const xs = genArray(n, i => x1 + i*step)
    console.log({n, xs: xs.length})
    const ysMy = xs.map(_ => random(from, to))
    const ysJS = xs.map(_ => from + (to - from)*Math.random())
    const ysJS2 = xs.map(_ => from + (to - from)*Math.random())
    console.log('data is ready')
    // const ysSin = xs.map(x => 100*Math.sin(5*x) + from + (to - from)*Math.random())
    const ysSin = xs.map(x => 100*Math.sin(x))
    // Random correlation data
    const ls = genArray(1000, i => i)
    const ysCorrMy = ls.map(l => autocorrelation(l, i => ysMy[i]))
    const ysCorrJS = ls.map(l => autocorrelation(l, i => ysJS[i]))
    const ysMutualCorr = ls.map(l => mutualCorrelation(l, i => ysMy[i], i => ysJS[i]))
    const kek = ls.map(l => autocorrelation(l, i => ysSin[i]))
    // Sin data
    const s = spikes({ ys: ysSin, multiplier: 2*to, N: 10 })
    const as = antispike(s, to)

    // Sin
    makePlot({ id: 'sin', x: xs, y: s, title: 'Sin' })
    makePlot({ id: 'kek', x: xs, y: as, title: 'aSin' })
    // makePlot({ id: 'kek', x: ls, y: kek, title: 'kek' })
    console.log('Sin')
    // Random correlation
    makePlot({ id: 'corrMutual', x: ls, y: ysMutualCorr, title: 'Mutual' })
    makePlot({ id: 'corrMy', x: ls, y: ysCorrMy, title: 'My random correlation' })
    makePlot({ id: 'corrJS', x: ls, y: ysCorrJS, title: 'JS random correlation' })
    console.log('Correlation')
    // Random bar plots
    barPlot({ id: 'myRandomChart', ys: ysMy, from, to, title: 'My random distribution' })
    barPlot({ id: 'jsRandomChart', ys: ysJS, from, to, title: 'JS random distribution' })
    console.log('Bar plots')

    const a = [1, 2, 3, 4, 5, 6, 7, 8]
    console.log(a)
    console.log(shift(10, a))
    console.log(antishift(a))

    // Random plots
    // Plotly.newPlot('myRandomPlot', [{ x: xs, y: ysMy }], { ...layout, title: 'My random' })
    // Plotly.newPlot('jsRandomPlot', [{ x: xs, y: ysJS }], { ...layout, title: 'JS random' })
    // console.log('Random plots')


    function barPlot ({ id = '', ys = [], from = 0, bars = 20, to = 100, title = 'Bar plot' } = {}) {
      makePlot({ id, ...getBarData({ ys, from, to, bars }), title })
    }
    function getBarData ({ ys = [], bars = 20, from = 0, to = 100 } = {}) {
      const barX = genArray(bars, bar => from + bar*((to - from) / bars))
      const barY = genArray(bars, _ => 0)
      for (const y of ys)
        barY[Math.floor((bars / (to - from)) * (y - from))]++
      return { x: barX, y: barY, type: 'bar' }
    }
    function makePlot ({ id, x, y, type = 'line', title = 'Plot' } = {}) {
      Plotly.newPlot(id, [{ x, y, type }], { ...layout, title })
    }
    function shift (c, ys) {
      return ys.map(y => y + c)
    }
    function antishift (ys) {
      const avg = average(ys)
      return shift(-avg, ys)
    }
    function spikes ({ ys = [], multiplier = 1, N = 10, from = null, to = null } = {}) {
      const result = [...ys]
      if (from === null) from = 0 
      if (to === null) to = ys.length - 1 

      const points = []
      while (points.length < N) {
        const point = randomInt(from, to)
        if (!points.includes(point))
          points.push(point)
      }
      for (const point of points) {
        result[point] += Math.sign(result[point]) * multiplier * Math.abs(random())
      }
      return result
    }
    function antispike (ys = [], maxValue = 1) {
      if (ys.length < 2) return ys

      const result = [...ys]
      if (Math.abs(result[0]) > maxValue)
        result[0] = result[1]
      if (Math.abs(result[result.length - 1]) > maxValue)
        result[result.length - 1] = result[result.length - 2]

      for (let c = 1; c < result.length - 1; c++)
        if (Math.abs(result[c]) > maxValue)
          result[c] = (result[c - 1] + result[c + 1]) / 2

      return result
    }


    // this.stat = getStatistics(ysMy)
    // this.stat2 = getStatistics(ysJS)

    // console.log('\n  STATISTICS  \n')

    // console.log('my random', getStatistics(ysMy))
    // console.log('js random', getStatistics(ysJS))

    // console.log('\n  DIFFERENCES  \n')

    // console.log('my random', getDifferences(ysMy))
    // console.log('js random', getDifferences(ysJS))
    // console.log('stats data is ready')

    function getDifferences (arr) {
      const partsCount = 10
      const parts = splitIntoParts(arr, partsCount).map(getStatistics)


      const differences = {}
      for (const type of ['avg', 'std', 'squareAvg']) {
        const values = parts.map(part => part[type])
        const stats = getStatistics(values)
        differences[type] = stats.max - stats.min
      }



      // const differencePercentage = (a, b) => 100 * (a - b) / ((a + b) / 2)

      // const differences = { avg: [], std: [], squareAvg: [] }
      // for (let i = 0; i < partsCount; i++) {
      //   for (let j = 0; j < partsCount; j++) {
      //     if (i === j) continue
      //     for (const type of ['avg', 'std', 'squareAvg'])
      //       differences[type].push(differencePercentage(parts[i][type], parts[j][type]))
      //   }
      // }
      // for (const type of ['avg', 'std', 'squareAvg'])
      //   differences[type] = getStatistics(differences[type])

      return differences
    }

    function autocorrelation (l, fn, N = 1000) {
      let sum = 0
      for (let k = 0; k <= N; k++) {
        sum += fn(k) * fn(k + l)
      }
      return sum / N
    }

    function mutualCorrelation (l, fn1, fn2, N = 1000) {
      let sum = 0
      for (let k = 0; k <= N; k++) {
        sum += fn1(k) * fn2(k + l)
      }
      return sum / N
    }
  }
}
</script>

<style lang="sass">
@import 'sass/main.sass'
</style>
