import { SignDefinition } from './types';

export const SUPPORTED_SIGNS: SignDefinition[] = [
  {
    id: 'hello',
    name: 'Hello',
    gloss: 'HELLO',
    category: 'greetings',
    description: 'Flat open hand moves smoothly outwards from forehead / temple in a salute motion.',
    naturalPhrase: 'Hello, how can I help you?',
    twoHanded: false,
    confidenceThreshold: 0.70,
    difficulty: 'basic',
    motionSteps: [
      'Touch open hand with fingers together near right temple',
      'Move hand away from forehead in a slight outward arc',
      'Hold position momentarily with open palm facing slightly outwards'
    ],
    visualCues: [
      { step: 1, instruction: 'Raise open hand to temple', handShape: 'B-Hand (Flat palm)', arrowDirection: 'up', handPositionLabel: 'Near temple' },
      { step: 2, instruction: 'Extend outward smoothly', handShape: 'B-Hand (Flat palm)', arrowDirection: 'forward', handPositionLabel: 'Forward gesture' },
      { step: 3, instruction: 'Release hold', handShape: 'Open Palm', arrowDirection: 'right', handPositionLabel: 'Neutral hold' }
    ],
    featurePattern: {
      fingerSignature: [1, 1, 1, 1, 1],
      motionType: 'linear',
      targetDirection: 'forward'
    }
  },
  {
    id: 'thank_you',
    name: 'Thank You',
    gloss: 'THANK-YOU',
    category: 'courtesies',
    description: 'Fingertips of flat hand touch chin/lips then move outward and slightly down towards conversational partner.',
    naturalPhrase: 'Thank you very much.',
    twoHanded: false,
    confidenceThreshold: 0.72,
    difficulty: 'basic',
    motionSteps: [
      'Place fingertips of flat dominant hand against chin or lips',
      'Move hand forward and slightly downward toward the other person',
      'Keep palm facing upward/toward yourself as it moves'
    ],
    visualCues: [
      { step: 1, instruction: 'Fingertips touch chin', handShape: 'Flat B-Hand', arrowDirection: 'chin', handPositionLabel: 'Fingertips on chin' },
      { step: 2, instruction: 'Move forward toward partner', handShape: 'Flat B-Hand', arrowDirection: 'forward', handPositionLabel: 'Moving outward' },
      { step: 3, instruction: 'Gentle downward curve', handShape: 'Relaxed flat hand', arrowDirection: 'down', handPositionLabel: 'Forward-down' }
    ],
    featurePattern: {
      fingerSignature: [1, 1, 1, 1, 1],
      motionType: 'contact',
      targetDirection: 'forward'
    }
  },
  {
    id: 'please',
    name: 'Please',
    gloss: 'PLEASE',
    category: 'courtesies',
    description: 'Flat open hand rubs gently in a clockwise circular motion over the center of the chest.',
    naturalPhrase: 'Please.',
    twoHanded: false,
    confidenceThreshold: 0.75,
    difficulty: 'basic',
    motionSteps: [
      'Place open flat palm with fingers together on center of chest',
      'Rub hand in a smooth circular clockwise motion twice',
      'Maintain contact with chest throughout movement'
    ],
    visualCues: [
      { step: 1, instruction: 'Flat palm against center chest', handShape: 'Open 5-hand/B-hand', arrowDirection: 'chest', handPositionLabel: 'Mid-chest' },
      { step: 2, instruction: 'Make clockwise circular motions', handShape: 'Open flat palm', arrowDirection: 'circular', handPositionLabel: 'Circular stroke' }
    ],
    featurePattern: {
      fingerSignature: [1, 1, 1, 1, 1],
      motionType: 'oscillating',
      targetDirection: 'chest'
    }
  },
  {
    id: 'help',
    name: 'Help',
    gloss: 'HELP',
    category: 'emergency',
    description: 'Closed fist with thumb extended upward rests on flat upward palm of non-dominant hand; both hands lift together.',
    naturalPhrase: 'I need help, please.',
    twoHanded: true,
    confidenceThreshold: 0.78,
    difficulty: 'basic',
    motionSteps: [
      'Hold non-dominant hand flat, palm facing upward in front of chest',
      'Form an "A" fist (thumbs-up) with dominant hand and place it on palm',
      'Lift both hands upward together smoothly in a supportive motion'
    ],
    visualCues: [
      { step: 1, instruction: 'Non-dominant palm flat, dominant thumbs-up on top', handShape: 'Base Palm + Thumbs Up', arrowDirection: 'chest', handPositionLabel: 'Chest height' },
      { step: 2, instruction: 'Lift both hands together upward', handShape: 'Support position', arrowDirection: 'up', handPositionLabel: 'Upward lift' }
    ],
    featurePattern: {
      fingerSignature: [1, 0, 0, 0, 0],
      motionType: 'two-handed-open',
      targetDirection: 'up'
    }
  },
  {
    id: 'emergency',
    name: 'Emergency',
    gloss: 'EMERGENCY',
    category: 'emergency',
    description: '"E" handshape shakes side-to-side with urgency in front of chest.',
    naturalPhrase: 'This is an emergency!',
    twoHanded: false,
    confidenceThreshold: 0.75,
    difficulty: 'intermediate',
    motionSteps: [
      'Form an "E" handshape (curled fingers resting on thumb)',
      'Hold at upper chest height',
      'Shake hand quickly back and forth side-to-side with urgent motion'
    ],
    visualCues: [
      { step: 1, instruction: 'Form E-handshape at chest level', handShape: 'E-Hand', arrowDirection: 'chest', handPositionLabel: 'Upper chest' },
      { step: 2, instruction: 'Vigorously shake side to side', handShape: 'E-Hand', arrowDirection: 'wave', handPositionLabel: 'Lateral oscillation' }
    ],
    featurePattern: {
      fingerSignature: [0, 0, 0, 0, 0],
      motionType: 'oscillating',
      targetDirection: 'chest'
    }
  },
  {
    id: 'pain',
    name: 'Pain / Hurt',
    gloss: 'PAIN',
    category: 'healthcare',
    description: 'Both index fingers point toward each other and twist inward sharply toward the location of pain.',
    naturalPhrase: 'I am experiencing pain.',
    twoHanded: true,
    confidenceThreshold: 0.74,
    difficulty: 'basic',
    motionSteps: [
      'Extend both index fingers with other fingers closed',
      'Point index fingertips toward each other with a few inches space',
      'Twist hands inward toward each other with a sharp quick motion'
    ],
    visualCues: [
      { step: 1, instruction: 'Extend both index fingers pointing toward each other', handShape: '1-Hand (Index out)', arrowDirection: 'forward', handPositionLabel: 'Near pain area' },
      { step: 2, instruction: 'Twist wrists inward sharply', handShape: '1-Hand (Index out)', arrowDirection: 'circular', handPositionLabel: 'Converging twist' }
    ],
    featurePattern: {
      fingerSignature: [0, 1, 0, 0, 0],
      motionType: 'oscillating',
      targetDirection: 'chest'
    }
  },
  {
    id: 'doctor',
    name: 'Doctor',
    gloss: 'DOCTOR',
    category: 'healthcare',
    description: 'Dominant "M" or curved fingertips tap the inside pulse point of non-dominant wrist.',
    naturalPhrase: 'I need to see a doctor.',
    twoHanded: true,
    confidenceThreshold: 0.73,
    difficulty: 'intermediate',
    motionSteps: [
      'Hold non-dominant arm forward, palm facing upward',
      'Curve fingertips of dominant hand into a loose cup or M-hand',
      'Tap fingertips twice against the pulse area of non-dominant wrist'
    ],
    visualCues: [
      { step: 1, instruction: 'Present non-dominant inner wrist', handShape: 'Arm extended', arrowDirection: 'forward', handPositionLabel: 'Wrist check' },
      { step: 2, instruction: 'Tap fingertips twice on wrist pulse', handShape: 'Bent fingers', arrowDirection: 'contact', handPositionLabel: 'Wrist tap' }
    ],
    featurePattern: {
      fingerSignature: [1, 1, 1, 1, 1],
      motionType: 'contact',
      targetDirection: 'chest'
    }
  },
  {
    id: 'hospital',
    name: 'Hospital',
    gloss: 'HOSPITAL',
    category: 'healthcare',
    description: '"H" handshape draws a medical cross on the upper non-dominant arm / shoulder.',
    naturalPhrase: 'Please take me to the hospital.',
    twoHanded: false,
    confidenceThreshold: 0.70,
    difficulty: 'intermediate',
    motionSteps: [
      'Form an "H" handshape with index and middle fingers extended together',
      'Touch upper shoulder / bicep of opposite arm',
      'Trace downward, then trace across to form a cross shape'
    ],
    visualCues: [
      { step: 1, instruction: 'Form H-hand with index & middle fingers', handShape: 'H-Hand', arrowDirection: 'up', handPositionLabel: 'Opposite shoulder' },
      { step: 2, instruction: 'Draw cross on shoulder (down, then across)', handShape: 'H-Hand', arrowDirection: 'down', handPositionLabel: 'Cross trace' }
    ],
    featurePattern: {
      fingerSignature: [0, 1, 1, 0, 0],
      motionType: 'linear',
      targetDirection: 'chest'
    }
  },
  {
    id: 'medicine',
    name: 'Medicine',
    gloss: 'MEDICINE',
    category: 'healthcare',
    description: 'Middle finger bent downward pivots into open palm of non-dominant hand like grinding a mortar.',
    naturalPhrase: 'I need my medicine.',
    twoHanded: true,
    confidenceThreshold: 0.71,
    difficulty: 'intermediate',
    motionSteps: [
      'Hold non-dominant palm facing upward',
      'Bend middle finger of dominant hand downward',
      'Twist middle fingertip back and forth against open palm'
    ],
    visualCues: [
      { step: 1, instruction: 'Place bent middle finger into non-dominant palm', handShape: 'Bent middle finger', arrowDirection: 'down', handPositionLabel: 'Palm center' },
      { step: 2, instruction: 'Pivoting twist in palm', handShape: 'Grinding motion', arrowDirection: 'circular', handPositionLabel: 'Mortar motion' }
    ],
    featurePattern: {
      fingerSignature: [0, 0, 1, 0, 0],
      motionType: 'oscillating',
      targetDirection: 'chest'
    }
  },
  {
    id: 'yes',
    name: 'Yes',
    gloss: 'YES',
    category: 'daily',
    description: 'Dominant "S" fist nods up and down at wrist like a head nodding affirmatively.',
    naturalPhrase: 'Yes, that is correct.',
    twoHanded: false,
    confidenceThreshold: 0.75,
    difficulty: 'basic',
    motionSteps: [
      'Make a firm fist with dominant hand at chest height',
      'Nod the fist downward by pivoting at the wrist',
      'Repeat the nod downward two or three times smoothly'
    ],
    visualCues: [
      { step: 1, instruction: 'Hold closed fist at chest level', handShape: 'S-Fist', arrowDirection: 'up', handPositionLabel: 'Upright fist' },
      { step: 2, instruction: 'Nod fist downward at wrist', handShape: 'S-Fist', arrowDirection: 'down', handPositionLabel: 'Nod down' }
    ],
    featurePattern: {
      fingerSignature: [0, 0, 0, 0, 0],
      motionType: 'oscillating',
      targetDirection: 'down'
    }
  },
  {
    id: 'no',
    name: 'No',
    gloss: 'NO',
    category: 'daily',
    description: 'Index and middle fingers snap shut against the thumb, like a firm bird beak closing.',
    naturalPhrase: 'No, thank you.',
    twoHanded: false,
    confidenceThreshold: 0.76,
    difficulty: 'basic',
    motionSteps: [
      'Extend index and middle fingers together, with thumb opened below them',
      'Snap index and middle fingers down to tap against thumb firmly',
      'Keep ring and pinky fingers folded in'
    ],
    visualCues: [
      { step: 1, instruction: 'Extend index + middle fingers, thumb below', handShape: 'Open 3-shape', arrowDirection: 'forward', handPositionLabel: 'Open snap ready' },
      { step: 2, instruction: 'Snap fingers shut firmly against thumb', handShape: 'Pinched shut', arrowDirection: 'down', handPositionLabel: 'Closed snap' }
    ],
    featurePattern: {
      fingerSignature: [1, 1, 1, 0, 0],
      motionType: 'contact',
      targetDirection: 'forward'
    }
  },
  {
    id: 'need_water',
    name: 'Water',
    gloss: 'WATER',
    category: 'daily',
    description: '"W" handshape (index, middle, ring fingers up) taps index finger twice against lower lip/chin.',
    naturalPhrase: 'I need water, please.',
    twoHanded: false,
    confidenceThreshold: 0.75,
    difficulty: 'basic',
    motionSteps: [
      'Form "W" shape with index, middle, and ring fingers extended',
      'Bring index finger near the chin / bottom lip',
      'Tap index finger lightly against chin twice'
    ],
    visualCues: [
      { step: 1, instruction: 'Form W-hand (3 fingers up)', handShape: 'W-Hand', arrowDirection: 'chin', handPositionLabel: 'Near chin' },
      { step: 2, instruction: 'Tap side of index finger twice on chin', handShape: 'W-Hand', arrowDirection: 'contact', handPositionLabel: 'Chin tap' }
    ],
    featurePattern: {
      fingerSignature: [0, 1, 1, 1, 0],
      motionType: 'contact',
      targetDirection: 'chin'
    }
  },
  {
    id: 'hungry',
    name: 'Hungry / Food',
    gloss: 'HUNGRY',
    category: 'daily',
    description: '"C" handshape moves down the center of chest from throat to stomach.',
    naturalPhrase: 'I am hungry, I need food.',
    twoHanded: false,
    confidenceThreshold: 0.72,
    difficulty: 'basic',
    motionSteps: [
      'Form a cupped "C" handshape with palm facing inward toward body',
      'Place at collarbone/throat area',
      'Slide hand smoothly downward toward stomach'
    ],
    visualCues: [
      { step: 1, instruction: 'Form C-shape against upper chest', handShape: 'C-Hand', arrowDirection: 'chest', handPositionLabel: 'Collarbone' },
      { step: 2, instruction: 'Trace downward towards stomach', handShape: 'C-Hand', arrowDirection: 'down', handPositionLabel: 'Stomach level' }
    ],
    featurePattern: {
      fingerSignature: [1, 1, 1, 1, 1],
      motionType: 'linear',
      targetDirection: 'down'
    }
  },
  {
    id: 'restroom',
    name: 'Restroom / Bathroom',
    gloss: 'RESTROOM',
    category: 'daily',
    description: '"T" handshape (thumb between index and middle) shakes side to side gently.',
    naturalPhrase: 'Where is the restroom?',
    twoHanded: false,
    confidenceThreshold: 0.73,
    difficulty: 'basic',
    motionSteps: [
      'Form a "T" handshape with thumb tucked between index and middle fingers',
      'Hold hand upright at shoulder height',
      'Shake the hand gently from side to side two or three times'
    ],
    visualCues: [
      { step: 1, instruction: 'Form T-handshape at shoulder height', handShape: 'T-Hand', arrowDirection: 'up', handPositionLabel: 'Shoulder height' },
      { step: 2, instruction: 'Shake hand gently side to side', handShape: 'T-Hand', arrowDirection: 'wave', handPositionLabel: 'Lateral shake' }
    ],
    featurePattern: {
      fingerSignature: [0, 0, 0, 0, 0],
      motionType: 'oscillating',
      targetDirection: 'forward'
    }
  },
  {
    id: 'where',
    name: 'Where',
    gloss: 'WHERE',
    category: 'questions',
    description: 'Upright index finger shakes gently side to side like a metronome with an inquiring expression.',
    naturalPhrase: 'Where is that located?',
    twoHanded: false,
    confidenceThreshold: 0.74,
    difficulty: 'basic',
    motionSteps: [
      'Extend index finger upward with palm facing forward',
      'Wiggle or pivot the index finger side to side like a metronome',
      'Slightly furrow eyebrows to indicate a question'
    ],
    visualCues: [
      { step: 1, instruction: 'Hold single index finger upright', handShape: '1-Hand', arrowDirection: 'up', handPositionLabel: 'Chest level' },
      { step: 2, instruction: 'Pivot finger left and right smoothly', handShape: '1-Hand', arrowDirection: 'wave', handPositionLabel: 'Oscillation' }
    ],
    featurePattern: {
      fingerSignature: [0, 1, 0, 0, 0],
      motionType: 'oscillating',
      targetDirection: 'forward'
    }
  },
  {
    id: 'name',
    name: 'Name',
    gloss: 'NAME',
    category: 'questions',
    description: '"H" handshapes on both hands tap index & middle fingers twice together in an X form.',
    naturalPhrase: 'What is your name?',
    twoHanded: true,
    confidenceThreshold: 0.72,
    difficulty: 'basic',
    motionSteps: [
      'Form "H" handshape with both hands (index and middle fingers extended)',
      'Cross dominant hand over non-dominant hand at right angles',
      'Tap dominant fingers twice lightly on non-dominant fingers'
    ],
    visualCues: [
      { step: 1, instruction: 'Form H-hands with both hands', handShape: 'Dual H-Hands', arrowDirection: 'forward', handPositionLabel: 'Chest center' },
      { step: 2, instruction: 'Tap top fingers across bottom fingers twice', handShape: 'Crossed H-Hands', arrowDirection: 'contact', handPositionLabel: 'Cross tap' }
    ],
    featurePattern: {
      fingerSignature: [0, 1, 1, 0, 0],
      motionType: 'contact',
      targetDirection: 'chest'
    }
  },
  {
    id: 'nice_to_meet_you',
    name: 'Nice to Meet You',
    gloss: 'NICE-MEET-YOU',
    category: 'greetings',
    description: 'Flat hand glides across other palm ("Nice"), then two index fingers come together ("Meet").',
    naturalPhrase: 'It is very nice to meet you.',
    twoHanded: true,
    confidenceThreshold: 0.75,
    difficulty: 'intermediate',
    motionSteps: [
      'Slide dominant flat palm across non-dominant flat palm forward ("Nice")',
      'Extend both index fingers pointing up ("1" shapes)',
      'Bring index fingers together in center of chest ("Meet")'
    ],
    visualCues: [
      { step: 1, instruction: 'Slide top palm across lower palm smoothly', handShape: 'Flat Palms', arrowDirection: 'forward', handPositionLabel: 'Palm slide' },
      { step: 2, instruction: 'Bring upright index fingers together', handShape: 'Two 1-Hands', arrowDirection: 'chest', handPositionLabel: 'Fingers meet' }
    ],
    featurePattern: {
      fingerSignature: [0, 1, 0, 0, 0],
      motionType: 'two-handed-open',
      targetDirection: 'forward'
    }
  },
  {
    id: 'goodbye',
    name: 'Goodbye',
    gloss: 'GOODBYE',
    category: 'greetings',
    description: 'Open hand held upright waves fingers open and closed or moves side to side in greeting.',
    naturalPhrase: 'Goodbye, have a good day.',
    twoHanded: false,
    confidenceThreshold: 0.76,
    difficulty: 'basic',
    motionSteps: [
      'Raise dominant hand to head height with palm facing forward',
      'Wave hand gently side to side or open and close fingers smoothly',
      'Lower hand in a friendly finish'
    ],
    visualCues: [
      { step: 1, instruction: 'Raise open palm at head height', handShape: 'Open 5-Hand', arrowDirection: 'up', handPositionLabel: 'Head height' },
      { step: 2, instruction: 'Wave side to side', handShape: 'Open 5-Hand', arrowDirection: 'wave', handPositionLabel: 'Lateral wave' }
    ],
    featurePattern: {
      fingerSignature: [1, 1, 1, 1, 1],
      motionType: 'oscillating',
      targetDirection: 'forward'
    }
  },
  {
    id: 'me',
    name: 'I / Me',
    gloss: 'ME',
    category: 'daily',
    description: 'Dominant index finger points gently toward the center of own chest.',
    naturalPhrase: 'I / Me',
    twoHanded: false,
    confidenceThreshold: 0.80,
    difficulty: 'basic',
    motionSteps: [
      'Extend index finger while keeping other fingers tucked',
      'Point index finger inward towards center of your chest',
      'Touch chest lightly or hold 1 inch away'
    ],
    visualCues: [
      { step: 1, instruction: 'Point index finger inward', handShape: '1-Hand', arrowDirection: 'chest', handPositionLabel: 'Pointing to chest' },
      { step: 2, instruction: 'Touch chest softly', handShape: '1-Hand', arrowDirection: 'contact', handPositionLabel: 'Chest touch' }
    ],
    featurePattern: {
      fingerSignature: [0, 1, 0, 0, 0],
      motionType: 'contact',
      targetDirection: 'chest'
    }
  },
  {
    id: 'you',
    name: 'You',
    gloss: 'YOU',
    category: 'daily',
    description: 'Dominant index finger points forward towards conversational partner.',
    naturalPhrase: 'You',
    twoHanded: false,
    confidenceThreshold: 0.80,
    difficulty: 'basic',
    motionSteps: [
      'Extend index finger with palm facing sideways/down',
      'Point directly forward towards the person you are communicating with',
      'Hold position momentarily'
    ],
    visualCues: [
      { step: 1, instruction: 'Point index finger forward', handShape: '1-Hand', arrowDirection: 'forward', handPositionLabel: 'Forward point' }
    ],
    featurePattern: {
      fingerSignature: [0, 1, 0, 0, 0],
      motionType: 'linear',
      targetDirection: 'forward'
    }
  },
  {
    id: 'repeat',
    name: 'Repeat / Again',
    gloss: 'AGAIN',
    category: 'courtesies',
    description: 'Curved right hand arcs up and drops fingertips onto open left palm.',
    naturalPhrase: 'Could you please repeat that?',
    twoHanded: true,
    confidenceThreshold: 0.73,
    difficulty: 'basic',
    motionSteps: [
      'Hold non-dominant palm flat facing sideways or upward',
      'Curve fingertips of dominant hand into a loose cup shape',
      'Arc dominant hand upward, over, and land fingertips onto non-dominant palm'
    ],
    visualCues: [
      { step: 1, instruction: 'Non-dominant palm flat, dominant hand cupped', handShape: 'Flat palm + Bent fingers', arrowDirection: 'up', handPositionLabel: 'Arc preparation' },
      { step: 2, instruction: 'Arc over and land into palm', handShape: 'Bent fingers on palm', arrowDirection: 'down', handPositionLabel: 'Palm landing' }
    ],
    featurePattern: {
      fingerSignature: [1, 1, 1, 1, 1],
      motionType: 'two-handed-open',
      targetDirection: 'down'
    }
  }
];

export const VOCABULARY_BY_ID = new Map<string, SignDefinition>(
  SUPPORTED_SIGNS.map(s => [s.id, s])
);

export const VOCABULARY_BY_GLOSS = new Map<string, SignDefinition>(
  SUPPORTED_SIGNS.map(s => [s.gloss, s])
);
