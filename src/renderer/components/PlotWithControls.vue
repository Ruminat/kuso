<template lang="pug">
  .plotWithControls
    plot(v-bind="{...$props, ...$attrs}")
    .plot-controls
      .form-group(style="width: 5rem;")
        .input-group
          input.form-input.input-sm(
            type="text"
            placeholder="-5"
            v-model.number="minX"
          )
          span.input-group-addon.addon-sm x
          input.form-input.input-sm(
            type="text"
            placeholder="5"
            v-model.number="maxX"
          )
</template>

<script>
  import Plot from '@/components/Plot.vue'

  export default {
    name: 'plotWithControls',
    components: { Plot },
    props: {
      fn:     { type: String, default: 'x' },
      width:  { type: Number, default: 300 },
      height: { type: Number, default: 300 },
      minX:   { type: Number, default: -5 },
      maxX:   { type: Number, default: 5 },
      minY:   { type: Number, default: -5 },
      maxY:   { type: Number, default: 5 },
    }
  }
</script>
