/**
 * This function should work for any instagram post.
 *   Use it by opening Chrome's javascript console and pasting all of this code. (see link below)
 *   https://developers.google.com/web/tools/chrome-devtools/console/
 *
 * All comments are not immediately visible. This will automatically click the "show more" button for you.
 *   It could take some time depending on how many comments there are.
 *   Just wait, it cant go any faster using this method. ( the 250 interval is for the loading spinner, dont judge me )
 *   Once all comments have been made available, it will then choose a random commenter by username.
 *
 * Math.random() creates a random number between 0 & 1
 *   Multiply that random number by how many comments exist
 *   Round that new number down using Math.floor()
 *   Return the person at position people[ randomNumber ]
 *
 * For the sticklers out there, the reason this is so convoluted is for validation and message handling.
 *   It's users aren't programmers, instructions are logged if there is an error.
 *
 */

function instagram_contest_winner() {
  return new Promise( ( resolve ) => {

    const updateMessage = ( message ) => {
      chrome.storage.sync.get( 'message', function() {
        chrome.runtime.sendMessage({
          message: message
        })
      })
    }

    const clearMessage = () => {
      chrome.storage.sync.set({
        instagram_contest_winner_extension_message: ''
      })
    }

    let { log } = console
    let { clear } = console

    const reset = ( name ) => {
      clearInterval( name )
      clearMessage()
      clear()
    }

    const interval = setInterval( () => {
      const loadMoreButtonSelector = 'body > span#react-root > section > main article ul > li:not([role="menuitem"]) button'
      const userNameSelector = 'body > span#react-root > section > main article li h3'

      const errorStyle = 'background: red; color: white; font-size: x-large'
      const infoStyle = 'background: green; color: white; font-size: x-large'

      let counter = '-'
      const urlSinglePost = /(com\/p\/.*)/

      const articleLength = document.querySelectorAll( 'article' ).length
      const commentLength = document.querySelectorAll( userNameSelector ).length
      const button = [ ...document.querySelectorAll( loadMoreButtonSelector ) ].find( el => { return el.textContent === 'Load more comments' })
      const testedUrlBool = urlSinglePost.test( window.location.href )

      if ( testedUrlBool && articleLength > 1 ) {
        reset( interval )

        updateMessage( `
          <p>Please reload the page to isolate the image, then re-run the script.</p>
        ` )

        return log( '%cPlease reload the page to isolate the image, then re-run the script.', infoStyle )
      } else if ( testedUrlBool && commentLength === 0 ) {
        reset( interval )

        return makeFunOfScriptRunner()
      } else if ( articleLength > 1 || commentLength === 0 ) {
        reset( interval )
        log( '%cThis script only works on isolated images, please navigate directly to a single image', errorStyle )
        updateMessage( `
          <p>This script only works on isolated images, please navigate directly to a single image</p>
          <p>For example:</p>
          <p>
            <a href="https://www.instagram.com/p/BRWAyEQjEeB/">https://www.instagram.com/p/BRWAyEQjEeB/</a>
          </p>
        ` )

        return log( '%cFor example:\nhttps://www.instagram.com/p/BRWAyEQjEeB/', 'font-size: x-large' )
      } else if ( button ) {
        clear() // super cool loading spinner, dont judge me
        clearMessage() // super cool loading spinner, dont judge me
        counter==='-'?counter='/':counter==='/'?counter='- ':counter==='- '?counter='\\':counter==='\\'&&( counter='-' )
        log( `Loading... ${counter}` )
        updateMessage( `
          <p>Loading... ${counter}</p>
        ` )

        return button.click()
      } else {
        reset( interval )

        return isolateUsernames( [ ...document.querySelectorAll( userNameSelector ) ] )
      }
    }, 250 )

    const isolateUsernames = ( peopleList ) => {
      let userNames = []
      peopleList.map( x => {
        if ( x.innerText !== document.querySelector( 'h2 a' ).innerText ) {
          userNames.push( x.innerText )
        }
      })
      const uniqueList = [ ...new Set( userNames ) ]

      return uniqueList.length ? pickWinner( uniqueList, userNames.length ) : makeFunOfScriptRunner()
    }

    const makeFunOfScriptRunner = () => {
      const errorStyle = 'background: red; color: white; font-size: x-large'
      log( '%cSeriously?', errorStyle )
      log( '%cThere are clearly no comments.', errorStyle )
      updateMessage( `
        <p>Seriously? There are clearly no comments.</p>
        <a href="https://www.youtube.com/watch?v=vXXHISsnQl4">
          https://www.youtube.com/watch?v=vXXHISsnQl4
        </a>
      ` )

      return log( '%chttps://www.youtube.com/watch?v=vXXHISsnQl4', 'font-size: x-large' )
    }

    const pickWinner = ( people, totalComments ) => {
    // pick the winner! peow peow peeooowwww
      const successStyle = 'background: #ffd052; color: black; font-size: x-large'
      const num = people.length
      const WINNER = people[Math.floor( Math.random()*num )]
      reset( interval )
      log( `${totalComments - people.length} duplicate commenters removed` )
      log( `%cAnd the randomly selected winner out of ${num} ${num === 1 ? 'entry' : 'entries'} is...\n\n${WINNER.toUpperCase()} !!!!`, successStyle )
      log( `%chttps://www.instagram.com/${WINNER}/`, 'font-size: large' )
      resolve(
        updateMessage( `
          <p>And the randomly selected winner out of ${num} ${num === 1 ? 'entry' : 'entries'} is...</p>
          <h1>
            <a href="https://www.instagram.com/${WINNER}/">${WINNER.toUpperCase()} !!!!</a>
          </h1>
        ` )
      )
    }
  })
}

instagram_contest_winner().then( () => {
  chrome.storage.sync.get( 'message', function( data ) {
    chrome.runtime.sendMessage({
      message: data.message
    })
  })
})
