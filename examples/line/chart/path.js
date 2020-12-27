const LINE_CLASS = 'line'

export default class Path {
  constructor(svg, props) {
    this.svg = svg
    this.props = props
    const { xScale, yScale, oldXScale } = this.props
    this.oldLine = d3
      .line()
      .x((d) => oldXScale(d.index))
      .y((d) => yScale(d.value))
    this.line = d3
      .line()
      .x((d) => xScale(d.index))
      .y((d) => yScale(d.value))
  }

  /* Given an array of size m < n, return an array
   * with duplicate data such that the new array length is n.
   * Duplicate the data is evenly as possible acrross the array */
  static getDuplicatedData(data, n) {
    const m = data.length
    const numRepeats = Math.floor(n / m)
    const remaining = n % m

    let leftRemaining = Math.floor(remaining / 2)
    let rightRemaining = leftRemaining + (remaining % 2)
    const mid_i = Math.floor(m / 2)

    const left = []
    for (let i = 0; i < mid_i; i += 1) {
      for (let j = 0; j < numRepeats; j += 1) {
        left.push(data[i])
      }
      if (leftRemaining) {
        leftRemaining -= 1
        left.push(data[i])
      }
    }

    const right = []
    for (let i = m - 1; i >= mid_i; i -= 1) {
      for (let j = 0; j < numRepeats; j += 1) {
        right.push(data[i])
      }
      if (rightRemaining) {
        rightRemaining -= 1
        right.push(data[i])
      }
    }
    return left.concat(right.reverse())
  }

  dataUpdate() {
    const { data, duration } = this.props
    const oldData = this.path.data()[0]
    const oldLength = oldData.length
    const newLength = data.length
    if (newLength <= oldLength) {
      /* In case new length is equal to old length, the transition is smooth.
       *
       * In case new length is less than old length, portions of the old path
       * will dissapear without transition. This looks ok since the path is
       * then expanded with a transition. */
      this.path
        .datum(data)
        .transition()
        .duration(duration.line)
        .attr('d', this.line)
    } else {
      /* In case new length is greater than old length, portions of the new
       * path can appear without transition. This does not look good, since
       * the new path can overlap with old path which hasn't transitioned.
       *
       * See this article for a more in-depth explanation:
       * https://bocoup.com/blog/improving-d3-path-animation
       *
       * To work around this, change the old path data size to match
       * the new path data size by duplicating points on the old path.
       * Then, transition to the new path. */
      const duplicatedData = Path.getDuplicatedData(oldData, newLength)

      this.path
        .datum(duplicatedData)
        .transition()
        .duration(0)
        .attr('d', this.oldLine)

      this.path
        .datum(data)
        .transition()
        .duration(duration.line)
        .attr('d', this.line)
    }
  }

  draw() {
    const { duration, data, svg } = this.props

    this.path = svg
      .append('path')
      .datum(data)
      .attr('class', LINE_CLASS)
      .attr('d', this.line)

    /* Animate initial line drawing
     * See:
     * https://medium.com/@louisemoxy/create-a-d3-line-chart-animation-336f1cb7dd61
     * https://jakearchibald.com/2013/animated-line-drawing-svg/ */
    const pathLength = this.path.node().getTotalLength()
    this.path
      .attr('stroke-dashoffset', pathLength)
      .attr('stroke-dasharray', pathLength)
      .transition()
      .ease(d3.easeSin)
      .duration(duration.line)
      .attr('stroke-dashoffset', 0)
      .transition()
      .duration(0)
      .attr('stroke-dashoffset', null)
      .attr('stroke-dasharray', null)
  }
}
