<template lang="pug">
.main.container(style="text-align: center")
  h2 Somebody once told me the world is gonna roll me
  .plots
    .plots-block(v-for="ids in plotBlocks")
      .plot(v-for="id in ids" :id="id")
</template>

<script>
// import Plot from '@/components/Plot.vue'
// import Parameters from '@/components/Parameters.vue'

import {
  random, randomInt, randomJS, randomIntJS,
  getStatistics, splitIntoParts, average, sum, std
} from '@/modules/statistics.js'
import { delay, genArray } from '@/modules/utils.js'
import UID from '@/modules/UID.js'
import Plots from '@/modules/Plots.js'
import { readFileFloat32 } from '@/modules/files.js'

const fs = require('fs')

// import { WaveFile } from 'wavefile'

export default {
  name: 'kuso',
  data () {
    return {
      plotBlocks: [],
      weightsParams: { m: 256, dt: 0.002 },
    }
  },
  // components: { Plot, Parameters },
  computed: {},
  methods: {
    async addPlots (plots) {
      const ids = plots.map(_ => `plotly-${UID()}`)
      this.plotBlocks.push(ids)
      await delay(0) // Needed for the plot HTML elements to be created (no idea why).
      plots.map(({ data = null, xs = [], ys = [], title = '' } = {}, i) => {
        Plots.makePlot({ id: ids[i], data, x: xs, y: ys, title })
      })
    },
    // Обработка .wav файла.
    async wav () {
      console.log('wav')
      const nodeWav = require('node-wav')

      const filename = 'LetterA.wav'
      const fileData = nodeWav.decode(fs.readFileSync(`./data/audio/${filename}`))
      fileData.ys = fileData.channelData[0]
      fileData.rate = fileData.sampleRate
      fileData.dt = 1 / fileData.rate


      const weights = Plots.potterWeights({ fc: 330, m: 64, dt: fileData.dt })
      // const weights = Plots.potterBandStopWeights({ fc1: 1400, fc2: 2900, m: 64, dt: fileData.dt })
      const data = fileData.ys
      // const data = Plots.convolution(fileData.ys, weights)

      // fs.writeFileSync(
      //   './data/audio/changed.wav',
      //   nodeWav.encode([data], { sampleRate: fileData.rate, float: true, bitDepth: 32 })
      // )

      this.addPlots([
        { ys: data, title: 'Буква «А»' },
        { ...Plots.spectrumPlotData({ ...fileData }), title: 'Спектр' },
      ])
    },
    // Обработка .dat файла.
    async dat () {
      console.log('dat')
      const filename = 'file.dat'
      const fileData = { dt: 0.002, title: filename }
      fileData.ys = await readFileFloat32(`./data/dat/${filename}`)
      fileData.xs = fileData.ys.map((_, i) => i * fileData.dt)
      this.weightsParams.dt = fileData.dt

      const weightsLP = Plots.potterWeights({ fc: 120, ...this.weightsParams })
      const weightsHP = Plots.potterHighPassWeights({ fc: 10, ...this.weightsParams })
      const weightsBP = Plots.potterBandPassWeights({ fc1: 10, fc2: 40, ...this.weightsParams })
      const weightsBS = Plots.potterBandStopWeights({ fc1: 10, fc2: 80, ...this.weightsParams })

      this.addPlots([
        { ...fileData },
        Plots.spectrumPlotData({ ...fileData, title: 'Spectrum' }),
      ])

      this.weightsAndSpectrum(weightsLP, 'LowPass')
      this.fnWithWeights(fileData, weightsLP, `${filename} + LowPass`)
      this.weightsAndSpectrum(weightsHP, 'HighPass')
      this.fnWithWeights(fileData, weightsHP, `${filename} + HighPass`)
      this.weightsAndSpectrum(weightsBP, 'BandPass')
      this.fnWithWeights(fileData, weightsBP, `${filename} + BandPass`)
      this.weightsAndSpectrum(weightsBS, 'BandStop')
      this.fnWithWeights(fileData, weightsBS, `${filename} + BandStop`)
    },
    weightsAndSpectrum (weights, title = 'Weights', weightsParams = this.weightsParams) {
      this.addPlots([
        { ys: weights, title },
        Plots.spectrumPlotData({ ys: weights, ...weightsParams, norm: false, title: `${title} Spectrum` }),
      ])
    },
    fnWithWeights (data, weights, title = 'Weights', weightsParams = this.weightsParams) {
      const conv = Plots.convolution(data.ys, weights)
      this.addPlots([
        { ...data, ys: conv, title },
        Plots.spectrumPlotData({ ys: conv, ...weightsParams, title: `${title} Spectrum` }),
      ])
    }
  },
  // Когда компонент загрузился.
  async mounted () {
    console.log('mounted')
    // this.wav()
    this.dat()
  }
}
</script>

<style lang="sass">
@import 'sass/main.sass'
</style>
