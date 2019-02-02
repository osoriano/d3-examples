const NODE_RE = /^[1-9]\d*$/
const DEBOUNCE = 1000
const DELIMITER = ':'


export default class Header {
  constructor(onInput, onExampleData) {
    this.onInput = onInput
    this.onExampleData = onExampleData

    this.inputDisabled = false
    this.debounceTimeout = null
    this.onDebounceValidate = this.onDebounceValidate.bind(this)

    $( 'form' ).submit(this.onSubmit.bind(this))
    $( 'input' ).on('input', this.onInputChange.bind(this))
    $( 'form button' ).mousedown(this.preventButtonFocus)

    $( '#help-btn' ).click(this.help)
    $( '#example-data-btn' ).click(this.onExampleDataClick.bind(this))

    $( '#help-btn' ).mousedown(this.preventButtonFocus)
    $( '#example-data-btn' ).mousedown(this.preventButtonFocus)
  }

  onSubmit() {
    if (!this.inputDisabled) {
      this.validateInput(true, true)
    }
    return false
  }

  onInputChange() {
    this.validateInput(false, false)
  }

  onDebounceValidate() {
    this.validateInput(true, false)
  }

  /**
   * showErrors  - if validation fails, show error now
   *               else defer error to debounce timeout
   * submitInput - if validation fails, show notification
   */
  validateInput(showErrors, submitInput) {
    clearTimeout(this.debounceTimeout)

    const val = $( 'input' ).val()
    const nodes = val.split(DELIMITER)
    if (nodes.length === 0) {
        this.onInputError(showErrors, submitInput)
        return
    }

    for (const [i, node] of nodes.entries()) {
        if (!this.validateNode(i, node, nodes)) {
          this.onInputError(showErrors, submitInput)
          return
        }
    }
    this.onInputSuccess(submitInput)
  }

  validateNode(i, node, nodes) {
    return (
      NODE_RE.test(node) &&
      node.length === i + 1 &&
      (i === 0 || node.startsWith(nodes[i - 1]))
    )
  }

  onInputError(showErrors, submitInput) {
    if (showErrors) {
      $( 'form' ).addClass('has-error')
      $( 'form button' ).addClass('disabled')
      $( 'form button' ).removeClass('hvr-radial-out')
      if (submitInput) {
        toastr.error('Invalid input')
      }
    } else {
      this.debounceTimeout = setTimeout(this.onDebounceValidate, DEBOUNCE)
    }
  }

  onInputSuccess(submitInput) {
    $( 'form' ).removeClass('has-error')
    $( 'form button' ).removeClass('disabled')
    $( 'form button' ).addClass('hvr-radial-out')
    if (submitInput && this.onInput($( 'input' ).val().split(DELIMITER))) {
      $( 'input' ).val('')
    }
  }


  async onExampleDataClick() {
    this.disableInput()
    const width = $('#example-data-btn').outerWidth()
    const leftPos = $('#example-data-btn').position().left
    const leftExampleBtn = -(width + leftPos + 20) + 'px'
    const leftHelpBtnMargin = parseInt($( '#help-btn' ).css('margin-left'))
    const leftHelpBtn = -(width + leftHelpBtnMargin + 4) + 'px'
    $( '#example-data-btn' ).animate({left: leftExampleBtn, opacity: 0})
    $( '#help-btn' ).animate({left: leftHelpBtn})
    await this.onExampleData()
    this.enableInput()
  }

  disableInput() {
    $( 'input' ).attr('disabled', true)
    $( 'form button' ).addClass('busy')
    this.inputDisabled = true
  }


  enableInput() {
    $( 'input' ).removeAttr('disabled')
    $( 'form button' ).removeClass('busy')
    this.inputDisabled = false
  }

  help() {
    $( '#modal' ).modal()
  }

  preventButtonFocus(ev) {
    ev.stopPropagation()
    ev.preventDefault()
  }
}
