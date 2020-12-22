  /*
    The dat file
  */

  const fileData = {}
  fileData.ys = await readFileFloat32('C:/Users/810947/Downloads/kek.dat')
  fileData.xs = fileData.ys.map((_, i) => i + 1)
  fileData.dt = 0.002
  const plotData = Plots.spectrumPlotData({ arr: fileData.ys, ns: fileData.xs, step: fileData.dt })
  // const weights = Plots.potterWeights({ fc: 20, m: 256, dt: fileData.dt })
  // const weights = Plots.potterHighPassWeights({ fc: 40, m: 256, dt: fileData.dt })
  // const weights = Plots.potterBandPassWeights({ fc1: 10, fc2: 200, m: 256, dt: fileData.dt })
  const weights = Plots.potterBandStopWeights({ fc1: 10, fc2: 80, m: 256, dt: fileData.dt })
  const weightsSpectrum = Plots.spectrumPlotData({ arr: weights, step: fileData.dt, norm: false })
  fileData.conv = Plots.convolution(fileData.ys, weights, weights.length)

  await this.addPlots([
    { ...fileData, title: 'Исходные данные' },
    { ...plotData, title: 'Спектр' },
    { ys: weights, title: 'M' },
    { ...weightsSpectrum, title: 'Спектр весов' },
    { ys: fileData.conv, title: 'Свёртка' },
  ])

  /*
    heart goes boing boing
  */

  // const a = 20
  // const M = 200
  // const ms = genArray(M, i => i + 1)
  // const bebe = genArray(N + M, i => i + 1)
  // const h = ms.map(n => Math.sin(2 * Math.PI * frequency * dt * n) * Math.exp(-a * dt * n))
  // const beatsCount = 3
  // const beatLength = Math.ceil(N / (beatsCount + 1))
  // const beats = genArray(N, i => 0)
  // for (let i = beatLength; i < N; i += beatLength) {
  //   beats[i] = randomJS(110, 130)
  // }
  // const rndBeats = genArray(N, i => 0)
  // rndBeats[230] = randomJS(110, 130)
  // rndBeats[885] = randomJS(110, 130)
  // rndBeats[899] = randomJS(110, 130)
  // const conv = Plots.convolution(beats, h, M)
  // const rndConv = Plots.convolution(rndBeats, h, M)
  // await this.addPlots([
  //   { xs: ns, ys: beats, title: '3 равных промежутка' },
  //   { xs: ns, ys: rndBeats, title: 'Случайные промежутки' },
  //   { xs: ms, ys: h, title: 'h(x)' },
  //   { xs: bebe, ys: conv, title: '3 равных промежутка (свёртка)' },
  //   { xs: bebe, ys: rndConv, title: 'Случайные промежутки (свёртка)' },
  // ])


  /*
    Noize
  */

  // const pureFn = xs.map(x => -2.5*x + 4*Math.sin(2*x) + 2*Math.cos(3*x))
  // const fnWithNoise = xs.map((_, i) => pureFn[i] + ysJS[i])
  // const denoised = Plots.denoise(fnWithNoise)
  // const deFunction = fnWithNoise.map((v, i) => v - denoised[i])
  // const difference = Plots.difference(pureFn, denoised)
  // const differenceWTF = Plots.difference(deFunction, ysJS)

  // let kek, randoms, sumRandoms
  // const stds = []
  // let sinRandoms1 = []
  // let sinRandoms10 = []
  // let sinRandoms100 = []
  // for (kek = 1; kek <= 100; kek++) {
  //   randoms = genArray(kek, i => xs.map(_ => randomJS(from, to)))
  //   sumRandoms = xs.map((_, i) => randoms.reduce((acc, r) => acc + r[i], 0) / kek)
  //   stds.push(std(sumRandoms))
  //   if (kek === 1) sinRandoms1 = xs.map((_, i) => ysSin[i] + sumRandoms[i])
  //   if (kek === 10) sinRandoms10 = xs.map((_, i) => ysSin[i] + sumRandoms[i])
  //   if (kek === 100) sinRandoms100 = xs.map((_, i) => ysSin[i] + sumRandoms[i])
  // }
  // const sinRandoms = xs.map((_, i) => ysSin[i] + sumRandoms[i])

  // let stats = []
  // const is = genArray(100, i => i + 2)
  // is.map(i => {
  //   const denoised = Plots.denoise(fnWithNoise, i)
  //   const difference = Plots.differenceAbs(pureFn, denoised)
  //   stats.push(sum(difference))
  // })

  // await this.addPlots([
  //   { xs: is, ys: stats, title: 'Function' },
  // ])

//   await this.addPlots([
//     { xs: xs, ys: ysSin, title: 'Исходная функция f(x)' },
//     { xs: xs, ys: ysSinRnd, title: 'f(x) + рандом' },
//     { xs: xs, ys: ysSinRnd, title: 'f(x) + рандом' },
//     { xs: xs, ys: sinRandoms1, title:   'f(x) + 1 рандом' },
//     { xs: xs, ys: sinRandoms10, title:  'f(x) + 10 рандомов' },
//     { xs: xs, ys: sinRandoms100, title: 'f(x) + 100 рандомов' },
//     { xs: xs, ys: sumRandoms, title: 'Сумма 100 рандомов' },
//     { xs: genArray(100, i => i + 1), ys: stds, title: 'Значение std от кол-ва рандомов' }
//   ])



//   await this.addPlots([
//     { xs: xs, ys: pureFn, title: 'Изначальная функция f(x)' },
//     { xs: xs, ys: fnWithNoise, title: 'f(x) с добавлением шума' },
//     {
//       title: 'Сравнение', data: [
//         { x: xs, y: denoised, name: 'Удалили шум', type: 'line' },
//         { x: xs, y: pureFn, name: 'f(x)', type: 'line' }
//       ]
//     },
//     { xs: xs, ys: difference, title: 'Разница с оригиналом' },
//     {
//       title: 'Сравнение', data: [
//         { x: xs, y: deFunction, name: 'Подавление f(x)', type: 'line' },
//         { x: xs, y: ysJS, name: 'Изначальный шум', type: 'line' }
//       ]
//     },
//     { xs: xs, ys: differenceWTF, title: 'Разница с оригиналом' },
//   ])