/**
 * Duck Hunt Game - Classic Nintendo Game Clone
 * 
 * This is a vanilla JavaScript implementation of the classic Duck Hunt game.
 * The game features animated ducks, a hunting dog, and click-to-shoot mechanics.
 * 
 * @author Unknown
 * @version 1.0.0
 * @since 2023
 */

// TODO: create landing page or modal to (indicate) start game (add difficulty levels?)
// TODO: animate the classic dog intro
// TODO: create button to toggle sound (enable/disable)
// TODO: implement asynchronous code, instead of callback hell (setInterval and setTimeout) 
// https://medium.com/front-end-hacking/callbacks-promises-and-async-await-ad4756e01d90

/**
 * Main game initialization function
 * Executes when the window loads to set up the game environment
 * 
 * ANTI-PATTERN: Using window.onload instead of DOMContentLoaded or modern event listeners
 * ANTI-PATTERN: No error handling for audio loading
 * ANTI-PATTERN: Global scope pollution with all game logic
 */
window.onload = () => {
  // Initialize game audio
  const game_start = new Audio('audio/start-round.mp3');
  game_start.play(); // ANTI-PATTERN: No error handling for audio failure

  /**
   * Creates and animates the hunting dog character
   * 
   * The dog walks across the screen, sniffs, and then leaps into bushes
   * 
   * ANTI-PATTERNS:
   * - Massive callback hell with nested setInterval/setTimeout
   * - Hardcoded pixel values and magic numbers
   * - No cleanup of intervals (memory leak)
   * - Repetitive code blocks
   * - DOM manipulation without error handling
   * 
   * @returns {HTMLElement} The created dog element
   */
  function createDog() {
    const dog = document.createElement('div');

    // Calculate dog movement parameters
    let target = (window.innerWidth - 171) / 2; // ANTI-PATTERN: Magic number 171
    let current = -171;
    let timeMultiplier = 1;

    // Set up dog element
    dog.classList.add('dog');
    dog.style.top = `0`;
    dog.style.left = `-171px`;

    document.body.append(dog);

    // ANTI-PATTERN: Nested setInterval creates callback hell
    // This entire block should be refactored into a state machine or animation system
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

    // ANTI-PATTERN: Another setInterval for responsive positioning
    // This should use ResizeObserver or CSS media queries instead
    let backgroundIsScaledUp;
    setInterval(() => {
      backgroundIsScaledUp = window.innerHeight > 558; // ANTI-PATTERN: Magic number
      if (backgroundIsScaledUp) {
        dog.style.top = `72vh`;
      } else {
        dog.style.top = `${window.innerHeight - 200}px`; // ANTI-PATTERN: Magic number
      }
    }, 100);
    
    return dog;
  };

  createDog();

  /**
   * Creates and manages a single duck in the game
   * 
   * Each duck has random movement patterns, flapping animation, and click-to-shoot functionality
   * 
   * ANTI-PATTERNS:
   * - Multiple setInterval calls without cleanup
   * - Random movement without collision detection
   * - No duck lifecycle management
   * - Direct DOM manipulation in event handlers
   * 
   * @returns {HTMLElement} The created duck element
   */
  function createDuck() {
    // Create duck element
    const duck = document.createElement('div');
    duck.classList.add('duck');
    document.body.append(duck);

    // ANTI-PATTERN: setInterval without cleanup - memory leak
    // Toggle the 'flap' class on the duck every 200 ms (1/5 second)
    setInterval(() => {
      duck.classList.toggle('flap');
    }, (Math.random() * 200) + 100);

    // Initialize duck position
    let medialPosition = Math.random() * window.innerHeight;
    let lateralPosition = Math.random() * window.innerWidth;
    duck.style.top = `${medialPosition}px`;
    duck.style.left = `${lateralPosition}px`;

    // ANTI-PATTERN: Another setInterval without cleanup
    // Move the duck to a new location every second or so
    // Ducks keep moving by using setInterval instead of setTimeout
    setInterval(() => {
      const newMedialPosition = Math.random() * window.innerHeight;
      const newLateralPosition = Math.random() * window.innerWidth;
      
      // Update duck direction based on movement
      if (lateralPosition < newLateralPosition) {
        duck.classList.add('right');
      } else {
        duck.classList.remove('right');
      }
      
      // Update position
      duck.style.top = `${newMedialPosition}px`;
      duck.style.left = `${newLateralPosition}px`;
    }, (Math.random() * 1500) + 500);

    // ANTI-PATTERN: Direct DOM manipulation in event handler
    // Attach click event handler for shooting
    duck.addEventListener('click', (event) => {
      event.target.classList.add('shot');
      setTimeout(() => {
        duck.parentNode.removeChild(duck);
        checkForWinner();
      }, 500);
    });

    return duck;
  }

  /**
   * Checks if all ducks have been shot and handles win condition
   * 
   * ANTI-PATTERNS:
   * - Uses alert() for user interaction (blocking, poor UX)
   * - No game state management
   * - Hardcoded duck count range
   * 
   * @returns {void}
   */
  function checkForWinner() {
    const ducks = document.querySelectorAll('.duck');

    console.log(ducks, ducks.length);

    if (ducks.length === 0) {
      // ANTI-PATTERN: Blocking alert dialog
      alert('You Win! Press OK to play again.');
      // ANTI-PATTERN: Hardcoded duck count range
      for (let i = 0; i < (Math.random() * 7) + 3; i++) {
        createDuck();
      }
    }
  }

  // BONUS: The ducks are moving pretty erratically, can you think
  // of a way to adjust the ducks speed based on how far needs to move?

  // ANTI-PATTERN: Hardcoded initial duck count
  // Creates random number of ducks from 3 to 10
  for (let i = 0; i < (Math.random() * 7) + 3; i++) {
    setTimeout(() => {
      createDuck();
    }, 6500); // ANTI-PATTERN: Magic number delay
  }

  // FIN. You win 1 trillion tokens. Play the day away!
};
