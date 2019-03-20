import donutChart from './donutChart.js'

const percentFormat = d3.format(',.2%')

function labelHtml({ data: d }) {
  return `${d.Species}: <tspan>${percentFormat(d.Probability)}</tspan>`
}

function tooltipHtml({ data: d }) {
  return [
    '<tspan x="0">Species: ', d.Species, '</tspan>',
    '<tspan x="0" dy="1.2em">Probability: ', percentFormat(d.Probability), '</tspan>',
    '<tspan x="0" dy="1.2em">Error: ', percentFormat(d.Error), '</tspan>'
  ].join('')
}

async function main() {
  const donut = donutChart()
    .labelHtml(labelHtml)
    .tooltipHtml(tooltipHtml)
    .valueAccessor(d => d.Probability)

  const data = await d3.tsv('species.tsv')
  d3.select('#chart')
    .datum(data)
    .call(donut)
}

main()
