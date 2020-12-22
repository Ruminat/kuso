<template lang="pug">
  .plotWithControls
    .plot(:id="id")
    .plot-controls
      .form-group.plot-params
        .input-group
          input.form-input.input-sm(type="text" v-model="fn" @keyup="inputChanged")
      .form-group.plot-params
        .input-group
          span.input-group-addon.addon-sm x
          input.form-input.input-sm(type="text" v-model.number="minX" @keyup="inputChanged")
          input.form-input.input-sm(type="text" v-model.number="maxX" @keyup="inputChanged")
          span.input-group-addon.addon-sm y
          input.form-input.input-sm(type="text" v-model.number="minY" @keyup="inputChanged")
          input.form-input.input-sm(type="text" v-model.number="maxY" @keyup="inputChanged")
</template>

<script>
  import functionPlot from "function-plot"
  import UID from '@/modules/UID.js'
  // import { compImport } from '@/modules/compImport.js'

  // const fields = ['parameters']

  const component = {
    name: 'plot',
    data () {
      return {
        id: 'plot-' + UID(),
        fn: '',
        width: 300,
        height: 300,
        minX: -5,
        maxX: 5,
        minY: -5,
        maxY: 5,
        timer: null,
        parameters: []
      }
    },
    computed: {},
    methods: {
      plotData (fn) {
        for (const { parameter, value } of this.parameters) {
          const regex = new RegExp(`([^a-z]|^)${parameter}([^a-z]|$)`, 'gi')
          fn = fn.replace(regex, `$1(${value})$2`)
        }
        return { fn, nSamples: 10000 }
      },
      updatePlot () {
        // Clears the plot.
        document.getElementById(this.id).innerHTML = ''

        // For multiple plots.
        const data = this.fn.split(';').map(this.plotData)

        // Updating/creating plot.
        try {
          functionPlot({
            target: document.getElementById(this.id),
            width: this.width,
            height: this.height,
            xAxis: { domain: [this.minX, this.maxX] },
            yAxis: { domain: [this.minY, this.maxY] },
            disableZoom: true,
            grid: true,
            data
          })
        } catch (_) {}

        // Cleaning up the css mess.
        document.querySelector(`#${this.id} .canvas`).style["transform"] = 'translate(1.6rem, 1rem)'
      },
      inputChanged () {
        if (this.timer)
          clearTimeout(this.timer)
        this.timer = setTimeout(_ => this.updatePlot(), 80)
      }
    },
    mounted () {
      this.updatePlot()
      // When parameters are changed.
      document.addEventListener('parametersChanged', e => {
        this.parameters = e.detail.parameters
        this.updatePlot()
      })
    }
  }

  // compImport(component, 'Plots', fields)

  export default component
</script>
