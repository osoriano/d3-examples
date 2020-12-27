import DonutChart from './chart/index.js'

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

  const initData = data[0]
  const donut = new DonutChart()
    .labelHtml(labelHtml)
    .tooltipHtml(tooltipHtml)
    .valueAccessor((d) => d.prob)
    .keyAccessor((d) => d.data.species)
    .data(initData)

  /* Initial render */
  d3.select('#chart').call(donut.draw)

  /* Updates */
  let i = 1
  function updateData() {
    if (i >= data.length) {
      return
    }
    donut.data(data[i])
    i += 1
    setTimeout(updateData, UPDATE_INTERVAL)
  }
  setTimeout(updateData, UPDATE_INTERVAL)
}

main()
