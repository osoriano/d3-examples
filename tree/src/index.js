import './index.styl'

import initHeader from './header'
import Tree from './tree'

const EXAMPLE_PATH_INTERVAL = 1000
const EXAMPLE_INPUT = [
  ['2', '23', '234'],
  ['1', '12', '123'],
  ['3', '34', '345'],
  ['2', '23', '235'],
  ['2', '23', '235', '2356', '23567', '235678']
]


function main() {
  const tree = new Tree()
  initHeader((input, cb) => tree.addPath(input, cb),
             cb => addExamplePaths(tree, cb))
}


function addExamplePaths(tree, cb) {
  const previousShowNotifications = tree.showNotifications
  tree.showNotifications = false

  EXAMPLE_INPUT.forEach((input, i) => {
    setTimeout(() => { tree.addPath(input) }, i * EXAMPLE_PATH_INTERVAL)
  })
  setTimeout(() => {
    tree.showNotifications = previousShowNotifications
    cb()
  }, (EXAMPLE_INPUT.length - 1) * EXAMPLE_PATH_INTERVAL)
}


$(() => { main() })
