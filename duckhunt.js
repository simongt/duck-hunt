$(function () {
  // play sound for start of round
  // let $startSound = $('<audio>').css('src','audio/start-round.mp3');
  // $startSound.play();
  
  // grab the <body></body>
  const $body = $('body');
  // set number of ducks to appear on screen
  const numDucks = 5;
  // create however many ducks
  for(let i = 0; i < numDucks; i++) {
    let $newDuck = createDuck();
  }

  // create a duck that flaps it wings as it flies around the window until it gets shot (clicked)
  function createDuck() {
    // create a <div> with the class "duck" and add it to the body.
    let $newDuck = $('<div>');
    $newDuck.addClass('duck');

    // each time a duck is created, it appears in a random location
    let startPosition = randomPosition();
    $newDuck.css('left', startPosition.left);
    $newDuck.css('top', startPosition.top);

    // click handler: listen for clicks on ducks and treat as a duck shot
    let shootDuck = $newDuck.click(function(){
      // tinkered around with $('body') to find remaining ducks ¯\_(ツ)_/¯
      const ducksRemaining = $('body').children(0).length - 2;
      console.log(`Duck shot, ${ ducksRemaining } more to go.`);
      // add the shot class to the duck when it's clicked
      // automatically toggles image according to CSS specs
      $newDuck.addClass('shot');
      // disable any more clicks on a duck after it's been shot
      shootDuck.off();
      setTimeout(function () {
        // remove shot duck from the DOM after short delay
        $newDuck.remove();
        if (checkForWinner()) {
          alert("Winner, winner! Duck dinner.");
          $body.reset();
        }
      }, 250);
    });

    flapWings($newDuck);
    
    flyDuckFly($newDuck);

    $newDuck.appendTo($body);

    return $newDuck;
  }

  // toggle the "flap" class on the duck
  function flapWings($duck) {
    setInterval(function () {
      $duck.toggleClass('flap');
    }, 175);
  }

  // return a random pixel position within the window as pair of coordinates
  function randomPosition() {
    const left = Math.random() * window.innerWidth;
    const top = Math.random() * window.innerHeight;
    return {
      left,
      top
    };
  }

  // set a new target position for duck to move to
  function moveDuck($duck) {
    const newPosition = randomPosition();
    $duck.css('left', newPosition.left);
    $duck.css('top', newPosition.top);
  }

  // move duck to a different location every second
  function flyDuckFly($duck) {
    setInterval(function () {
      moveDuck($duck);
    }, 1000);
  }
 
  // read the DOM to see if there are any ducks left
  function checkForWinner() {
    return $('body').children(0).length === 1;
    // NOTE: The following way of doing this would be incorrect!
    // return $('.duck').length === 0;
  }

  // BONUS: adjust the ducks speed based on how far it needs to move

  // BONUS: Add the "left" & "right" class to the duck based on the direction the duck is flying
  
});
