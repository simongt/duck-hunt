# Duck Hunt Game Style Guide

## Overview

This style guide establishes coding standards for modernizing the Duck Hunt game codebase. It focuses on best practices for React, Redux Toolkit, TypeScript, and modern JavaScript development, providing clear guidelines for maintaining code quality and consistency.

## JavaScript/TypeScript Standards

### General Principles

#### 1. Use Modern JavaScript Features
```javascript
// ✅ GOOD: Use const/let, arrow functions, destructuring
const createDuck = (id, position) => {
  const { x, y } = position;
  return { id, position: { x, y } };
};

// ❌ BAD: var, function declarations, manual assignment
var createDuck = function(id, position) {
  var x = position.x;
  var y = position.y;
  return { id: id, position: { x: x, y: y } };
};
```

#### 2. Prefer Functional Programming
```javascript
// ✅ GOOD: Pure functions, immutability
const updateDuckPosition = (ducks, duckId, newPosition) => {
  return ducks.map(duck => 
    duck.id === duckId 
      ? { ...duck, position: newPosition }
      : duck
  );
};

// ❌ BAD: Mutating state directly
const updateDuckPosition = (ducks, duckId, newPosition) => {
  const duck = ducks.find(d => d.id === duckId);
  duck.position = newPosition; // Mutation!
  return ducks;
};
```

#### 3. Use TypeScript for Type Safety
```typescript
// ✅ GOOD: Strong typing
interface Duck {
  id: string;
  position: Position;
  direction: 'left' | 'right';
  isFlapping: boolean;
  isShot: boolean;
}

const createDuck = (id: string, position: Position): Duck => ({
  id,
  position,
  direction: 'left',
  isFlapping: false,
  isShot: false
});

// ❌ BAD: No type safety
const createDuck = (id, position) => ({
  id,
  position,
  direction: 'left',
  isFlapping: false,
  isShot: false
});
```

### Naming Conventions

#### Variables and Functions
```javascript
// ✅ GOOD: Descriptive, camelCase
const duckCount = 5;
const isGameActive = true;
const calculateDuckSpeed = (distance) => distance / 1000;

// ❌ BAD: Unclear, inconsistent
const dc = 5;
const game = true;
const calc = (d) => d / 1000;
```

#### Constants
```javascript
// ✅ GOOD: UPPER_SNAKE_CASE for constants
const GAME_CONFIG = {
  INITIAL_DUCK_COUNT: 5,
  MAX_DUCK_SPEED: 100,
  ANIMATION_DURATION: 2000
};

// ❌ BAD: Mixed case for constants
const gameConfig = {
  initialDuckCount: 5,
  maxDuckSpeed: 100,
  animationDuration: 2000
};
```

#### Classes and Components
```javascript
// ✅ GOOD: PascalCase for classes and components
class Duck extends GameObject {
  constructor(id, position) {
    super(id);
    this.position = position;
  }
}

const GameCanvas = ({ children }) => (
  <div className="game-canvas">{children}</div>
);

// ❌ BAD: camelCase for classes
class duck extends GameObject {
  // ...
}

const gameCanvas = ({ children }) => (
  <div className="game-canvas">{children}</div>
);
```

### Code Organization

#### File Structure
```
src/
├── components/          # React components
│   ├── Game/
│   │   ├── Game.tsx
│   │   ├── Game.test.tsx
│   │   └── Game.module.css
│   └── Duck/
│       ├── Duck.tsx
│       ├── Duck.test.tsx
│       └── Duck.module.css
├── hooks/              # Custom React hooks
│   ├── useGameState.ts
│   └── useDuckAnimation.ts
├── store/              # Redux store
│   ├── index.ts
│   ├── gameSlice.ts
│   └── types.ts
├── utils/              # Utility functions
│   ├── animation.ts
│   └── math.ts
├── types/              # TypeScript type definitions
│   └── game.ts
└── assets/             # Static assets
    ├── images/
    └── audio/
```

#### Import/Export Order
```typescript
// ✅ GOOD: Organized imports
// 1. React and external libraries
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

// 2. Internal modules
import { useGameState } from '../../hooks/useGameState';
import { shootDuck } from '../../store/gameSlice';

// 3. Types
import type { Duck, Position } from '../../types/game';

// 4. Assets
import duckSprite from '../../assets/images/duck.png';

// ❌ BAD: Random import order
import { shootDuck } from '../../store/gameSlice';
import React from 'react';
import duckSprite from '../../assets/images/duck.png';
import { useGameState } from '../../hooks/useGameState';
```

## React Standards

### Component Structure

#### Functional Components with Hooks
```typescript
// ✅ GOOD: Functional component with proper typing
interface DuckProps {
  id: string;
  position: Position;
  direction: 'left' | 'right';
  isFlapping: boolean;
  isShot: boolean;
  onShoot: (id: string) => void;
}

const Duck: React.FC<DuckProps> = ({
  id,
  position,
  direction,
  isFlapping,
  isShot,
  onShoot
}) => {
  const handleClick = () => {
    if (!isShot) {
      onShoot(id);
    }
  };

  return (
    <div
      className={`duck ${direction} ${isFlapping ? 'flap' : ''} ${isShot ? 'shot' : ''}`}
      style={{
        left: position.x,
        top: position.y
      }}
      onClick={handleClick}
      data-testid={`duck-${id}`}
    />
  );
};

// ❌ BAD: Class component, no typing
class Duck extends React.Component {
  handleClick = () => {
    if (!this.props.isShot) {
      this.props.onShoot(this.props.id);
    }
  };

  render() {
    return (
      <div
        className={`duck ${this.props.direction} ${this.props.isFlapping ? 'flap' : ''} ${this.props.isShot ? 'shot' : ''}`}
        style={{
          left: this.props.position.x,
          top: this.props.position.y
        }}
        onClick={this.handleClick}
      />
    );
  }
}
```

#### Custom Hooks
```typescript
// ✅ GOOD: Custom hook with proper typing
interface UseDuckAnimationOptions {
  duration: number;
  onComplete?: () => void;
}

const useDuckAnimation = (
  elementRef: React.RefObject<HTMLElement>,
  options: UseDuckAnimationOptions
) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const animationId = useRef<number | null>(null);

  const animate = useCallback((targetPosition: Position) => {
    if (!elementRef.current) return;

    setIsAnimating(true);
    const startPosition = {
      x: parseFloat(elementRef.current.style.left || '0'),
      y: parseFloat(elementRef.current.style.top || '0')
    };

    const startTime = performance.now();

    const updatePosition = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / options.duration, 1);

      const currentPosition = {
        x: startPosition.x + (targetPosition.x - startPosition.x) * progress,
        y: startPosition.y + (targetPosition.y - startPosition.y) * progress
      };

      if (elementRef.current) {
        elementRef.current.style.left = `${currentPosition.x}px`;
        elementRef.current.style.top = `${currentPosition.y}px`;
      }

      if (progress < 1) {
        animationId.current = requestAnimationFrame(updatePosition);
      } else {
        setIsAnimating(false);
        options.onComplete?.();
      }
    };

    animationId.current = requestAnimationFrame(updatePosition);
  }, [elementRef, options]);

  useEffect(() => {
    return () => {
      if (animationId.current) {
        cancelAnimationFrame(animationId.current);
      }
    };
  }, []);

  return { animate, isAnimating };
};

// ❌ BAD: Logic mixed in component
const Duck = ({ position, onMove }) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const elementRef = useRef(null);

  const animate = (targetPosition) => {
    // 50+ lines of animation logic mixed in component
  };

  return <div ref={elementRef} />;
};
```

### State Management

#### Use Redux Toolkit
```typescript
// ✅ GOOD: Redux Toolkit with TypeScript
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

interface GameState {
  status: 'loading' | 'playing' | 'won' | 'paused';
  score: number;
  ducks: Duck[];
  dog: Dog | null;
}

const initialState: GameState = {
  status: 'loading',
  score: 0,
  ducks: [],
  dog: null
};

export const shootDuck = createAsyncThunk(
  'game/shootDuck',
  async (duckId: string, { getState, dispatch }) => {
    const state = getState() as RootState;
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
  initialState,
  reducers: {
    setGameStatus: (state, action: PayloadAction<GameState['status']>) => {
      state.status = action.payload;
    },
    addDuck: (state, action: PayloadAction<Duck>) => {
      state.ducks.push(action.payload);
    },
    removeDuck: (state, action: PayloadAction<string>) => {
      state.ducks = state.ducks.filter(d => d.id !== action.payload);
    }
  },
  extraReducers: (builder) => {
    builder
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

// ❌ BAD: Manual Redux setup
const gameReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_GAME_STATUS':
      return { ...state, status: action.payload };
    case 'ADD_DUCK':
      return { ...state, ducks: [...state.ducks, action.payload] };
    // ... many more cases
    default:
      return state;
  }
};
```

#### Use Typed Hooks
```typescript
// ✅ GOOD: Typed Redux hooks
import { useSelector, useDispatch } from 'react-redux';
import type { RootState, AppDispatch } from '../store';

export const useAppDispatch = () => useDispatch<AppDispatch>();

export const useGameState = () => {
  return useSelector((state: RootState) => state.game);
};

export const useGameActions = () => {
  const dispatch = useAppDispatch();
  
  return {
    shootDuck: (duckId: string) => dispatch(shootDuck(duckId)),
    setGameStatus: (status: GameState['status']) => dispatch(setGameStatus(status)),
    addDuck: (duck: Duck) => dispatch(addDuck(duck))
  };
};

// ❌ BAD: Untyped hooks
const useGameState = () => {
  return useSelector(state => state.game);
};
```

## CSS/Styling Standards

### CSS Modules
```css
/* ✅ GOOD: CSS Modules with BEM-like naming */
.duck {
  position: absolute;
  background-image: url('../../assets/images/duck-sprite.png');
  width: 110px;
  height: 115px;
  cursor: pointer;
  transition: transform 0.2s ease-out;
}

.duck--left {
  background-position: -100px -160px;
}

.duck--right {
  background-position: -200px -160px;
}

.duck--flapping {
  background-position: -430px -160px;
}

.duck--shot {
  background-image: url('../../assets/images/shot.png');
  pointer-events: none;
}

.duck:hover {
  transform: scale(1.05);
}

/* ❌ BAD: Global CSS with generic names */
.duck {
  position: absolute;
  background-image: url('duck.png');
  width: 110px;
  height: 115px;
}

.right {
  background-position: -200px -160px;
}

.flap {
  background-position: -430px -160px;
}
```

### CSS Custom Properties
```css
/* ✅ GOOD: CSS custom properties for theming */
:root {
  --duck-width: 110px;
  --duck-height: 115px;
  --animation-duration: 2s;
  --primary-color: #4a90e2;
  --secondary-color: #f39c12;
  --background-color: #2c3e50;
}

.duck {
  width: var(--duck-width);
  height: var(--duck-height);
  transition: transform var(--animation-duration) ease-out;
}

.game-ui {
  background-color: var(--background-color);
  color: var(--primary-color);
}

/* ❌ BAD: Hardcoded values */
.duck {
  width: 110px;
  height: 115px;
  transition: transform 2s ease-out;
}

.game-ui {
  background-color: #2c3e50;
  color: #4a90e2;
}
```

## Testing Standards

### Component Testing
```typescript
// ✅ GOOD: Comprehensive component tests
import { render, fireEvent, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import Duck from './Duck';
import gameReducer from '../../store/gameSlice';

const createTestStore = (initialState = {}) => {
  return configureStore({
    reducer: { game: gameReducer },
    preloadedState: { game: initialState }
  });
};

describe('Duck Component', () => {
  const defaultProps = {
    id: 'duck-1',
    position: { x: 100, y: 200 },
    direction: 'left' as const,
    isFlapping: false,
    isShot: false,
    onShoot: jest.fn()
  };

  beforeEach(() => {
    defaultProps.onShoot.mockClear();
  });

  test('renders with correct position and direction', () => {
    render(<Duck {...defaultProps} />);
    
    const duckElement = screen.getByTestId('duck-duck-1');
    expect(duckElement).toHaveStyle({
      left: '100px',
      top: '200px'
    });
    expect(duckElement).toHaveClass('duck--left');
  });

  test('calls onShoot when clicked and not shot', () => {
    render(<Duck {...defaultProps} />);
    
    const duckElement = screen.getByTestId('duck-duck-1');
    fireEvent.click(duckElement);
    
    expect(defaultProps.onShoot).toHaveBeenCalledWith('duck-1');
  });

  test('does not call onShoot when already shot', () => {
    render(<Duck {...defaultProps} isShot={true} />);
    
    const duckElement = screen.getByTestId('duck-duck-1');
    fireEvent.click(duckElement);
    
    expect(defaultProps.onShoot).not.toHaveBeenCalled();
  });

  test('applies correct classes based on state', () => {
    const { rerender } = render(<Duck {...defaultProps} />);
    
    let duckElement = screen.getByTestId('duck-duck-1');
    expect(duckElement).toHaveClass('duck--left');
    expect(duckElement).not.toHaveClass('duck--flapping', 'duck--shot');
    
    rerender(<Duck {...defaultProps} direction="right" isFlapping={true} isShot={true} />);
    
    duckElement = screen.getByTestId('duck-duck-1');
    expect(duckElement).toHaveClass('duck--right', 'duck--flapping', 'duck--shot');
  });
});

// ❌ BAD: Minimal testing
describe('Duck', () => {
  test('renders', () => {
    render(<Duck />);
    expect(screen.getByText('Duck')).toBeInTheDocument();
  });
});
```

### Hook Testing
```typescript
// ✅ GOOD: Hook testing with renderHook
import { renderHook, act } from '@testing-library/react-hooks';
import { useDuckAnimation } from './useDuckAnimation';

describe('useDuckAnimation', () => {
  test('animates to target position', async () => {
    const elementRef = { current: document.createElement('div') };
    const onComplete = jest.fn();
    
    const { result } = renderHook(() =>
      useDuckAnimation(elementRef, { duration: 100, onComplete })
    );

    act(() => {
      result.current.animate({ x: 200, y: 300 });
    });

    expect(result.current.isAnimating).toBe(true);
    
    // Wait for animation to complete
    await new Promise(resolve => setTimeout(resolve, 150));
    
    expect(result.current.isAnimating).toBe(false);
    expect(onComplete).toHaveBeenCalled();
  });
});
```

## Error Handling

### Try-Catch Blocks
```typescript
// ✅ GOOD: Proper error handling with types
const loadGameAssets = async (): Promise<GameAssets> => {
  try {
    const [duckSprite, dogSprite, backgroundImage] = await Promise.all([
      loadImage('duck-sprite.png'),
      loadImage('dog-sprite.png'),
      loadImage('background.png')
    ]);

    return {
      duckSprite,
      dogSprite,
      backgroundImage
    };
  } catch (error) {
    console.error('Failed to load game assets:', error);
    throw new GameAssetError('Failed to load required game assets', { cause: error });
  }
};

// ❌ BAD: No error handling
const loadGameAssets = async () => {
  const duckSprite = await loadImage('duck-sprite.png');
  const dogSprite = await loadImage('dog-sprite.png');
  const backgroundImage = await loadImage('background.png');
  
  return { duckSprite, dogSprite, backgroundImage };
};
```

### Error Boundaries
```typescript
// ✅ GOOD: React Error Boundary
class GameErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Game error caught:', error, errorInfo);
    // Send to error reporting service
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <h2>Something went wrong</h2>
          <p>The game encountered an error and needs to restart.</p>
          <button onClick={() => window.location.reload()}>
            Restart Game
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
```

## Performance Standards

### Memoization
```typescript
// ✅ GOOD: Proper use of memoization
const DuckList = React.memo<{ ducks: Duck[]; onShoot: (id: string) => void }>(
  ({ ducks, onShoot }) => {
    return (
      <div className="duck-list">
        {ducks.map(duck => (
          <Duck key={duck.id} {...duck} onShoot={onShoot} />
        ))}
      </div>
    );
  }
);

const useMemoizedDuckSpeed = (distance: number) => {
  return useMemo(() => {
    return Math.max(distance / 1000, 0.5);
  }, [distance]);
};

// ❌ BAD: No memoization
const DuckList = ({ ducks, onShoot }) => {
  return (
    <div className="duck-list">
      {ducks.map(duck => (
        <Duck key={duck.id} {...duck} onShoot={onShoot} />
      ))}
    </div>
  );
};
```

### Lazy Loading
```typescript
// ✅ GOOD: Lazy loading for code splitting
const GameSettings = React.lazy(() => import('./GameSettings'));
const Leaderboard = React.lazy(() => import('./Leaderboard'));

const Game = () => {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <GameSettings />
      <Leaderboard />
    </Suspense>
  );
};

// ❌ BAD: All components loaded upfront
import GameSettings from './GameSettings';
import Leaderboard from './Leaderboard';
```

## Documentation Standards

### JSDoc Comments
```typescript
/**
 * Creates a new duck game object with the specified properties
 * 
 * @param id - Unique identifier for the duck
 * @param position - Initial position coordinates
 * @param direction - Facing direction of the duck
 * @returns A new Duck object ready for gameplay
 * 
 * @example
 * ```typescript
 * const duck = createDuck('duck-1', { x: 100, y: 200 }, 'left');
 * ```
 */
const createDuck = (id: string, position: Position, direction: 'left' | 'right'): Duck => {
  return {
    id,
    position,
    direction,
    isFlapping: false,
    isShot: false,
    createdAt: Date.now()
  };
};

/**
 * Custom hook for managing duck animation state
 * 
 * @param elementRef - Reference to the DOM element to animate
 * @param options - Animation configuration options
 * @returns Object containing animation controls and state
 */
const useDuckAnimation = (
  elementRef: React.RefObject<HTMLElement>,
  options: UseDuckAnimationOptions
) => {
  // Implementation
};
```

### README Documentation
```markdown
# Duck Component

A React component that renders an animated duck in the Duck Hunt game.

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `id` | `string` | Yes | Unique identifier for the duck |
| `position` | `Position` | Yes | Current position coordinates |
| `direction` | `'left' \| 'right'` | Yes | Facing direction |
| `isFlapping` | `boolean` | No | Whether wings are flapping |
| `isShot` | `boolean` | No | Whether duck has been shot |
| `onShoot` | `(id: string) => void` | Yes | Callback when duck is clicked |

## Usage

```tsx
import Duck from './Duck';

<Duck
  id="duck-1"
  position={{ x: 100, y: 200 }}
  direction="left"
  isFlapping={false}
  isShot={false}
  onShoot={(id) => console.log(`Shot duck ${id}`)}
/>
```

## Styling

The component uses CSS Modules with the following classes:
- `.duck` - Base duck styling
- `.duck--left` - Left-facing duck
- `.duck--right` - Right-facing duck
- `.duck--flapping` - Flapping animation
- `.duck--shot` - Shot state styling
```

This style guide ensures consistent, maintainable, and high-quality code throughout the Duck Hunt game modernization process.

