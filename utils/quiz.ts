export type Direction = 'up' | 'down' | 'left' | 'right' | 'forward' | 'backward';

export interface Question {
  given: {
    type: 'force' | 'field' | 'current';
    direction: Direction;
  }[];
  answer: {
    type: 'force' | 'field' | 'current';
    direction: Direction;
  };
}

const directions: Direction[] = ['up', 'down', 'left', 'right', 'forward', 'backward'];

// Maps each parameter to its opposite direction
const oppositeDirection: Record<Direction, Direction> = {
  'up': 'down',
  'down': 'up',
  'left': 'right',
  'right': 'left',
  'forward': 'backward',
  'backward': 'forward'
};

// Define the rule: Given Force and Field, determine Current (and all permutations)
// In Fleming's Left Hand Rule:
// - Thumb = Force/Motion
// - First Finger = Magnetic Field  
// - Second Finger = Current
// These are mutually perpendicular

function getRandomDirection(): Direction {
  return directions[Math.floor(Math.random() * directions.length)];
}

function getPerpendicularDirection(dir1: Direction, dir2: Direction): Direction {
  // Simplified perpendicular logic for demonstration
  // In real 3D space, perpendicularity is more complex
  const used = [dir1, dir2, oppositeDirection[dir1], oppositeDirection[dir2]];
  const available = directions.filter(d => !used.includes(d));
  return available[Math.floor(Math.random() * available.length)];
}

export function generateQuestion(): Question {
  // Randomly choose which two parameters to give
  const questionTypes = [
    { given: ['force', 'field'], answer: 'current' },
    { given: ['force', 'current'], answer: 'field' },
    { given: ['field', 'current'], answer: 'force' }
  ];
  
  const selected = questionTypes[Math.floor(Math.random() * questionTypes.length)];
  
  const dir1 = getRandomDirection();
  const dir2 = getPerpendicularDirection(dir1, dir1);
  const dir3 = getPerpendicularDirection(dir1, dir2);
  
  const question: Question = {
    given: [
      { type: selected.given[0] as any, direction: dir1 },
      { type: selected.given[1] as any, direction: dir2 }
    ],
    answer: {
      type: selected.answer as any,
      direction: dir3
    }
  };
  
  return question;
}

export function checkAnswer(question: Question, userAnswer: Direction): boolean {
  return userAnswer === question.answer.direction;
}

export function getDisplayName(type: 'force' | 'field' | 'current'): string {
  const names = {
    force: 'Force/Motion',
    field: 'Magnetic Field',
    current: 'Current'
  };
  return names[type];
}

export function getFingerName(type: 'force' | 'field' | 'current'): string {
  const fingers = {
    force: 'Thumb',
    field: 'First Finger',
    current: 'Second Finger'
  };
  return fingers[type];
}

export function getDirectionDisplay(direction: Direction): string {
  const displays = {
    up: 'Upward ↑',
    down: 'Downward ↓',
    left: 'Left ←',
    right: 'Right →',
    forward: 'Forward ⊙',
    backward: 'Backward ⊗'
  };
  return displays[direction];
}
