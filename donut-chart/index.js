import DonutChart from './donutChart/index.js'

const UPDATE_INTERVAL = 1500
const percentFormat = d3.format(',.2%')

function labelHtml({ data: d }) {
  return `${d.species}: <tspan>${percentFormat(d.prob)}</tspan>`
}

function tooltipHtml({ data: d }) {
  return [
    '<tspan x="0">Species: ',
    d.species,
    '</tspan>',
    '<tspan x="0" dy="1.2em">Probability: ',
    percentFormat(d.prob),
    '</tspan>',
    '<tspan x="0" dy="1.2em">Error: ',
    percentFormat(d.err),
    '</tspan>',
  ].join('')
}

async function main() {
  const data = d3
    .nest()
    .key((d) => d.time)
    .entries(await d3.tsv('species.tsv'))
    .map((entry) => entry.values)

  const donut = new DonutChart()
    .labelHtml(labelHtml)
    .tooltipHtml(tooltipHtml)
    .valueAccessor((d) => d.prob)
    .keyAccessor((d) => d.data.species)
    .data(data[0])

  /* Initial render */
  d3.select('#chart').call(donut.call)

  /* Updates */
  let i = 1
  const n = 10
  function updateInterval() {
    if (i >= n) {
      return
    }
    donut.data(data[i])
    i += 1
    setTimeout(updateInterval, UPDATE_INTERVAL)
  }
  setTimeout(updateInterval, UPDATE_INTERVAL)
}

main()
