import Header from './header.js'
import Tree from './tree.js'

const EXAMPLE_PATH_INTERVAL = 1000
const EXAMPLE_INPUT = [
  ['2', '23', '234'],
  ['1', '12', '123'],
  ['3', '34', '345'],
  ['2', '23', '235'],
  ['2', '23', '235', '2356', '23567', '235678'],
]

class Main {
  constructor() {
    this.tree = new Tree()
    this.header = new Header(
      this.onInput.bind(this),
      this.onExampleData.bind(this)
    )
  }

  onInput(input) {
    return this.tree.addPath(input)
  }

  onExampleData() {
    return new Promise((resolve) => {
      const previousShowNotifications = this.tree.showNotifications
      this.tree.showNotifications = false

      EXAMPLE_INPUT.forEach((input, i) => {
        setTimeout(() => {
          this.tree.addPath(input)
        }, i * EXAMPLE_PATH_INTERVAL)
      })

      setTimeout(() => {
        this.tree.showNotifications = previousShowNotifications
        resolve()
      }, (EXAMPLE_INPUT.length - 1) * EXAMPLE_PATH_INTERVAL)
    })
  }
}

new Main()
