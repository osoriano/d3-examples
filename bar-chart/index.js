let tooltip

async function main() {
  const data = await d3.json('data.json')
  data.sort((a, b) => b.value - a.value)

  const width = 860
  const height = 75 * data.length

  MAX_LABEL_WIDTH = 70
  const margin = {
    top: 20,
    right: 20,
    bottom: 30,
    /* Y axis values are printed on the left margin,
     * so needs to be large enough */
    left: MAX_LABEL_WIDTH + 10,
  }

  const totalWidth = width + margin.left + margin.right
  const totalHeight = height + margin.top + margin.bottom

  const xScale = d3
    .scaleLinear()
    .range([0, width])
    .domain([0, d3.max(data, (d) => d.value)])

  const yScale = d3
    .scaleBand()
    .range([0, height])
    .domain(data.map((d) => d.label))
    .padding(0.1)

  const svg = d3
    .select('svg')
    .attr('viewBox', `0 0 ${totalWidth} ${totalHeight}`)
    .attr('preserveAspectRatio', 'xMinYMin')

  const g = svg
    .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

  g.append('g')
    .attr('class', 'x axis')
    .attr('transform', 'translate(0,' + height + ')')
    .call(
      d3
        .axisBottom(xScale)
        .ticks(5)
        .tickFormat((d) => parseInt(d / 1000))
        .tickSizeInner([-height])
    )

  g.append('g')
    .attr('class', 'y axis')
    .call(d3.axisLeft(yScale))
    .selectAll('.tick text')
    .each(wrapLabel)

  tooltip = d3.select('body').append('div').attr('class', 'tool-tip')

  g.selectAll('.bar')
    .data(data)
    .enter()
    .append('rect')
    .attr('class', 'bar')
    .attr('x', 0)
    .attr('y', (d) => yScale(d.label))
    .attr('height', yScale.bandwidth())
    .attr('width', (d) => xScale(d.value))
    .on('mousemove', onRectHover)
    .on('mouseout', onRectHoverOut)
}

function onRectHoverOut(d) {
  tooltip.style('left', '-100%')
}

function onRectHover(d) {
  tooltip.html(`${d.label}<br>£${d.value}`)

  const width = tooltip.node().offsetWidth
  const height = tooltip.node().offsetHeight
  const left = `${d3.event.pageX - width / 2}px`
  const top = `${d3.event.pageY - height}px`
  tooltip.style('left', left).style('top', top)
}

function wrapLabel() {
  while (
    this.getComputedTextLength() > MAX_LABEL_WIDTH &&
    this.textContent.length > 5
  ) {
    this.textContent = `${this.textContent.slice(0, -4)}...`
    console.log(
      `new computed length ${this.getComputedTextLength()}. new length ${
        this.textContent.length
      }`
    )
  }
}

main()
