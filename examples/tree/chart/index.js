import Edges from './edges.js'
import Nodes from './nodes.js'

export default class Tree {
  constructor() {
    /* Default props */
    this.props = {
      margin: { top: 20, right: 50, bottom: 20, left: 50 },
      width: 1100,
      height: 460,
      duration: 750,
      radius: 10,
      root: {},
    }

    /* Getters/setters (with updates) for props */
    for (const prop in this.props) {
      this[prop] = (value) => {
        if (value === undefined) {
          return this.props[prop]
        }
        this.props[prop] = value
        if (typeof this[`${prop}Update`] === 'function') {
          this[`${prop}Update`](value)
        }
        return this
      }
    }
  }

  /* Using the d3 hierarchy / tree modules,
   * get the data to be used for d3 */
  getData() {
    const { tree, props } = this
    const { root } = props

    /* Create a new root, where each node contains height, depth, and parent.
     * Embeds the old node under the data attribute of the new node */
    const rootHierarchy = d3.hierarchy(
      root,
      (d) => d.children && Object.values(d.children)
    )

    /* Adds x, y to each node */
    tree(rootHierarchy)

    /* Return the array of nodes */
    const data = rootHierarchy.descendants()

    /* Use fixed depth to maintain position as items are added / removed */
    data.forEach((d) => {
      d.y = d.depth * 180
    })
    return data
  }

  setDerivedProps(selection) {
    const { props } = this
    const { width, height, margin } = props

    const marginHorizontal = margin.left + margin.right
    const marginVertical = margin.top + margin.bottom
    const totalWidth = width + marginHorizontal
    const totalHeight = height + marginVertical

    this.tree = d3.tree().size([height, width])
    props.svg = selection
      .append('svg')
      .attr('viewBox', `0 0 ${totalWidth} ${totalHeight}`)
      /* Display at top center */
      .attr('preserveAspectRatio', 'xMidYMin')
      .append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`)
    props.toggleChildren = this.toggleChildren
    props.data = this.getData()
  }

  /* Assumes nodes are not added between calls */
  toggleChildren = (ev, d) => {
    d = d.data
    if (d.children) {
      this.setExpandFrom(d.children, d)
      d._children = d.children
      d.children = null
    } else {
      d.children = d._children
      d._children = null
    }
    this.rootUpdate()
  }

  setExpandFrom(children, d) {
    for (const child of Object.values(children)) {
      child.expandFrom = d
      if (child.children) {
        this.setExpandFrom(child.children, d)
      }
    }
  }

  _rootUpdate() {
    this.props.data = this.getData()
    this.nodes.rootUpdate()
    this.edges.rootUpdate()
  }

  draw = (selection) => {
    this.setDerivedProps(selection)

    this.nodes = new Nodes(this.props)
    this.nodes.draw()

    this.edges = new Edges(this.props)
    this.edges.draw()

    /* Allow updates after first call */
    this.rootUpdate = this._rootUpdate
  }
}
