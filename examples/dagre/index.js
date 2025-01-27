const inputNodes = {
  kspacey: { label: "Kevin Spacey", width: 144, height: 100 },
  swilliams: { label: "Saul Williams", width: 160, height: 100 },
  bpitt: { label: "Brad Pitt", width: 108, height: 100 },
  hford: { label: "Harrison Ford", width: 168, height: 100 },
  lwilson: { label: "Luke Wilson", width: 144, height: 100 },
  kbacon: { label: "Kevin Bacon", width: 121, height: 100 },
};

const inputEdges = {
  kspacey: "swilliams",
  swilliams: "kbacon",
  bpitt: "kbacon",
  hford: "lwilson",
  lwilson: "kbacon",
};

function main() {
  // Dump input data into the UI
  addPreBlock("Input Nodes", inputNodes);
  addPreBlock("Input Edges", inputEdges);

  // Create a new dagre graph
  const dagreGraph = getDagreGraph(inputNodes, inputEdges);

  const graphLabels = dagreGraph.graph();
  addPreBlock("Output Graph Properties", graphLabels);

  const nodeLabels = dagreGraph
    .nodes()
    .map((nodeId) => dagreGraph.node(nodeId));
  addPreBlock("Output Nodes", nodeLabels);

  const edgeLabels = dagreGraph
    .edges()
    .map((edgeId) => dagreGraph.edge(edgeId));
  addPreBlock("Output Edges", edgeLabels);

  const chartElement = document.getElementById("chart");
  chartElement.innerHTML = getSvg(graphLabels, nodeLabels, edgeLabels);
}

/**
 * Return the svg content as a string for the specified labels
 * generated by dagre
 */
function getSvg(graphLabels, nodeLabels, edgeLabels) {
  const { width, height } = graphLabels;

  /* Since the graph may overflow slightly (e.g. from using stroke-width),
   * add padding to avoid the overflow */
  const padding = 10;
  const totalWidth = width + 2 * padding;
  const totalHeight = height + 2 * padding;
  return `
    <div class="graph-container panel">
      <svg width="${totalWidth}" height="${totalHeight}"
          viewBox="0 0 ${totalWidth} ${totalHeight}"
          version="1.1" xmlns="http://www.w3.org/2000/svg">
        <g transform="translate(${padding}, ${padding})">
          ${getSvgNodes(nodeLabels)}
          ${getSvgEdges(edgeLabels)}
        </g>
      </svg>
    </div>
  `;
}

function getSvgNodes(nodeLabels) {
  const rectElements = nodeLabels.map(({ width, height, x, y }) => {
    // Since (x, y) is at the center, calculate the left x (lx)
    // and top y (ty) for use with rect
    const lx = x - width / 2;
    const ty = y - height / 2;
    const borderRadius = 30;
    return `
      <rect width="${width}" height="${height}" x="${lx}" y="${ty}"
        rx="${borderRadius}" ry="${borderRadius}" class="node" />`;
  });

  const textElements = nodeLabels.map(
    ({ label, x, y }) =>
      `<text x="${x}" y="${y}" class="node-label">${label}</text>`,
  );

  const htmlElements = nodeLabels.map(({ width, height, x, y }) => {
    // Since (x, y) is at the center, calculate the left x (lx)
    // and top y (ty) for use with rect
    const lx = x - width / 2;
    const ty = y - height / 2;
    return `
      <foreignObject width="${width}" height="${height}" x="${lx}" y="${ty}">
        <body xmlns="http://www.w3.org/1999/xhtml">
          <div class="node-content"><i class="fa fa-user-o"></i> User</div>
        </body>
      </foreignObject>
    `;
  });

  return rectElements.concat(textElements).concat(htmlElements).join("\n");
}

function getSvgEdges(edgeLabels) {
  return edgeLabels
    .map(
      ({ points: [{ x: sx, y: sy }, { x: cx, y: cy }, { x: ex, y: ey }] }) =>
        `<path d="M ${sx},${sy} L ${cx},${cy} L ${ex},${ey}" class="edge" />`,
    )
    .join("\n");
}

/**
 * Return a new Dagre Graph with layout details
 * for the specfied nodes and edges
 */
function getDagreGraph(nodes, edges) {
  // Create a new directed graph
  const dagreGraph = new dagre.graphlib.Graph();

  // Set an empty object for the graph label
  dagreGraph.setGraph({ rankdir: "LR" });

  // Default to assigning a new object as a label for each new edge.
  dagreGraph.setDefaultEdgeLabel(() => ({}));

  // Add nodes to the graph. The first argument is the node id. The second is
  // metadata about the node. In this case we're going to add labels to each of
  // our nodes.
  for (const key in nodes) {
    const val = nodes[key];
    dagreGraph.setNode(key, val);
  }

  // Add edges to the graph.
  for (const u in edges) {
    const v = edges[u];
    dagreGraph.setEdge(u, v);
  }

  // Update graph with layout info
  dagre.layout(dagreGraph);

  return dagreGraph;
}

/**
 * Add a new <pre> block element with the specified title.
 * The specified object will be json pretty-printed
 */
function addPreBlock(title, obj) {
  // Create the <pre> element
  const preElement = document.createElement("pre");
  preElement.classList.add("panel");

  // Add content to the <pre> tag
  const prettyJson = JSON.stringify(obj, null, 2);
  preElement.innerHTML = `<strong>${title}:</strong>\n${prettyJson}`;

  // Append the <pre> tag to an existing element
  document.body.appendChild(preElement);
}

main();
