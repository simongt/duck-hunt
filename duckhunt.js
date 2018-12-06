// TO-DO: create landing page or modal to (indicate) start game (add difficulty levels?)

// TO-DO: animate the classic dog intro

// TO-DO: create button to toggle sound (enable/disable)

// TO-DO: implement asynchronous code, instead of callback hell (setInterval and setTimeout) https://medium.com/front-end-hacking/callbacks-promises-and-async-await-ad4756e01d90

/* The window object in JavaScript has an event handler called onload. When this event handler is used, the entire page and all of its related files and components are loaded before the function listed in the onload event handler is executed, hence the term 'on load.' */
window.onload = () => {

  const game_start = new Audio('audio/start-round.mp3');
  game_start.play();

  function createDog() {
    const dog = document.createElement('div');

    let target = (window.innerWidth - 200) / 2;
    let current = -200;
    let timeMultiplier = 1;

    dog.classList.add('dog');
    dog.style.top = `0`;
    dog.style.left = `-171px`;

    document.body.append(dog);

    setInterval(() => {
      setInterval(() => {
        setTimeout(() => {
          let dogReachedMiddle = current > target;
          if (!dogReachedMiddle) {
            dog.classList.add("sniff");
          } else {
            setTimeout(() => {
              dog.classList.add(`surprise`);
            }, 0);
            setTimeout(() => {
              dog.classList.remove(`surprise`);
              dog.classList.add(`leap-into-bushes`);
            }, 1000);
            setTimeout(() => {
              // dog.classList.remove(`leap-into-bushes`);
              dog.parentNode.removeChild(dog);
            }, 1500);
            clearInterval();
          }
        }, timeMultiplier * 0);
        setTimeout(() => {
          let dogReachedMiddle = current > target;
          if (!dogReachedMiddle) {
            dog.classList.remove("sniff");
          } else {
            setTimeout(() => {
              dog.classList.add(`surprise`);
            }, 0);
            setTimeout(() => {
              dog.classList.remove(`surprise`);
              dog.classList.add(`leap-into-bushes`);
            }, 1000);
            setTimeout(() => {
              // dog.classList.remove(`leap-into-bushes`);
              dog.parentNode.removeChild(dog);
            }, 1500);
            clearInterval();
          }
        }, timeMultiplier * 100);
        setTimeout(() => {
          let dogReachedMiddle = current > target;
          if (!dogReachedMiddle) {
            current += 20;
            dog.style.left = `${current}px`;
            dog.classList.add('lift-left-leg');
          } else {
            setTimeout(() => {
              dog.classList.add(`surprise`);
            }, 0);
            setTimeout(() => {
              dog.classList.remove(`surprise`);
              dog.classList.add(`leap-into-bushes`);
            }, 1000);
            setTimeout(() => {
              // dog.classList.remove(`leap-into-bushes`);
              dog.parentNode.removeChild(dog);
            }, 1500);
            clearInterval();
          }
        }, timeMultiplier * 200);
        setTimeout(() => {
          let dogReachedMiddle = current > target;
          if (!dogReachedMiddle) {
            current += 20;
            dog.style.left = `${current}px`;
            dog.classList.remove('lift-left-leg');
          } else {
            setTimeout(() => {
              dog.classList.add(`surprise`);
            }, 0);
            setTimeout(() => {
              dog.classList.remove(`surprise`);
              dog.classList.add(`leap-into-bushes`);
            }, 1000);
            setTimeout(() => {
              // dog.classList.remove(`leap-into-bushes`);
              dog.parentNode.removeChild(dog);
            }, 1500);
            clearInterval();
          }
        }, timeMultiplier * 300);
        setTimeout(() => {
          let dogReachedMiddle = current > target;
          if (!dogReachedMiddle) {
            current += 20;
            dog.style.left = `${current}px`;
            dog.classList.add('lift-right-leg');
          } else {
            setTimeout(() => {
              dog.classList.add(`surprise`);
            }, 0);
            setTimeout(() => {
              dog.classList.remove(`surprise`);
              dog.classList.add(`leap-into-bushes`);
            }, 1000);
            setTimeout(() => {
              // dog.classList.remove(`leap-into-bushes`);
              dog.parentNode.removeChild(dog);
            }, 1500);
            clearInterval();
          }
        }, timeMultiplier * 400);
        setTimeout(() => {
          let dogReachedMiddle = current > target;
          if (!dogReachedMiddle) {
            current += 20;
            dog.style.left = `${current}px`;
            dog.classList.remove('lift-right-leg');
          } else {
            setTimeout(() => {
              dog.classList.add(`surprise`);
            }, 0);
            setTimeout(() => {
              dog.classList.remove(`surprise`);
              dog.classList.add(`leap-into-bushes`);
            }, 1000);
            setTimeout(() => {
              // dog.classList.remove(`leap-into-bushes`);
              dog.parentNode.removeChild(dog);
            }, 1500);
            clearInterval();
          }
        }, timeMultiplier * 500);
        setTimeout(() => {
          let dogReachedMiddle = current > target;
          if (!dogReachedMiddle) {
            dog.classList.add("sniff");
          } else {
            setTimeout(() => {
              dog.classList.add(`surprise`);
            }, 0);
            setTimeout(() => {
              dog.classList.remove(`surprise`);
              dog.classList.add(`leap-into-bushes`);
            }, 1000);
            setTimeout(() => {
              // dog.classList.remove(`leap-into-bushes`);
              dog.parentNode.removeChild(dog);
            }, 1500);
            clearInterval();
          }
        }, timeMultiplier * 700);
        setTimeout(() => {
          let dogReachedMiddle = current > target;
          if (!dogReachedMiddle) {
            dog.classList.remove("sniff");
          } else {
            setTimeout(() => {
              dog.classList.add(`surprise`);
            }, 0);
            setTimeout(() => {
              dog.classList.remove(`surprise`);
              dog.classList.add(`leap-into-bushes`);
            }, 1000);
            setTimeout(() => {
              // dog.classList.remove(`leap-into-bushes`);
              dog.parentNode.removeChild(dog);
            }, 1500);
            clearInterval();
          }
        }, timeMultiplier * 800);
      }, timeMultiplier * 900);
    }, 1200);

    let backgroundIsScaledUp;
    setInterval(() => {
      backgroundIsScaledUp = window.innerHeight > 558;
      if (backgroundIsScaledUp) {
        dog.style.top = `72vh`;
      } else {
        dog.style.top = `${window.innerHeight - 200}px`;
      }
    }, 100);
    
    return dog;
  };

  createDog();

  // duck generator function
  function createDuck() {
    // create a div container for the duck
    // add the 'duck' class to it
    // append it to the body
    const duck = document.createElement('div');
    duck.classList.add('duck');
    document.body.append(duck);

    // toggle the 'flap' class on the duck every 200 ms (1/5 second)
    setInterval(() => {
      duck.classList.toggle('flap');
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
      // add and remove the 'right' class to the duck based on the direction the duck is flying, thus shifting the direction the duck is facing
      if (lateralPosition < newLateralPosition) {
        duck.classList.add('right');
      } else {
        duck.classList.remove('right');
      }
      // update position of duck to new coordinates
      duck.style.top = `${newMedialPosition}px`;
      duck.style.left = `${newLateralPosition}px`;
    }, (Math.random() * 1500) + 500);

    // attach a 'click' event handler that adds the 'shot' class to the duck when you click on it!
    duck.addEventListener('click', (event) => {
      event.target.classList.add('shot');
      setTimeout(() => {
        duck.parentNode.removeChild(duck);
        checkForWinner();
      }, 500);
    });

    return duck;
  }
  // read the DOM to see if there are any ducks left

  function checkForWinner() {
    const ducks = document.querySelectorAll('.duck');

    console.log(ducks, ducks.length);

    if (ducks.length === 0) {
      alert('You Win! Press OK to play again.');
      for (let i = 0; i < (Math.random() * 7) + 3; i++) {
        createDuck();
      }
    }

  }

  // BONUS: The ducks are moving pretty erratically, can you think
  // of a way to adjust the ducks speed based on how far needs to move?

  // creates random number of ducks from 3 to 10
  for (let i = 0; i < (Math.random() * 7) + 3; i++) {
    setTimeout(() => {
      createDuck();
    }, 6000);
  }

  // FIN. You win 1 trillion tokens.  Play the day away!
};
