import './index.styl'

const DEBOUNCE = 1000
const DELIMITER = ':'

let debounceTimeout = null
let inputDisabled = false

export default function init(inputCb, exampleDataCb) {
  $( 'form' ).submit(ev => submitForm(ev, inputCb))
  $( 'input' ).on('input', () => validateInput(false))
  $( 'form button' ).mousedown(preventButtonFocus)

  $( '#help-btn' ).click(help)
  $( '#example-data-btn' ).click(() => addExampleData(exampleDataCb))

  $( '#help-btn' ).mousedown(preventButtonFocus)
  $( '#example-data-btn' ).mousedown(preventButtonFocus)
}


function disableInput() {
  $( 'input' ).attr('disabled', true)
  $( 'form button' ).addClass('busy')
  inputDisabled = true
}


function enableInput() {
  $( 'input' ).removeAttr('disabled')
  $( 'form button' ).removeClass('busy')
  inputDisabled = false
}


function addExampleData(exampleDataCb) {
  disableInput()
  const width = $('#example-data-btn').outerWidth()
  const leftPos = $('#example-data-btn').position().left
  const leftExampleBtn = -(width + leftPos + 20) + 'px'
  const leftHelpBtnMargin = parseInt($( '#help-btn' ).css('margin-left'))
  const leftHelpBtn = -(width + leftHelpBtnMargin + 4) + 'px'
  $( '#example-data-btn' ).animate({left: leftExampleBtn, opacity: 0})
  $( '#help-btn' ).animate({left: leftHelpBtn})
  exampleDataCb(enableInput)
}

function help() {
  $( '#modal' ).modal()
}

function preventButtonFocus(ev) {
  ev.stopPropagation()
  ev.preventDefault()
}

function submitForm(ev, inputCb) {
  if (!inputDisabled) {
    validateInput(true, inputCb)
  }
  return false
}


function onInputError(showErrors, inputCb) {
  if (showErrors) {
    $( 'form' ).addClass('has-error')
    $( 'form button' ).addClass('disabled')
    $( 'form button' ).removeClass('hvr-radial-out')
    if (inputCb) {
      toastr.error('Invalid input')
    }
  } else {
    debounceTimeout = setTimeout(() => validateInput(true), DEBOUNCE)
  }
}


function onInputSuccess(inputCb) {
  $( 'form' ).removeClass('has-error')
  $( 'form button' ).removeClass('disabled')
  $( 'form button' ).addClass('hvr-radial-out')
  if (inputCb) {
    inputCb($( 'input' ).val().split(DELIMITER), err => {
      if (!err) {
        $( 'input' ).val('')
      }
    })
  }
}


function validateInput(showErrors, inputCb) {
  clearTimeout(debounceTimeout)

  const val = $( 'input' ).val()
  const nodes = val.split(DELIMITER)
  if (nodes.length === 0) {
      onInputError(showErrors, inputCb)
      return
  }

  for (let entry of nodes.entries()) {
      const [i, node] = entry
      if (/^[1-9]\d*$/.test(node) && node.length === i + 1 &&
          (i === 0 || node.startsWith(nodes[i - 1]))) {
          continue
      }
      onInputError(showErrors, inputCb)
      return
  }
  onInputSuccess(inputCb)
}
