import Tree from "./chart/index.js";

const EXAMPLE_PATH_INTERVAL = 1000;
const EXAMPLE_INPUT = ["234", "123", "345", "235", "235678"];
let nodeId = 1;

function addPath(root, path) {
  let expandFrom;
  for (const name of path) {
    if (!root.children) {
      root.children = {};
    }
    if (name in root.children) {
      root = root.children[name];
    } else {
      if (!expandFrom) {
        /* This is the first node to be created.
         * Descendants will expand from this node. */
        expandFrom = root;
      }
      const node = { name, id: nodeId++, expandFrom };
      root.children[name] = node;
      root = node;
    }
  }
}

function main() {
  const root = {
    name: "",
    id: nodeId++,
  };
  const tree = new Tree().root(root);

  /* Initial render */
  d3.select("#chart").call(tree.draw);

  let i = 0;

  /* Updates */
  function updateData() {
    if (i >= EXAMPLE_INPUT.length) {
      return;
    }
    const path = EXAMPLE_INPUT[i];
    addPath(root, path);
    tree.root(root);
    i += 1;
    setTimeout(updateData, EXAMPLE_PATH_INTERVAL);
  }
  setTimeout(updateData, EXAMPLE_PATH_INTERVAL);
}

main();
