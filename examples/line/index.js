import LineChart from './chart.js'

async function main() {
  /* Number of datapoints */
  const n = 50

  /* An array of n random numbers */
  const random = d3.randomUniform()
  const data = d3.range(n).map(() => random())

  const line = new LineChart().data(data)

  /* Initial render */
  d3.select('#chart').call(line.call)
}

main()
