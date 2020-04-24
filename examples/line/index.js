import LineChart from './chart/index.js'

const UPDATE_INTERVAL = 5 * 1000

const random = d3.randomUniform()

/* Get an array of values with shape { index, value } */
function getData() {
  /* Base number of datapoints */
  const baseNumData = 50

  /* Offset the amount of data by random amount in [-offset, offset] */
  const offset = 25
  const numData = Math.floor(baseNumData - offset + random() * (2 * offset + 1))

  /* Data points can be missing */
  const numMissing = 10
  const missingStart = Math.floor(random() * numData)
  const missingEnd = missingStart + Math.floor(random() * numMissing)

  return d3
    .range(numData)
    .filter((i) => i < missingStart || i > missingEnd)
    .map((i) => ({ index: i, value: random() }))
}

async function main() {
  const data = getData()
  const line = new LineChart().data(data)

  /* Initial render */
  d3.select('#chart').call(line.call)

  /* Updates */
  function updateInterval() {
    const updateData = getData()
    line.data(updateData)
    setTimeout(updateInterval, UPDATE_INTERVAL)
  }
  setTimeout(updateInterval, UPDATE_INTERVAL)
}

main()
