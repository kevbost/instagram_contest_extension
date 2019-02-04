chrome.runtime.onInstalled.addListener( function() {
  chrome.storage.sync.set({
    instagram_contest_winner_extension_message: ''
  })
  chrome.declarativeContent.onPageChanged.removeRules( undefined, function() {
    chrome.declarativeContent.onPageChanged.addRules( [{
      conditions: [
        new chrome.declarativeContent.PageStateMatcher({
          pageUrl: {
            hostContains: '.instagram.com'
          }
        })
      ],
      actions: [ new chrome.declarativeContent.ShowPageAction() ]
    }] )
  })
})
