// FitNexus Mock Data Store - Realistic, comprehensive fitness & nutrition mock data

export const initialUser = {
  id: 'usr-101',
  name: 'Alex Rivera',
  email: 'alex.rivera@fitnexus.io',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
  membership: 'PRO Elite',
  gender: 'Male',
  dob: '1996-05-14',
  age: 28,
  height: 178, // cm
  weight: 74.5, // kg
  startingWeight: 79.3, // kg
  targetWeight: 72.0, // kg
  bodyFat: 14.8, // %
  bio: 'Fitness enthusiast striving for functional strength, athletic agility, and balanced holistic nutrition.',
  joinDate: 'January 2024',
  streak: 24, // days
  reminders: {
    workout: true,
    meal: true,
    water: true,
  },
  preferences: {
    weightUnit: 'kg',
    heightUnit: 'cm',
    waterUnit: 'ml',
    theme: 'dark',
    accentColor: '#16B8B0',
    notifications: true,
    emailNewsletter: true,
    profilePublic: false
  }
};

export const initialMetrics = {
  steps: {
    current: 8432,
    goal: 10000,
    caloriesBurned: 412,
    distanceKm: 6.2,
    trend: '+12% vs yesterday'
  },
  water: {
    current: 2250,
    goal: 3000,
    unit: 'ml',
    glasses: 9,
    targetGlasses: 12,
    trend: '75% of daily target'
  },
  calories: {
    consumed: 1840,
    target: 2400,
    burned: 580,
    remaining: 560,
    net: 1260
  },
  heartRate: {
    current: 72,
    unit: 'BPM',
    resting: 62,
    peak: 148,
    status: 'Optimal Resting',
    sparkline: [
      { time: '06:00', hr: 64 },
      { time: '09:00', hr: 85 },
      { time: '12:00', hr: 78 },
      { time: '15:00', hr: 138 },
      { time: '18:00', hr: 92 },
      { time: '21:00', hr: 72 }
    ]
  }
};

export const weeklyActivityData = [
  { day: 'Mon', workoutMins: 45, targetMins: 45, calories: 420 },
  { day: 'Tue', workoutMins: 60, targetMins: 45, calories: 550 },
  { day: 'Wed', workoutMins: 35, targetMins: 45, calories: 340 },
  { day: 'Thu', workoutMins: 50, targetMins: 45, calories: 490 },
  { day: 'Fri', workoutMins: 65, targetMins: 45, calories: 610 },
  { day: 'Sat', workoutMins: 75, targetMins: 60, calories: 720 },
  { day: 'Sun', workoutMins: 30, targetMins: 30, calories: 280 }
];

export const fitnessDistributionData = [
  { name: 'Strength', value: 40, color: '#16B8B0' },
  { name: 'Cardio', value: 30, color: '#38BDF8' },
  { name: 'Yoga & Mobility', value: 18, color: '#FB923C' },
  { name: 'HIIT', value: 12, color: '#F472B6' }
];

export const fitnessSummaryCards = [
  {
    id: 'sum-running',
    title: 'Running',
    icon: 'Activity',
    color: '#38BDF8',
    gradient: 'from-sky-500/20 to-sky-500/5',
    value: '14.8 km',
    subtext: 'Pace: 5:12 /km',
    progress: 74,
    change: '+2.4 km this week'
  },
  {
    id: 'sum-sleeping',
    title: 'Sleep Quality',
    icon: 'Moon',
    color: '#A78BFA',
    gradient: 'from-purple-500/20 to-purple-500/5',
    value: '7h 45m',
    subtext: 'Deep Sleep: 2h 15m',
    progress: 92,
    change: 'Consistent cycle'
  },
  {
    id: 'sum-lifting',
    title: 'Weight Lifting',
    icon: 'Dumbbell',
    color: '#16B8B0',
    gradient: 'from-teal-500/20 to-teal-500/5',
    value: '4 Sessions',
    subtext: 'Total Volume: 18,400 kg',
    progress: 80,
    change: '+1 session vs last week'
  },
  {
    id: 'sum-weightloss',
    title: 'Weight Delta',
    icon: 'Flame',
    color: '#FB923C',
    gradient: 'from-orange-500/20 to-orange-500/5',
    value: '-2.4 kg',
    subtext: 'Current: 74.5 kg',
    progress: 68,
    change: 'On target to 72.0 kg'
  }
];

export const workoutCategories = [
  { id: 'all', name: 'All Categories', icon: 'Layers' },
  { id: 'boxing', name: 'Boxing', icon: 'Zap' },
  { id: 'cardio', name: 'Cardio', icon: 'Flame' },
  { id: 'gym', name: 'Gym & Strength', icon: 'Dumbbell' },
  { id: 'stretching', name: 'Stretching', icon: 'Smile' },
  { id: 'upper-body', name: 'Upper Body', icon: 'Shield' },
  { id: 'yoga', name: 'Yoga', icon: 'Compass' }
];

export const bestExercises = [
  {
    id: 'ex-1',
    name: 'Barbell Romanian Deadlift',
    category: 'Gym',
    targetMuscle: 'Hamstrings & Glutes',
    duration: '4 sets x 10 reps',
    difficulty: 'Medium',
    image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=400&auto=format&fit=crop&q=80',
    description: 'A foundational hinge movement targeting the posterior chain with eccentric control.'
  },
  {
    id: 'ex-2',
    name: 'Bulgarian Split Squats',
    category: 'Gym',
    targetMuscle: 'Quadriceps & Glute Medius',
    duration: '3 sets x 12 reps / leg',
    difficulty: 'Advanced',
    image: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=400&auto=format&fit=crop&q=80',
    description: 'Unilateral hypertrophy master exercise emphasizing balance, quad drive and hip depth.'
  },
  {
    id: 'ex-3',
    name: 'Battle Rope Slams',
    category: 'Cardio',
    targetMuscle: 'Full Body Conditioning',
    duration: '5 rounds x 30 sec',
    difficulty: 'Medium',
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&auto=format&fit=crop&q=80',
    description: 'Explosive high-intensity metabolic conditioning promoting shoulder endurance and core stability.'
  },
  {
    id: 'ex-4',
    name: 'Overhead Dumbbell Press',
    category: 'Upper Body',
    targetMuscle: 'Anterior Deltoids & Triceps',
    duration: '4 sets x 8 reps',
    difficulty: 'Beginner',
    image: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=400&auto=format&fit=crop&q=80',
    description: 'Vertical pressing compound movement reinforcing shoulder stabilization and core bracing.'
  },
  {
    id: 'ex-5',
    name: 'Vinyasa Flow Sun Salutation',
    category: 'Yoga',
    targetMuscle: 'Spine & Hip Mobility',
    duration: '15 min flow',
    difficulty: 'Beginner',
    image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400&auto=format&fit=crop&q=80',
    description: 'Fluid rhythmic sequence improving cardiovascular breath control and whole-body flexibility.'
  }
];

export const recommendedWorkout = {
  id: 'wk-rec-1',
  title: 'Full-Body Metabolic Blast',
  category: 'Cardio',
  level: 'Advanced',
  duration: '42 min',
  durationMins: 42,
  calories: 480,
  trainer: 'Coach Marcus Vance',
  price: 'Free',
  equipment: 'Dumbbells, Kettlebell',
  rating: 4.9,
  reviewsCount: 382,
  image: 'https://images.unsplash.com/photo-1549060279-7e168fcee0c2?w=800&auto=format&fit=crop&q=80',
  description: 'An athletic high-tempo circuit combining compound strength movements with plyometric surges to elevate heart rate, sculpt lean muscle, and torch maximal calories.',
  exercises: [
    { name: 'Kettlebell Swings', sets: 4, reps: '15 reps', rest: '45s' },
    { name: 'Dumbbell Thrusters', sets: 4, reps: '12 reps', rest: '60s' },
    { name: 'Renegade Rows', sets: 3, reps: '10 reps / side', rest: '45s' },
    { name: 'Box Jumps or Step Ups', sets: 3, reps: '12 reps', rest: '45s' },
    { name: 'Mountain Climbers Burnout', sets: 3, reps: '40 sec', rest: '30s' }
  ]
};

export const initialWorkouts = [
  {
    id: 'wk-1',
    title: 'Strength & Conditioning',
    subtitle: 'Compound power, athletic stability & structural density',
    category: 'Gym',
    goal: 'Legs',
    level: 'Medium',
    duration: '35 min',
    durationMins: 35,
    calories: 390,
    price: 'Free',
    equipment: 'Dumbbells',
    rating: 4.8,
    trainer: 'Elena Rostova',
    isFavorite: true,
    image: 'https://images.unsplash.com/photo-1534367507873-d2d7e24c797f?w=600&auto=format&fit=crop&q=80',
    description: 'Focus on multi-joint barbell and dumbbell lifts designed to build resilient functional power and elevate basal metabolic rate.',
    exercises: [
      { name: 'Goblet Squats', sets: 4, reps: '12 reps', rest: '60s' },
      { name: 'Romanian Deadlifts', sets: 4, reps: '10 reps', rest: '60s' },
      { name: 'Walking Dumbbell Lunges', sets: 3, reps: '12 reps / leg', rest: '45s' },
      { name: 'Standing Calf Raises', sets: 3, reps: '15 reps', rest: '30s' }
    ]
  },
  {
    id: 'wk-2',
    title: 'Beginner Yoga Flow',
    subtitle: 'Mindful breathing, hip opening & spinal decompression',
    category: 'Yoga',
    goal: 'Yoga',
    level: 'Beginner',
    duration: '20 min',
    durationMins: 20,
    calories: 140,
    price: 'Free',
    equipment: 'Yoga mat',
    rating: 4.9,
    trainer: 'Maya Lin',
    isFavorite: false,
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&auto=format&fit=crop&q=80',
    description: 'A gentle and restorative sequence designed to loosen tight hamstrings, release lower back tension, and promote deep mental clarity.',
    exercises: [
      { name: 'Cat-Cow Flow', sets: 2, reps: '10 cycles', rest: '0s' },
      { name: 'Downward-Facing Dog', sets: 3, reps: '45 sec hold', rest: '15s' },
      { name: 'Warrior II Sequence', sets: 2, reps: '30 sec / side', rest: '15s' },
      { name: 'Pigeon Pose', sets: 2, reps: '60 sec / side', rest: '20s' },
      { name: 'Child’s Pose', sets: 1, reps: '2 min rest', rest: '0s' }
    ]
  },
  {
    id: 'wk-3',
    title: 'High-Intensity Interval Training',
    subtitle: 'Maximum heart-rate spikes with anaerobic conditioning',
    category: 'Cardio',
    goal: 'Running',
    level: 'Advanced',
    duration: '25 min',
    durationMins: 25,
    calories: 420,
    price: 'Premium',
    equipment: 'Kettlebell',
    rating: 4.9,
    trainer: 'Tariq Johnson',
    isFavorite: true,
    image: 'https://images.unsplash.com/photo-1601422407692-ec4eeec1d9b3?w=600&auto=format&fit=crop&q=80',
    description: 'Tabata intervals and explosive kettlebell complexes that challenge cardio endurance, lactate threshold, and explosive stamina.',
    exercises: [
      { name: 'Kettlebell High Pulls', sets: 4, reps: '40s on / 20s off', rest: '20s' },
      { name: 'Burpee Box Jump Overs', sets: 4, reps: '40s on / 20s off', rest: '20s' },
      { name: 'Speed Skaters', sets: 4, reps: '40s on / 20s off', rest: '20s' },
      { name: 'Hollow Body Rocks', sets: 4, reps: '40s on / 20s off', rest: '20s' }
    ]
  },
  {
    id: 'wk-4',
    title: 'Pilates Reformer & Mat Core',
    subtitle: 'Intense pelvic floor, transverse abdominis & posture',
    category: 'Stretching',
    goal: 'Stretch',
    level: 'Medium',
    duration: '30 min',
    durationMins: 30,
    calories: 220,
    price: 'Premium',
    equipment: 'Yoga mat',
    rating: 4.7,
    trainer: 'Chloe Dupont',
    isFavorite: false,
    image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600&auto=format&fit=crop&q=80',
    description: 'Deep core activation focusing on the transverse abdominis, spine alignment, and isometric breath control without joint strain.',
    exercises: [
      { name: 'Pilates Hundred', sets: 1, reps: '100 pumps', rest: '30s' },
      { name: 'Roll-Up to Teaser', sets: 3, reps: '8 slow reps', rest: '45s' },
      { name: 'Single-Leg Stretch', sets: 3, reps: '12 / side', rest: '30s' },
      { name: 'Side Plank Hip Dips', sets: 3, reps: '10 / side', rest: '30s' }
    ]
  },
  {
    id: 'wk-5',
    title: 'Functional Core & Abs Training',
    subtitle: 'Anti-rotational rigidity & athletic kinetic chain transfer',
    category: 'Upper Body',
    goal: 'Personal',
    level: 'Beginner',
    duration: '18 min',
    durationMins: 18,
    calories: 190,
    price: 'Free',
    equipment: 'Yoga mat',
    rating: 4.6,
    trainer: 'Alex Rivera',
    isFavorite: true,
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&auto=format&fit=crop&q=80',
    description: 'Stabilize your lumbar spine with proven physical therapy principles. Builds bulletproof abdominal definition and rotational power.',
    exercises: [
      { name: 'Deadbugs with Press', sets: 3, reps: '12 / side', rest: '30s' },
      { name: 'Bird Dogs with Squeeze', sets: 3, reps: '10 / side', rest: '30s' },
      { name: 'Paloff Press (or Plank hold)', sets: 3, reps: '45 sec hold', rest: '45s' },
      { name: 'Bicycle Crunches', sets: 3, reps: '20 reps', rest: '30s' }
    ]
  },
  {
    id: 'wk-6',
    title: 'Calisthenics Bodyweight Strength',
    subtitle: 'Strict pull-ups, pushups & gymnastics ring stability',
    category: 'Upper Body',
    goal: 'Arms',
    level: 'Advanced',
    duration: '38 min',
    durationMins: 38,
    calories: 360,
    price: 'Free',
    equipment: 'Bodyweight',
    rating: 4.9,
    trainer: 'David Chen',
    isFavorite: false,
    image: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=600&auto=format&fit=crop&q=80',
    description: 'Master your bodyweight with strict tempo push-ups, explosive chin-ups, and dip bar progressions for dense, natural muscle growth.',
    exercises: [
      { name: 'Strict Wide Pull-ups', sets: 4, reps: '8-10 reps', rest: '90s' },
      { name: 'Parallel Bar Dips', sets: 4, reps: '12-15 reps', rest: '75s' },
      { name: 'Diamond Push-ups', sets: 3, reps: '15 reps', rest: '60s' },
      { name: 'Inverted Australian Rows', sets: 3, reps: '12 reps', rest: '60s' }
    ]
  },
  {
    id: 'wk-7',
    title: 'Yoga for Stress Relief & Hip Openers',
    subtitle: 'Nervous system down-regulation & myofascial relaxation',
    category: 'Yoga',
    goal: 'Stretch',
    level: 'Beginner',
    duration: '25 min',
    durationMins: 25,
    calories: 120,
    price: 'Free',
    equipment: 'Yoga mat',
    rating: 4.8,
    trainer: 'Maya Lin',
    isFavorite: false,
    image: 'https://images.unsplash.com/photo-1510894347713-fc3ed6fdf539?w=600&auto=format&fit=crop&q=80',
    description: 'Target tight hip flexors and chronic postural fatigue through long, restorative holds and parasympathetic diaphragmatic breathing.',
    exercises: [
      { name: 'Low Lunge Dragon Pose', sets: 2, reps: '90 sec / side', rest: '15s' },
      { name: 'Reclined Butterfly', sets: 1, reps: '3 min hold', rest: '0s' },
      { name: 'Thread the Needle', sets: 2, reps: '60 sec / side', rest: '15s' },
      { name: 'Legs Up The Wall', sets: 1, reps: '4 min hold', rest: '0s' }
    ]
  },
  {
    id: 'wk-8',
    title: 'Boxing Cardio & Agility Circuit',
    subtitle: 'Footwork ladders, jab-cross combos & head movement',
    category: 'Boxing',
    goal: 'Boxing',
    level: 'Medium',
    duration: '32 min',
    durationMins: 32,
    calories: 440,
    price: 'Premium',
    equipment: 'Dumbbells',
    rating: 4.9,
    trainer: 'Dmitri Volkov',
    isFavorite: true,
    image: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=600&auto=format&fit=crop&q=80',
    description: 'Sharpen your reflexes, punch volume, and lateral footwork with dynamic shadowboxing and light dumbbell burnouts.',
    exercises: [
      { name: 'Shadowboxing: 1-2-3-2 Combos', sets: 4, reps: '3 min rounds', rest: '60s' },
      { name: 'Slip and Duck Counters', sets: 3, reps: '3 min rounds', rest: '60s' },
      { name: 'Jump Rope High Knees', sets: 4, reps: '60 sec sprints', rest: '30s' },
      { name: 'Plank Punches', sets: 3, reps: '30 sec burnout', rest: '30s' }
    ]
  },
  {
    id: 'wk-9',
    title: 'Chest & Tricep Hypertrophy',
    subtitle: 'Progressive overload benching & mechanical dropsets',
    category: 'Upper Body',
    goal: 'Chest',
    level: 'Advanced',
    duration: '45 min',
    durationMins: 45,
    calories: 460,
    price: 'Premium',
    equipment: 'Dumbbells',
    rating: 4.8,
    trainer: 'Elena Rostova',
    isFavorite: false,
    image: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=600&auto=format&fit=crop&q=80',
    description: 'Sculpt dense upper pectoral fibers and powerful lockout triceps with incline pressing variations and cable fly simulations.',
    exercises: [
      { name: 'Incline Dumbbell Bench Press', sets: 4, reps: '8-10 reps', rest: '90s' },
      { name: 'Flat Dumbbell Chest Flyes', sets: 3, reps: '12 reps', rest: '60s' },
      { name: 'Overhead Tricep Extension', sets: 3, reps: '12 reps', rest: '60s' },
      { name: 'Close-Grip Push-ups Burnout', sets: 2, reps: 'To failure', rest: '60s' }
    ]
  }
];

export const initialUserWorkouts = [
  {
    id: 'uwk-1',
    workoutName: 'Morning Hypertrophy Push',
    exerciseName: 'Incline Dumbbell Press',
    category: 'Upper Body',
    sets: 4,
    reps: 10,
    weight: 28,
    duration: 45,
    date: '2026-11-07',
    notes: 'Felt strong, increased weight on 3rd set. Clean lockouts.'
  },
  {
    id: 'uwk-2',
    workoutName: 'Heavy Leg Day Anchor',
    exerciseName: 'Barbell Back Squats',
    category: 'Gym',
    sets: 5,
    reps: 8,
    weight: 105,
    duration: 55,
    date: '2026-11-05',
    notes: 'Hit all sets with parallel depth. Great hamstring engagement.'
  },
  {
    id: 'uwk-3',
    workoutName: 'Midweek Recovery Flow',
    exerciseName: 'Deep Pigeon & Spine Roll',
    category: 'Yoga',
    sets: 3,
    reps: 12,
    weight: 0,
    duration: 25,
    date: '2026-11-04',
    notes: 'Relieved lower back tightness from sitting. Excellent breath rhythm.'
  },
  {
    id: 'uwk-4',
    workoutName: 'Explosive Boxing Conditioning',
    exerciseName: 'Speed Bag & Slip Rope',
    category: 'Boxing',
    sets: 6,
    reps: 3,
    weight: 2,
    duration: 35,
    date: '2026-11-02',
    notes: 'High sweat output. Heart rate averaged 155 BPM.'
  }
];

export const initialNutritionGoals = {
  calories: { current: 1840, target: 2400, unit: 'kcal' },
  protein: { current: 142, target: 175, unit: 'g' },
  carbs: { current: 195, target: 260, unit: 'g' },
  fats: { current: 52, target: 70, unit: 'g' },
  water: { current: 2250, target: 3000, unit: 'ml' }
};

export const initialFoodCatalog = [
  {
    id: 'food-1',
    name: 'Scrambled Eggs with Turkey Bacon & Avocado',
    category: 'Breakfast',
    mealType: 'Breakfast',
    calories: 420,
    protein: 34,
    carbs: 8,
    fats: 28,
    image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=600&auto=format&fit=crop&q=80',
    description: 'Fluffy pastured eggs whipped with fresh chives, crispy smoked turkey bacon, and half a sliced ripe Haas avocado.',
    ingredients: [
      '3 large free-range eggs',
      '2 slices uncured smoked turkey bacon',
      '1/2 ripe avocado sliced',
      '1 tsp grass-fed ghee',
      'Pinch of Himalayan pink salt & cracked black pepper'
    ],
    prepInstructions: [
      'Heat a skillet over medium heat and crisp turkey bacon for 2-3 mins per side.',
      'Whisk eggs in a bowl with a dash of water and sea salt.',
      'Melt ghee in the pan, pour whisked eggs, and gently fold with a silicone spatula.',
      'Plate with fresh sliced avocado and cracked black pepper.'
    ]
  },
  {
    id: 'food-2',
    name: 'Grilled Salmon & Quinoa Power Bowl',
    category: 'Lunch',
    mealType: 'Lunch',
    calories: 580,
    protein: 44,
    carbs: 48,
    fats: 22,
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80',
    description: 'Wild Alaskan salmon fillet grilled to perfection, served over fluffy tri-color quinoa, roasted sweet potatoes, and lemon tahini dressing.',
    ingredients: [
      '180g wild Alaskan salmon fillet',
      '1 cup cooked tri-color quinoa',
      '1/2 cup roasted sweet potato cubes',
      '1 cup baby spinach leaves',
      '1 tbsp tahini mixed with lemon juice and garlic'
    ],
    prepInstructions: [
      'Season salmon with olive oil, paprika, salt, and black pepper.',
      'Sear salmon skin-side down for 4 mins, flip and cook 3 mins until flakey.',
      'Assemble warm quinoa base, spinach, and roasted sweet potatoes in a deep bowl.',
      'Top with salmon fillet and drizzle creamy lemon tahini sauce.'
    ]
  },
  {
    id: 'food-3',
    name: 'Chicken Breast, Brown Rice & Broccoli',
    category: 'Dinner',
    mealType: 'Dinner',
    calories: 510,
    protein: 48,
    carbs: 52,
    fats: 12,
    image: 'https://images.unsplash.com/photo-1532550907401-a500c9a57435?w=600&auto=format&fit=crop&q=80',
    description: 'Clean athletic staple: herb-marinated lean chicken breast with steamed tender broccoli florets and fiber-rich brown jasmine rice.',
    ingredients: [
      '200g boneless skinless chicken breast',
      '1.25 cups steamed brown jasmine rice',
      '1.5 cups steamed broccoli florets',
      '1 tbsp extra virgin olive oil',
      'Garlic powder, dried rosemary, sea salt'
    ],
    prepInstructions: [
      'Pound chicken breast evenly and marinate in olive oil, garlic, and herbs for 15 mins.',
      'Grill on medium-high heat for 6 mins per side until internal temp reaches 74°C (165°F).',
      'Steam broccoli florets until vibrant green yet crisp (approx. 4 mins).',
      'Serve alongside fragrant brown rice and squeeze fresh lemon.'
    ]
  },
  {
    id: 'food-4',
    name: 'Oatmeal with Blueberries & Whey Isolate',
    category: 'Breakfast',
    mealType: 'Breakfast',
    calories: 380,
    protein: 32,
    carbs: 50,
    fats: 6,
    image: 'https://images.unsplash.com/photo-1584776296944-ab6fb57b0bdd?w=600&auto=format&fit=crop&q=80',
    description: 'Slow-cooked rolled oats stirred with vanilla whey isolate, wild blueberries, chia seeds, and a dash of Ceylon cinnamon.',
    ingredients: [
      '60g rolled whole oats',
      '1 scoop (30g) vanilla whey protein isolate',
      '1/2 cup fresh wild blueberries',
      '1 tsp chia seeds',
      '1 cup unsweetened almond milk'
    ],
    prepInstructions: [
      'Simmer oats in almond milk for 5 mins until creamy.',
      'Remove from heat, let cool for 60 seconds, then whisk in protein powder smoothly.',
      'Garnish with wild blueberries, chia seeds, and cinnamon.'
    ]
  },
  {
    id: 'food-5',
    name: 'Superfood Berry & Spinach Protein Smoothie',
    category: 'Snacks',
    mealType: 'Snacks',
    calories: 290,
    protein: 26,
    carbs: 36,
    fats: 5,
    image: 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=600&auto=format&fit=crop&q=80',
    description: 'Revitalizing post-workout shake blending fresh baby spinach, organic frozen berries, whey protein, and coconut water.',
    ingredients: [
      '1 scoop vanilla or berry plant protein',
      '1 cup mixed frozen raspberries & blackberries',
      '1 large handful baby spinach',
      '200ml chilled pure coconut water',
      '1 tbsp hemp hearts'
    ],
    prepInstructions: [
      'Add coconut water and spinach to blender base; pulse until liquefied.',
      'Add frozen berries and protein powder; blend on high speed for 45 seconds.',
      'Pour into a chilled glass and top with hemp hearts.'
    ]
  },
  {
    id: 'food-6',
    name: 'Grilled Steak & Roasted Asparagus',
    category: 'Dinner',
    mealType: 'Dinner',
    calories: 540,
    protein: 50,
    carbs: 14,
    fats: 32,
    image: 'https://images.unsplash.com/photo-1558030006-450675393462?w=600&auto=format&fit=crop&q=80',
    description: 'Tender sirloin steak seared to medium rare with garlic herb butter, alongside tender charred asparagus spears.',
    ingredients: [
      '220g lean grass-fed sirloin steak',
      '1 bunch fresh asparagus spears',
      '1 tbsp grass-fed butter',
      '2 cloves minced garlic',
      'Coarse sea salt and cracked black pepper'
    ],
    prepInstructions: [
      'Season sirloin generously with coarse sea salt and black pepper.',
      'Sear in a smoking cast-iron pan for 3 mins per side, basting with garlic butter.',
      'Toss asparagus in pan drippings and roast until tender-crisp.',
      'Rest steak for 5 mins before slicing against the grain.'
    ]
  }
];

export const initialLoggedMeals = [
  {
    id: 'log-1',
    name: 'Scrambled Eggs with Turkey Bacon & Avocado',
    mealType: 'Breakfast',
    calories: 420,
    protein: 34,
    carbs: 8,
    fats: 28,
    quantity: '1 serving',
    time: '08:15 AM'
  },
  {
    id: 'log-2',
    name: 'Superfood Berry & Spinach Protein Smoothie',
    mealType: 'Snacks',
    calories: 290,
    protein: 26,
    carbs: 36,
    fats: 5,
    quantity: '1 tall shake (350ml)',
    time: '11:30 AM'
  },
  {
    id: 'log-3',
    name: 'Grilled Salmon & Quinoa Power Bowl',
    mealType: 'Lunch',
    calories: 580,
    protein: 44,
    carbs: 48,
    fats: 22,
    quantity: '1 bowl',
    time: '01:45 PM'
  },
  {
    id: 'log-4',
    name: 'Greek Yogurt with Honey & Walnuts',
    mealType: 'Snacks',
    calories: 230,
    protein: 18,
    carbs: 18,
    fats: 10,
    quantity: '200g cup',
    time: '04:30 PM'
  },
  {
    id: 'log-5',
    name: 'Chicken Breast, Brown Rice & Broccoli',
    mealType: 'Dinner',
    calories: 510,
    protein: 48,
    carbs: 52,
    fats: 12,
    quantity: '1 plate',
    time: '07:30 PM'
  }
];

export const initialGoals = [
  {
    id: 'goal-1',
    title: 'Lean Bodyweight Target',
    category: 'Weight Loss',
    type: 'weight',
    current: 74.5,
    target: 72.0,
    unit: 'kg',
    startValue: 79.3,
    deadline: '2026-12-31',
    notes: 'Maintain muscle mass while dropping remaining abdominal subcutaneous fat.',
    completed: false
  },
  {
    id: 'goal-2',
    title: 'Daily Active Step Count',
    category: 'Daily Steps',
    type: 'steps',
    current: 8432,
    target: 10000,
    unit: 'steps/day',
    startValue: 5000,
    deadline: 'Daily',
    notes: 'Take afternoon walking breaks and hit at least 8k before evening dinner.',
    completed: false
  },
  {
    id: 'goal-3',
    title: 'Weekly Workout Consistency',
    category: 'Workout Frequency',
    type: 'frequency',
    current: 4,
    target: 5,
    unit: 'sessions/week',
    startValue: 2,
    deadline: 'Weekly',
    notes: '4 lifting days + 1 dedicated HIIT / mobility session per week.',
    completed: false
  },
  {
    id: 'goal-4',
    title: 'Daily Hydration Minimum',
    category: 'Water Intake',
    type: 'water',
    current: 2250,
    target: 3000,
    unit: 'ml/day',
    startValue: 1500,
    deadline: 'Daily',
    notes: 'Drink 500ml upon waking and 750ml during workout windows.',
    completed: false
  },
  {
    id: 'goal-5',
    title: 'Daily Protein Benchmark',
    category: 'Calorie & Macro Goal',
    type: 'nutrition',
    current: 142,
    target: 175,
    unit: 'g/day',
    startValue: 100,
    deadline: 'Daily',
    notes: 'Aim for 2.2g per kg of bodyweight to optimize myofibrillar protein synthesis.',
    completed: false
  },
  {
    id: 'goal-6',
    title: 'Deadlift 2x Bodyweight',
    category: 'Weight Gain & Strength',
    type: 'strength',
    current: 135,
    target: 150,
    unit: 'kg PR',
    startValue: 110,
    deadline: '2026-12-15',
    notes: 'Strict conventional barbell pull with zero lumbar rounding.',
    completed: true
  }
];

export const initialSchedules = [
  {
    id: 'sch-1',
    activityName: 'Upper Body Power & Core',
    activityType: 'Workout',
    category: 'Gym',
    date: '2026-11-09',
    time: '07:30 AM',
    duration: '50 min',
    notes: 'Incline bench press, weighted dips, and hanging leg raises.',
    completed: false
  },
  {
    id: 'sch-2',
    activityName: 'Hydration & Post-Workout Whey Shake',
    activityType: 'Meal Reminder',
    category: 'Diet',
    date: '2026-11-09',
    time: '08:45 AM',
    duration: '15 min',
    notes: '35g whey isolate + 5g creatine monohydrate + 500ml water.',
    completed: false
  },
  {
    id: 'sch-3',
    activityName: 'Sunset 5K Tempo Run',
    activityType: 'Cardio',
    category: 'Cardio',
    date: '2026-11-10',
    time: '06:00 PM',
    duration: '35 min',
    notes: 'Maintain 5:15/km pace across riverside trail.',
    completed: false
  },
  {
    id: 'sch-4',
    activityName: 'Lower Body Quad & Posterior Focus',
    activityType: 'Workout',
    category: 'Gym',
    date: '2026-11-11',
    time: '07:00 AM',
    duration: '60 min',
    notes: 'Barbell squats, Romanian deadlifts, Bulgarian split squats.',
    completed: false
  },
  {
    id: 'sch-5',
    activityName: 'Vinyasa Yoga & Hip Mobility',
    activityType: 'Rest & Recovery',
    category: 'Yoga',
    date: '2026-11-12',
    time: '06:30 PM',
    duration: '30 min',
    notes: 'Decompress hips and lower back with deep restorative poses.',
    completed: false
  },
  {
    id: 'sch-6',
    activityName: 'Weekly Body Composition Weigh-In',
    activityType: 'Check-in',
    category: 'Progress',
    date: '2026-11-13',
    time: '07:15 AM',
    duration: '10 min',
    notes: 'Fast state measurement before drinking water.',
    completed: false
  }
];

export const initialProgressHistory = [
  {
    id: 'prog-1',
    date: '2026-10-10',
    weight: 79.3,
    chest: 104,
    waist: 87,
    hips: 98,
    arms: 37.0,
    bodyFat: 18.2,
    notes: 'Starting baseline measurement for Q4 fitness sprint.'
  },
  {
    id: 'prog-2',
    date: '2026-10-17',
    weight: 78.4,
    chest: 104.2,
    waist: 86,
    hips: 97.5,
    arms: 37.2,
    bodyFat: 17.5,
    notes: 'Water weight shed, energy levels solid with 2,400 kcal budget.'
  },
  {
    id: 'prog-3',
    date: '2026-10-24',
    weight: 77.1,
    chest: 104.5,
    waist: 84.5,
    hips: 96.5,
    arms: 37.5,
    bodyFat: 16.8,
    notes: 'Waist circumference down 2.5cm! Strength on compound lifts maintained.'
  },
  {
    id: 'prog-4',
    date: '2026-10-31',
    weight: 76.0,
    chest: 104.8,
    waist: 83.0,
    hips: 95.8,
    arms: 37.8,
    bodyFat: 15.9,
    notes: 'Consistent 5 days/week training streak.'
  },
  {
    id: 'prog-5',
    date: '2026-11-07',
    weight: 74.5,
    chest: 105.0,
    waist: 81.5,
    hips: 95.0,
    arms: 38.0,
    bodyFat: 14.8,
    notes: 'Abdominal vascularity showing. Surpassed 4.8kg total drop!'
  }
];

export const initialNotifications = [
  {
    id: 'notif-1',
    type: 'workout',
    title: 'Upcoming Workout Reminder',
    message: 'Upper Body Power & Core is scheduled tomorrow at 07:30 AM.',
    timestamp: '15 mins ago',
    read: false,
    icon: 'Dumbbell'
  },
  {
    id: 'notif-2',
    type: 'goal',
    title: 'Milestone Unlocked! 🏆',
    message: 'You have achieved your Deadlift 2x Bodyweight target at 150 kg!',
    timestamp: '3 hours ago',
    read: false,
    icon: 'Trophy'
  },
  {
    id: 'notif-3',
    type: 'nutrition',
    title: 'Daily Hydration Check',
    message: 'You are at 2,250 ml. Only 750 ml left to hit today’s 3,000 ml target.',
    timestamp: '5 hours ago',
    read: true,
    icon: 'Droplet'
  },
  {
    id: 'notif-4',
    type: 'milestone',
    title: 'Streak Multiplier Active 🔥',
    message: 'You are on a 24-day consecutive active fitness streak. Keep going!',
    timestamp: 'Yesterday',
    read: true,
    icon: 'Flame'
  },
  {
    id: 'notif-5',
    type: 'meal',
    title: 'Evening Macro Budget',
    message: '560 kcal and 33g protein remaining for dinner.',
    timestamp: 'Yesterday',
    read: true,
    icon: 'Utensils'
  }
];
