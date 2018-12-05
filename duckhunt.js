/* The window object in JavaScript has an event handler called onload. When this event handler is used, the entire page and all of its related files and components are loaded before the function listed in the onload event handler is executed, hence the term "on load." */
window.onload = () => {

  // TO-DO: create landing page or modal to start game (add difficulty levels?)

  // TO-DO: animate the classic dog intro

  // TO-DO: create button to toggle sound (enable/disable)

  // const game_start = new Audio("audio/start-round.mp3");
  // game_start.play();

  // duck generator function
  function createDuck() {
    // create a div container for the duck
    // add the "duck" class to it
    // append it to the body
    const duck = document.createElement("div");
    duck.classList.add("duck");
    document.body.append(duck);

    // toggle the "flap" class on the duck every 200 ms (1/5 second)
    setInterval(() => {
      duck.classList.toggle("flap");
    }, (Math.random() * 200) + 100);

    // move the newly created duck to a random location
    let medialPosition = Math.random() * window.innerHeight;
    let lateralPosition = Math.random() * window.innerWidth;
    duck.style.top = `${medialPosition}px`;
    duck.style.left = `${lateralPosition}px`;

    // move the duck to a new location every second or so
    // ducks keep moving by using setInterval instead of setTimeout
    setInterval(() => {
      const newMedialPosition = Math.random() * window.innerHeight;
      const newLateralPosition = Math.random() * window.innerWidth;
      // add and remove the "right" class to the duck based on the direction the duck is flying, thus shifting the direction the duck is facing
      if (lateralPosition < newLateralPosition) {
        duck.classList.add("right");
      } else {
        duck.classList.remove("right");
      }
      // update position of duck to new coordinates
      duck.style.top = `${newMedialPosition}px`;
      duck.style.left = `${newLateralPosition}px`;
    }, (Math.random() * 1500) + 500);

    // attach a "click" event handler that adds the "shot" class to the duck when you click on it!
    duck.addEventListener("click", function (event) {
      event.target.classList.add("shot");
      setTimeout(() => {
        duck.parentNode.removeChild(duck);
        checkForWinner();
      }, 500);
    });

    return duck;
  }
  // read the DOM to see if there are any ducks left

  function checkForWinner() {
    const ducks = document.querySelectorAll(".duck");

    console.log(ducks, ducks.length);

    if (ducks.length === 0) {
      alert("You Win! Press OK to play again.");
      for (let i = 0; i < (Math.random() * 7) + 3; i++) {
        createDuck();
      }
    }

  }

  // BONUS: The ducks are moving pretty erratically, can you think
  // of a way to adjust the ducks speed based on how far needs to move?

  // creates random number of ducks from 3 to 10
  for (let i = 0; i < (Math.random() * 7) + 3; i++) {
    createDuck();
  }

  // FIN. You win 1 trillion tokens.  Play the day away!
};
