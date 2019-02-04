let selectWinnerBtn = document.getElementById( 'selectWinnerBtn' )
let message = document.getElementById( 'message' )

chrome.storage.sync.get( 'message', function( data ) {
  if ( data.message ){
    message.innerText = data.message
  }
})

chrome.runtime.onMessage.addListener(
  function( request, sender, sendResponse ) {
    if ( request.message && request.message.length ) {
      document.getElementById( 'message' ).innerHTML = request.message
    }
    sendResponse({})
  }
)

selectWinnerBtn.onclick = function() {
  chrome.storage.sync.set({
    instagram_contest_winner_extension_message: ''
  }, function() {
    message.innerText = ''
  })
  chrome.tabs.query({
    active: true,
    currentWindow: true
  }, function( tabs ) {
    chrome.tabs.executeScript( tabs[0].id, {
      file: 'instagram_contest_winner.js'
    })
  })
}
