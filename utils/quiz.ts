
export type Direction = 'up' | 'down' | 'left' | 'right' | 'in' | 'out';
export type FactorType = 'force' | 'field' | 'current';

export interface Scenario {
  fieldDirection: 'left' | 'right';
  currentDirection: 'in' | 'out';
  forceDirection: 'up' | 'down';
  hiddenFactor: FactorType;
}

export interface Question {
  given: {
    type: FactorType;
    direction: Direction;
  }[];
  answer: {
    type: FactorType;
    direction: Direction;
  };
  scenario: Scenario;
}

export function getDirectionDisplay(dir: Direction): string {
  switch (dir) {
    case 'up': return 'Upward ↑';
    case 'down': return 'Downward ↓';
    case 'left': return 'Left ←';
    case 'right': return 'Right →';
    case 'in': return 'Into Screen ⊗';
    case 'out': return 'Out of Screen ⊙';
  }
}

export function generateQuestion(): Question {
  // 1. Randomize Field and Current
  const fieldDirection = Math.random() > 0.5 ? 'right' : 'left';
  const currentDirection = Math.random() > 0.5 ? 'out' : 'in';
  
  // 2. Calculate Force using Fleming's Left Hand Rule
  // F = I x B
  // Coord system: Right=+X, Up=+Y, Out=+Z
  // Field: Right(+X), Left(-X)
  // Current: Out(+Z), In(-Z)
  // Force = Current x Field
  
  let forceDirection: 'up' | 'down';
  
  if (currentDirection === 'out') { // +Z
    if (fieldDirection === 'right') { // +X
      // (+Z) x (+X) = +Y (Up)
      forceDirection = 'up';
    } else { // -X
      // (+Z) x (-X) = -Y (Down)
      forceDirection = 'down';
    }
  } else { // -Z (In)
    if (fieldDirection === 'right') { // +X
      // (-Z) x (+X) = -Y (Down)
      forceDirection = 'down';
    } else { // -X
      // (-Z) x (-X) = +Y (Up)
      forceDirection = 'up';
    }
  }

  // 3. Choose which factor to hide
  const factors: FactorType[] = ['force', 'field', 'current'];
  const hiddenFactor = factors[Math.floor(Math.random() * factors.length)];
  
  const scenario: Scenario = {
    fieldDirection,
    currentDirection,
    forceDirection,
    hiddenFactor
  };
  
  // 4. Construct Question Object
  const allFactors = {
    force: forceDirection,
    field: fieldDirection,
    current: currentDirection
  };
  
  const given = factors
    .filter(f => f !== hiddenFactor)
    .map(f => ({ type: f, direction: allFactors[f] as Direction }));
    
  const answer = {
    type: hiddenFactor,
    direction: allFactors[hiddenFactor] as Direction
  };

  return {
    given,
    answer,
    scenario
  };
}

export function checkAnswer(question: Question, userAnswer: Direction): boolean {
  return question.answer.direction === userAnswer;
}

export function getDisplayName(type: FactorType): string {
  switch (type) {
    case 'force': return 'Magnetic Force (Thrust)';
    case 'field': return 'Magnetic Field';
    case 'current': return 'Current';
  }
}

