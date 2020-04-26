import assert from 'assert'

import Path from './path.js'

describe('Path Class', () => {
  it('getDuplicatedData ', () => {
    let actual = Path.getDuplicatedData([0], 3)
    let expected = [0, 0, 0]
    assert.deepStrictEqual(actual, expected)

    actual = Path.getDuplicatedData([1], 4)
    expected = [1, 1, 1, 1]
    assert.deepStrictEqual(actual, expected)

    actual = Path.getDuplicatedData([1, 2, 3], 5)
    expected = [1, 1, 2, 3, 3]
    assert.deepStrictEqual(actual, expected)

    actual = Path.getDuplicatedData([1, 2, 3], 6)
    expected = [1, 1, 2, 2, 3, 3]
    assert.deepStrictEqual(actual, expected)

    actual = Path.getDuplicatedData([1, 2, 3], 7)
    expected = [1, 1, 2, 2, 3, 3, 3]
    assert.deepStrictEqual(actual, expected)

    actual = Path.getDuplicatedData([1, 2, 3], 8)
    expected = [1, 1, 1, 2, 2, 3, 3, 3]
    assert.deepStrictEqual(actual, expected)

    actual = Path.getDuplicatedData([1, 2, 3, 4], 5)
    expected = [1, 2, 3, 4, 4]
    assert.deepStrictEqual(actual, expected)

    actual = Path.getDuplicatedData([1, 2, 3, 4], 6)
    expected = [1, 1, 2, 3, 4, 4]
    assert.deepStrictEqual(actual, expected)

    actual = Path.getDuplicatedData([1, 2, 3, 4], 11)
    expected = [1, 1, 1, 2, 2, 3, 3, 3, 4, 4, 4]
    assert.deepStrictEqual(actual, expected)
  })
})
