const margin = { top: 50, right: 50, bottom: 50, left: 50 }
const height = 500
const width = 700
const totalWidth = width + margin.left + margin.right
const totalHeight = height + margin.top + margin.bottom
const duration = { line: 1000, dot: 500 }
const radius = 5

/* Number of datapoints */
const n = 50

/* An array of n random numbers */
const random = d3.randomUniform()
const data = d3.range(n).map(() => random())

const svg = d3
  .select('svg')
  .attr('viewBox', `0 0 ${totalWidth} ${totalHeight}`)
  .attr('preserveAspectRatio', 'xMinYMin')
  .append('g')
  .attr('transform', `translate(${margin.left}, ${margin.top})`)

/* X axis */
const xScale = d3
  .scaleLinear()
  .domain([0, n - 1]) /* Input */
  .range([0, width]) /* Output */

svg
  .append('g')
  .attr('transform', `translate(0, ${height})`)
  .call(d3.axisBottom(xScale))

/* Y axis */
const yScale = d3
  .scaleLinear()
  .domain([0, 1]) /* Input */
  .range([height, 0]) /* Output */

svg.append('g').call(d3.axisLeft(yScale))

/* Line */
const line = d3
  .line()
  .x((_, i) => xScale(i))
  .y(yScale)
  .curve(d3.curveMonotoneX) /* Smoothen line */

const linePath = svg
  .append('path')
  .datum(data)
  .attr('class', 'line')
  .attr('d', line)

/* Animate line drawing
 * See:
 * https://medium.com/@louisemoxy/create-a-d3-line-chart-animation-336f1cb7dd61
 * https://jakearchibald.com/2013/animated-line-drawing-svg/ */
const pathLength = linePath.node().getTotalLength()
linePath
  .attr('stroke-dashoffset', pathLength)
  .attr('stroke-dasharray', pathLength)
  .transition()
  .ease(d3.easeSin)
  .duration(duration.line)
  .attr('stroke-dashoffset', 0)

/* Dots */
svg
  .selectAll('.dot')
  .data(data)
  .enter()
  .append('circle')
  .attr('class', 'dot')
  .attr('cx', (d, i) => xScale(i))
  .attr('cy', yScale)
  .attr('r', radius)
  .style('opacity', 0)
  .transition()
  .delay(duration.line)
  .duration(duration.dot)
  .style('opacity', 1)
