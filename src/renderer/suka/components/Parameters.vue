<template lang="pug">
  .parameters
    .form-group
      textarea.form-input(
        rows="5"
        placeholder="e = 2.7182\npi = 3.1415"
        @input="textareaChange($event.target.value)"
      )
</template>

<script>
  // import { compImport } from '@/modules/compImport.js'

  // const fields = ['parameters']

  const component =  {
    name: 'parameters',
    data () {
      return {
        timer: null,
        parameters: []
      }
    },
    computed: {},
    methods: {
      textareaChange (text) {
        if (this.timer)
          clearTimeout(this.timer)
        this.timer = setTimeout(updateParameters, 100)

        const self = this
        
        function updateParameters () {
          this.parameters = text.split('\n')
            .map(line => {
              try {
                const [param, value] = line.split('=')
                if (!/^\s*[a-z]\w*\s*$/i.test(param)) return null
                return { parameter: param.trim(), value: value.trim() }
              } catch (_) {
                return null
              }
            })
            .filter(p => p !== null)
          document.dispatchEvent(new CustomEvent('parametersChanged', {
            detail: { parameters: this.parameters },
            bubbles: false
          }))
        }
      }
    }
  }

  // compImport(component, 'Plots', fields)

  export default component
</script>
