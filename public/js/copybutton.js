function init () {
  var buttons = document.querySelectorAll('.copy-button')
  var clipboard = new ClipboardJS(buttons)
  clipboard.on('success', function(e) {
      e.trigger.disabled = true
      e.trigger.innerHTML = 'Kopiert'
  })
  clipboard.on('error', function(e) {
      alert('Bruk ctrl + c for å kopiere det merkede området')
  })
}

function ready (fn) {
  if (document.readyState != 'loading'){
    fn()
  } else {
    document.addEventListener('DOMContentLoaded', fn)
  }
}

ready(init)