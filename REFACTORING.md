# Duck Hunt Game Refactoring Guide

## Overview

This document provides a comprehensive refactoring plan to modernize the Duck Hunt game from its current vanilla JavaScript implementation to a production-ready, maintainable codebase. The refactoring follows industry best practices and addresses all identified anti-patterns.

## Phase 1: Immediate Fixes (Week 1)

### 1.1 Fix Memory Leaks

#### Current Problem
```javascript
// ANTI-PATTERN: Unmanaged intervals
setInterval(() => {
  duck.classList.toggle('flap');
}, (Math.random() * 200) + 100);
```

#### Solution: Add Cleanup Mechanism
```javascript
class Duck {
  constructor() {
    this.element = document.createElement('div');
    this.intervals = [];
    this.setupAnimations();
  }

  setupAnimations() {
    // Store interval reference for cleanup
    const flapInterval = setInterval(() => {
      this.element.classList.toggle('flap');
    }, (Math.random() * 200) + 100);
    
    this.intervals.push(flapInterval);
  }

  destroy() {
    // Clean up all intervals
    this.intervals.forEach(interval => clearInterval(interval));
    this.element.remove();
  }
}
```

### 1.2 Extract Configuration

#### Current Problem
```javascript
// ANTI-PATTERN: Magic numbers scattered throughout
let target = (window.innerWidth - 171) / 2;
backgroundIsScaledUp = window.innerHeight > 558;
```

#### Solution: Centralized Configuration
```javascript
const GAME_CONFIG = {
  sprites: {
    dog: {
      width: 171,
      height: 150,
      positions: {
        default: { x: -24, y: 0 },
        sniff: { x: -207, y: 0 },
        surprise: { x: -747, y: 0 }
      }
    },
    duck: {
      width: 110,
      height: 115,
      positions: {
        left: { x: -100, y: -160 },
        right: { x: -200, y: -160 },
        flap: { x: -430, y: -160 }
      }
    }
  },
  game: {
    initialDuckCount: { min: 3, max: 10 },
    dogIntroDelay: 6500,
    shotDelay: 500,
    animationSpeed: { min: 100, max: 300 }
  },
  responsive: {
    breakpoint: 558,
    dogOffset: 200
  }
};
```

### 1.3 Add Error Handling

#### Current Problem
```javascript
// ANTI-PATTERN: No error handling
const game_start = new Audio('audio/start-round.mp3');
game_start.play();
```

#### Solution: Comprehensive Error Handling
```javascript
class AudioManager {
  constructor() {
    this.audioCache = new Map();
  }

  async loadAudio(src) {
    try {
      const audio = new Audio(src);
      await new Promise((resolve, reject) => {
        audio.addEventListener('canplaythrough', resolve);
        audio.addEventListener('error', reject);
        audio.load();
      });
      this.audioCache.set(src, audio);
      return audio;
    } catch (error) {
      console.error(`Failed to load audio: ${src}`, error);
      return null;
    }
  }

  async play(src) {
    const audio = this.audioCache.get(src) || await this.loadAudio(src);
    if (audio) {
      try {
        await audio.play();
      } catch (error) {
        console.error(`Failed to play audio: ${src}`, error);
      }
    }
  }
}
```

### 1.4 Replace Alert Dialogs

#### Current Problem
```javascript
// ANTI-PATTERN: Blocking alert
alert('You Win! Press OK to play again.');
```

#### Solution: Modal Component
```javascript
class GameModal {
  constructor() {
    this.modal = this.createModal();
  }

  createModal() {
    const modal = document.createElement('div');
    modal.className = 'game-modal';
    modal.innerHTML = `
      <div class="modal-content">
        <h2 class="modal-title"></h2>
        <p class="modal-message"></p>
        <button class="modal-button">OK</button>
      </div>
    `;
    return modal;
  }

  show(title, message, onConfirm) {
    this.modal.querySelector('.modal-title').textContent = title;
    this.modal.querySelector('.modal-message').textContent = message;
    this.modal.querySelector('.modal-button').onclick = () => {
      this.hide();
      onConfirm?.();
    };
    document.body.appendChild(this.modal);
  }

  hide() {
    this.modal.remove();
  }
}
```

## Phase 2: Architecture Refactoring (Week 2-3)

### 2.1 Implement State Management

#### Current Problem
```javascript
// ANTI-PATTERN: DOM-based state
const ducks = document.querySelectorAll('.duck');
const isGameWon = ducks.length === 0;
```

#### Solution: State Management Class
```javascript
class GameState {
  constructor() {
    this.state = {
      gameStatus: 'loading', // loading, intro, playing, won, paused
      ducks: new Map(),
      dog: null,
      score: 0,
      round: 1,
      config: GAME_CONFIG
    };
    this.listeners = new Set();
  }

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  notify() {
    this.listeners.forEach(listener => listener(this.state));
  }

  update(updates) {
    this.state = { ...this.state, ...updates };
    this.notify();
  }

  addDuck(duck) {
    this.state.ducks.set(duck.id, duck);
    this.update({ ducks: new Map(this.state.ducks) });
  }

  removeDuck(duckId) {
    this.state.ducks.delete(duckId);
    this.update({ 
      ducks: new Map(this.state.ducks),
      score: this.state.score + 1
    });
    
    if (this.state.ducks.size === 0) {
      this.update({ gameStatus: 'won' });
    }
  }
}
```

### 2.2 Create Component Architecture

#### Current Problem
```javascript
// ANTI-PATTERN: Monolithic functions
function createDuck() {
  // 50+ lines of mixed concerns
}
```

#### Solution: Component Classes
```javascript
class Duck extends GameObject {
  constructor(id, initialState) {
    super('duck', id);
    this.state = {
      position: initialState.position,
      direction: 'left',
      isFlapping: false,
      isShot: false
    };
    this.setupAnimations();
    this.setupEventListeners();
  }

  setupAnimations() {
    this.animations = {
      flap: new AnimationController({
        duration: this.getRandomDuration(100, 300),
        onUpdate: () => this.toggleFlap()
      }),
      movement: new MovementController({
        onUpdate: (position) => this.moveTo(position)
      })
    };
  }

  setupEventListeners() {
    this.element.addEventListener('click', (e) => {
      if (!this.state.isShot) {
        this.shoot();
      }
    });
  }

  shoot() {
    this.state.isShot = true;
    this.element.classList.add('shot');
    this.animations.flap.stop();
    this.animations.movement.stop();
    
    setTimeout(() => {
      this.destroy();
    }, GAME_CONFIG.game.shotDelay);
  }

  destroy() {
    this.animations.flap.stop();
    this.animations.movement.stop();
    super.destroy();
  }
}
```

### 2.3 Implement Event System

#### Current Problem
```javascript
// ANTI-PATTERN: Direct function calls
duck.addEventListener('click', (event) => {
  // Direct manipulation
  checkForWinner();
});
```

#### Solution: Event Bus
```javascript
class EventBus {
  constructor() {
    this.events = new Map();
  }

  on(event, callback) {
    if (!this.events.has(event)) {
      this.events.set(event, []);
    }
    this.events.get(event).push(callback);
  }

  emit(event, data) {
    if (this.events.has(event)) {
      this.events.get(event).forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error(`Error in event handler for ${event}:`, error);
        }
      });
    }
  }

  off(event, callback) {
    if (this.events.has(event)) {
      const callbacks = this.events.get(event);
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  }
}

// Usage
const eventBus = new EventBus();

eventBus.on('duck:shot', (duckId) => {
  gameState.removeDuck(duckId);
});

eventBus.on('game:won', () => {
  modal.show('You Win!', 'Press OK to play again', () => {
    game.startNewRound();
  });
});
```

## Phase 3: Performance Optimization (Week 4)

### 3.1 Implement Animation System

#### Current Problem
```javascript
// ANTI-PATTERN: setInterval for animations
setInterval(() => {
  duck.style.top = `${newY}px`;
  duck.style.left = `${newX}px`;
}, 1000);
```

#### Solution: requestAnimationFrame
```javascript
class AnimationController {
  constructor(options = {}) {
    this.options = {
      duration: 1000,
      easing: 'linear',
      onUpdate: () => {},
      onComplete: () => {},
      ...options
    };
    this.isRunning = false;
    this.startTime = null;
  }

  start() {
    this.isRunning = true;
    this.startTime = performance.now();
    this.animate();
  }

  animate(currentTime = performance.now()) {
    if (!this.isRunning) return;

    const elapsed = currentTime - this.startTime;
    const progress = Math.min(elapsed / this.options.duration, 1);
    const easedProgress = this.ease(progress, this.options.easing);

    this.options.onUpdate(easedProgress);

    if (progress < 1) {
      requestAnimationFrame((time) => this.animate(time));
    } else {
      this.stop();
      this.options.onComplete();
    }
  }

  stop() {
    this.isRunning = false;
  }

  ease(progress, type) {
    switch (type) {
      case 'easeInOut':
        return progress < 0.5 ? 2 * progress * progress : 1 - Math.pow(-2 * progress + 2, 2) / 2;
      case 'easeOut':
        return 1 - Math.pow(1 - progress, 3);
      default:
        return progress;
    }
  }
}
```

### 3.2 Optimize DOM Operations

#### Current Problem
```javascript
// ANTI-PATTERN: Frequent DOM queries
function checkForWinner() {
  const ducks = document.querySelectorAll('.duck');
  return ducks.length === 0;
}
```

#### Solution: Virtual DOM Pattern
```javascript
class GameRenderer {
  constructor(container) {
    this.container = container;
    this.gameObjects = new Map();
    this.renderQueue = [];
    this.isRendering = false;
  }

  addGameObject(gameObject) {
    this.gameObjects.set(gameObject.id, gameObject);
    this.queueRender(() => {
      this.container.appendChild(gameObject.element);
    });
  }

  removeGameObject(gameObjectId) {
    const gameObject = this.gameObjects.get(gameObjectId);
    if (gameObject) {
      this.queueRender(() => {
        gameObject.element.remove();
      });
      this.gameObjects.delete(gameObjectId);
    }
  }

  queueRender(renderFunction) {
    this.renderQueue.push(renderFunction);
    if (!this.isRendering) {
      this.processRenderQueue();
    }
  }

  processRenderQueue() {
    this.isRendering = true;
    requestAnimationFrame(() => {
      while (this.renderQueue.length > 0) {
        const renderFunction = this.renderQueue.shift();
        renderFunction();
      }
      this.isRendering = false;
    });
  }
}
```

### 3.3 Implement Asset Preloading

#### Current Problem
```javascript
// ANTI-PATTERN: Assets loaded on demand
const audio = new Audio('audio/start-round.mp3');
```

#### Solution: Asset Manager
```javascript
class AssetManager {
  constructor() {
    this.assets = new Map();
    this.loadingPromises = new Map();
  }

  async preloadAssets(assetList) {
    const promises = assetList.map(asset => this.loadAsset(asset));
    await Promise.all(promises);
  }

  async loadAsset(asset) {
    if (this.assets.has(asset.id)) {
      return this.assets.get(asset.id);
    }

    if (this.loadingPromises.has(asset.id)) {
      return this.loadingPromises.get(asset.id);
    }

    const loadPromise = this.loadAssetByType(asset);
    this.loadingPromises.set(asset.id, loadPromise);

    try {
      const loadedAsset = await loadPromise;
      this.assets.set(asset.id, loadedAsset);
      this.loadingPromises.delete(asset.id);
      return loadedAsset;
    } catch (error) {
      this.loadingPromises.delete(asset.id);
      throw error;
    }
  }

  async loadAssetByType(asset) {
    switch (asset.type) {
      case 'image':
        return this.loadImage(asset.src);
      case 'audio':
        return this.loadAudio(asset.src);
      default:
        throw new Error(`Unknown asset type: ${asset.type}`);
    }
  }

  async loadImage(src) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    });
  }

  async loadAudio(src) {
    const audio = new Audio();
    await new Promise((resolve, reject) => {
      audio.addEventListener('canplaythrough', resolve);
      audio.addEventListener('error', reject);
      audio.src = src;
      audio.load();
    });
    return audio;
  }
}
```

## Phase 4: Modern Framework Migration (Week 5-6)

### 4.1 React Component Structure

#### Target Architecture
```jsx
// App.jsx
import React from 'react';
import { GameProvider } from './context/GameContext';
import Game from './components/Game';

function App() {
  return (
    <GameProvider>
      <Game />
    </GameProvider>
  );
}

// Game.jsx
import React from 'react';
import { useGameState } from '../hooks/useGameState';
import { useGameActions } from '../hooks/useGameActions';
import GameCanvas from './GameCanvas';
import GameUI from './GameUI';

function Game() {
  const { gameStatus, score, round } = useGameState();
  const { startGame, pauseGame, resumeGame } = useGameActions();

  return (
    <div className="game">
      <GameUI score={score} round={round} />
      <GameCanvas />
      {gameStatus === 'loading' && <LoadingScreen />}
      {gameStatus === 'won' && <WinModal onRestart={startGame} />}
    </div>
  );
}

// Duck.jsx
import React, { useEffect, useRef } from 'react';
import { useDuckAnimation } from '../hooks/useDuckAnimation';
import { useDuckInteraction } from '../hooks/useDuckInteraction';

function Duck({ id, position, direction, isFlapping, isShot, onShoot }) {
  const elementRef = useRef();
  const { animateMovement, animateFlap } = useDuckAnimation(elementRef);
  const { handleClick } = useDuckInteraction(id, onShoot);

  useEffect(() => {
    animateMovement(position);
  }, [position]);

  useEffect(() => {
    animateFlap(isFlapping);
  }, [isFlapping]);

  return (
    <div
      ref={elementRef}
      className={`duck ${direction} ${isFlapping ? 'flap' : ''} ${isShot ? 'shot' : ''}`}
      onClick={handleClick}
      style={{
        left: position.x,
        top: position.y
      }}
    />
  );
}
```

### 4.2 Redux Toolkit State Management

#### Store Configuration
```javascript
// store/gameSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const initializeGame = createAsyncThunk(
  'game/initialize',
  async (_, { dispatch }) => {
    await dispatch(loadAssets());
    return { status: 'ready' };
  }
);

export const shootDuck = createAsyncThunk(
  'game/shootDuck',
  async (duckId, { getState, dispatch }) => {
    const state = getState();
    const duck = state.game.ducks.find(d => d.id === duckId);
    
    if (duck && !duck.isShot) {
      dispatch(playSound('shot'));
      return { duckId, score: state.game.score + 1 };
    }
    return null;
  }
);

const gameSlice = createSlice({
  name: 'game',
  initialState: {
    status: 'loading',
    score: 0,
    round: 1,
    ducks: [],
    dog: null,
    config: GAME_CONFIG
  },
  reducers: {
    setGameStatus: (state, action) => {
      state.status = action.payload;
    },
    addDuck: (state, action) => {
      state.ducks.push(action.payload);
    },
    removeDuck: (state, action) => {
      state.ducks = state.ducks.filter(d => d.id !== action.payload);
    },
    updateDuckPosition: (state, action) => {
      const { id, position } = action.payload;
      const duck = state.ducks.find(d => d.id === id);
      if (duck) {
        duck.position = position;
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(initializeGame.fulfilled, (state, action) => {
        state.status = action.payload.status;
      })
      .addCase(shootDuck.fulfilled, (state, action) => {
        if (action.payload) {
          const { duckId, score } = action.payload;
          state.score = score;
          const duck = state.ducks.find(d => d.id === duckId);
          if (duck) {
            duck.isShot = true;
          }
        }
      });
  }
});
```

### 4.3 TypeScript Implementation

#### Type Definitions
```typescript
// types/game.ts
export interface Position {
  x: number;
  y: number;
}

export interface Duck {
  id: string;
  position: Position;
  direction: 'left' | 'right';
  isFlapping: boolean;
  isShot: boolean;
  speed: number;
}

export interface Dog {
  id: string;
  position: Position;
  state: 'walking' | 'sniffing' | 'surprised' | 'leaping';
  animationProgress: number;
}

export interface GameState {
  status: 'loading' | 'intro' | 'playing' | 'won' | 'paused';
  score: number;
  round: number;
  ducks: Duck[];
  dog: Dog | null;
  config: GameConfig;
}

export interface GameConfig {
  sprites: {
    dog: SpriteConfig;
    duck: SpriteConfig;
  };
  game: {
    initialDuckCount: { min: number; max: number };
    dogIntroDelay: number;
    shotDelay: number;
    animationSpeed: { min: number; max: number };
  };
  responsive: {
    breakpoint: number;
    dogOffset: number;
  };
}

// hooks/useGameState.ts
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';

export const useGameState = () => {
  return useSelector((state: RootState) => state.game);
};

export const useGameActions = () => {
  const dispatch = useDispatch();
  
  return {
    shootDuck: (duckId: string) => dispatch(shootDuck(duckId)),
    startGame: () => dispatch(setGameStatus('playing')),
    pauseGame: () => dispatch(setGameStatus('paused')),
    resumeGame: () => dispatch(setGameStatus('playing'))
  };
};
```

## Phase 5: Testing Implementation (Week 7)

### 5.1 Unit Tests

```javascript
// __tests__/Duck.test.js
import { render, fireEvent, screen } from '@testing-library/react';
import Duck from '../components/Duck';

describe('Duck Component', () => {
  const mockDuck = {
    id: 'duck-1',
    position: { x: 100, y: 200 },
    direction: 'left',
    isFlapping: false,
    isShot: false
  };

  const mockOnShoot = jest.fn();

  beforeEach(() => {
    mockOnShoot.mockClear();
  });

  test('renders duck with correct position', () => {
    render(<Duck {...mockDuck} onShoot={mockOnShoot} />);
    
    const duckElement = screen.getByTestId('duck-duck-1');
    expect(duckElement).toHaveStyle({
      left: '100px',
      top: '200px'
    });
  });

  test('calls onShoot when clicked', () => {
    render(<Duck {...mockDuck} onShoot={mockOnShoot} />);
    
    const duckElement = screen.getByTestId('duck-duck-1');
    fireEvent.click(duckElement);
    
    expect(mockOnShoot).toHaveBeenCalledWith('duck-1');
  });

  test('applies shot class when isShot is true', () => {
    const shotDuck = { ...mockDuck, isShot: true };
    render(<Duck {...shotDuck} onShoot={mockOnShoot} />);
    
    const duckElement = screen.getByTestId('duck-duck-1');
    expect(duckElement).toHaveClass('shot');
  });
});
```

### 5.2 Integration Tests

```javascript
// __tests__/Game.test.js
import { render, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import gameReducer from '../store/gameSlice';
import Game from '../components/Game';

const createTestStore = (initialState = {}) => {
  return configureStore({
    reducer: {
      game: gameReducer
    },
    preloadedState: {
      game: {
        status: 'playing',
        score: 0,
        round: 1,
        ducks: [
          {
            id: 'duck-1',
            position: { x: 100, y: 100 },
            direction: 'left',
            isFlapping: false,
            isShot: false
          }
        ],
        dog: null,
        config: GAME_CONFIG,
        ...initialState
      }
    }
  });
};

describe('Game Integration', () => {
  test('shooting duck increases score', async () => {
    const store = createTestStore();
    const { getByTestId } = render(
      <Provider store={store}>
        <Game />
      </Provider>
    );

    const duck = getByTestId('duck-duck-1');
    fireEvent.click(duck);

    await waitFor(() => {
      const state = store.getState();
      expect(state.game.score).toBe(1);
    });
  });

  test('game ends when all ducks are shot', async () => {
    const store = createTestStore();
    const { getByTestId } = render(
      <Provider store={store}>
        <Game />
      </Provider>
    );

    const duck = getByTestId('duck-duck-1');
    fireEvent.click(duck);

    await waitFor(() => {
      const state = store.getState();
      expect(state.game.status).toBe('won');
    });
  });
});
```

## Migration Timeline

### Week 1: Critical Fixes
- [ ] Fix memory leaks
- [ ] Extract configuration
- [ ] Add error handling
- [ ] Replace alert dialogs

### Week 2-3: Architecture
- [ ] Implement state management
- [ ] Create component architecture
- [ ] Implement event system
- [ ] Add asset management

### Week 4: Performance
- [ ] Implement animation system
- [ ] Optimize DOM operations
- [ ] Add asset preloading
- [ ] Performance monitoring

### Week 5-6: Modern Framework
- [ ] React component structure
- [ ] Redux Toolkit integration
- [ ] TypeScript implementation
- [ ] Build system setup

### Week 7: Testing
- [ ] Unit test implementation
- [ ] Integration tests
- [ ] E2E tests
- [ ] Test coverage reporting

## Success Metrics

### Performance
- **Memory Usage**: < 50MB after 10 minutes of gameplay
- **Frame Rate**: Consistent 60fps
- **Load Time**: < 2 seconds initial load
- **Bundle Size**: < 500KB gzipped

### Code Quality
- **Test Coverage**: > 80%
- **TypeScript Coverage**: 100%
- **Linting**: Zero warnings/errors
- **Documentation**: 100% API coverage

### User Experience
- **No Memory Leaks**: Browser memory stable
- **Responsive Design**: Works on all screen sizes
- **Accessibility**: WCAG 2.1 AA compliance
- **Error Handling**: Graceful degradation

This refactoring plan transforms the Duck Hunt game from a legacy codebase into a modern, maintainable, and scalable application following industry best practices.

