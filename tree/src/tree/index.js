import './index.styl'

const WIDTH = 2000
const HEIGHT = 460
const MARGIN_VERTICAL = 20
const MARGIN_HORIZONTAL = 240
const TOTAL_WIDTH = WIDTH + MARGIN_HORIZONTAL
const TOTAL_HEIGHT = HEIGHT + MARGIN_VERTICAL

const DURATION = 750
const DIAGONAL = d3.svg.diagonal().projection(d => [d.y, d.x])

const TREE = d3.layout.tree().size([HEIGHT, WIDTH])
    

export default class Tree {
  constructor() {
    this.nodeId = 0
    this.showNotifications = true
    this.root = {
      'name': 'root',
      'parent': 'null',
      'x0': HEIGHT / 2,
      'y0': 0
    }

    this.svg = d3.select('#svg-wrapper')
        .append('svg')
        .attr('width', TOTAL_WIDTH)
        .attr('height', TOTAL_HEIGHT)
        .append('g')
        .attr('transform',
              'translate(' + (MARGIN_HORIZONTAL / 2) + ', ' +
                             (MARGIN_VERTICAL / 2) + ')')
    this.update(this.root)
  }

  findChildNode(root, node) {
    if (!root.children) {
      return false
    }
    return root.children.find(c => c.name === node)
  }

  insertChildNode(root, node) {
    if (!root.children) {
      root.children = []
    }
    const childNodeUpdate = {
      parent: root.name,
      name: node
    }
    const childNodeUpdateDigit = Number(node.slice(-1))

    const { children } = root
    let inserted = false;
    for (let entry of children.entries()) {
      const [i, child] = entry
      const childDigit = Number(child.name.slice(-1))
      if (childNodeUpdateDigit < childDigit) {
          children.splice(i, 0, childNodeUpdate)
          inserted = true
          break
      }
    }

    if (!inserted) {
      children.push(childNodeUpdate)
    }

    return childNodeUpdate
  }

  notification(type, message) {
    if (this.showNotifications) {
      toastr[type](message)
    }
  }

  addPath(path, cb) {
    let root = this.root
    /* The first node in the path that is not already part of the tree */
    let nodeToUpdate = null
    for (let node of path) {
      if (!nodeToUpdate) {
        let foundNode = this.findChildNode(root, node)
        if (foundNode) {
            root = foundNode
            continue
        } else {
          nodeToUpdate = root
        }
      }

      root = this.insertChildNode(root, node)
    }
    if (!nodeToUpdate) {
      const warning = 'Path already present'
      this.notification('warning', warning)
      cb(warning)
      return
    }
    this.update(nodeToUpdate)
    this.notification('success', 'Added path')
    cb()
  }

  update(nodeToUpdate) {
    /* Compute the new tree layout */
    const nodes = TREE.nodes(this.root).reverse()
    const links = TREE.links(nodes)
  
    /* Use fixed depth */
    nodes.forEach(d => { d.y = d.depth * 180 })
  
    /* Assign id to node if not present */
    const node = this.svg.selectAll('g.node')
        .data(nodes, d => d.id || (d.id = ++this.nodeId))
  
    /* New nodes enter at the parent's previous position */
    const nodeEnter = node.enter()
        .append('g')
        .attr('class', 'node')
        .attr('transform', d => 'translate(' + nodeToUpdate.y0 + ',' + nodeToUpdate.x0 + ')')
        .on('click', d => this.toggleChildren(d))
  
    nodeEnter.append('circle')
        .attr('r', 1e-6)
        .style('fill', d => d._children ? 'lightsteelblue' : '#fff')
  
    nodeEnter.append('text')
        .attr('x', d => d.children || d._children ? -13 : 13)
        .attr('dy', '.35em')
        .attr('text-anchor', d => d.children || d._children ? 'end' : 'start')
        .text(d => d.name)
        .style('fill-opacity', 1e-6)
  
    /* Nodes then transition to their own positions */
    const nodeUpdate = node.transition()
        .duration(DURATION)
        .attr('transform', d => 'translate(' + d.y + ',' + d.x + ')')
  
    nodeUpdate.select('circle')
        .attr('r', 10)
        .style('fill', d => d._children ? 'lightsteelblue' : '#fff');
  
    nodeUpdate.select('text')
        .style('fill-opacity', 1);
  
    /* Exiting nodes transition back to the parent's new position */
    const nodeExit = node.exit().transition()
        .duration(DURATION)
        .attr('transform', d => 'translate(' + nodeToUpdate.y + ',' + nodeToUpdate.x + ')')
        .remove()
  
    nodeExit.select('circle')
        .attr('r', 1e-6);
  
    nodeExit.select('text')
        .style('fill-opacity', 1e-6);
  
    /* Update the links */
    const link = this.svg.selectAll('path.link')
        .data(links, d => d.target.id);
  
    /* New links enter at the parent's previous position */
    link.enter().insert('path', 'g')
        .attr('class', 'link')
        .attr('d', d => {
          const source = {x: nodeToUpdate.x0, y: nodeToUpdate.y0};
          const target = source;
          return DIAGONAL({source, target});
        });
  
    /* Links then transition to their own position */
    link.transition()
        .duration(DURATION)
        .attr('d', DIAGONAL);
  
    /* Exiting nodes go back to parent's new position */
    link.exit().transition()
        .duration(DURATION)
        .attr('d', function(d) {
          const source = {x: nodeToUpdate.x, y: nodeToUpdate.y};
          const target = source;
          return DIAGONAL({source, target});
        })
        .remove()
  
    /* Stash the old positions for transition */
    nodes.forEach(d => {
      d.x0 = d.x;
      d.y0 = d.y;
    })
  }

  toggleChildren(d) {
    if (d.children) {
      d._children = d.children;
      d.children = null;
    } else {
      d.children = d._children;
      d._children = null;
    }
    this.update(d);
  }
}
