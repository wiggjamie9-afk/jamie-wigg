// Meal planning and recipe display
class MealPlanner {
  constructor() {
    this.currentWeek = 1;
    this.meals = {};
  }

  generateMealForDay(day, month) {
    // Phase-based meal recommendations
    const phases = {
      1: { // Liquid diet (week 1)
        breakfast: 'Protein shake (protein powder + water)',
        lunch: 'Broth (chicken or vegetable)',
        dinner: 'Herbal tea with honey',
      },
      2: { // Pureed diet (weeks 2-3)
        breakfast: 'Pureed oatmeal with honey',
        lunch: 'Pureed chicken with soft vegetables',
        dinner: 'Pureed cottage cheese with applesauce',
      },
      3: { // Soft diet (weeks 4-8)
        breakfast: 'Scrambled eggs (2oz)',
        lunch: 'Soft-cooked salmon (3oz)',
        dinner: 'Ground turkey (3oz) with soft veggies',
      },
      6: { // Solid diet (months 2-6)
        breakfast: 'Egg whites with whole grain toast',
        lunch: 'Grilled chicken breast (4oz) with brown rice',
        dinner: 'Baked white fish (4oz) with sweet potato',
      },
      12: { // Maintenance (months 7-12)
        breakfast: 'Greek yogurt with berries and granola',
        lunch: 'Lean turkey sandwich on whole wheat',
        dinner: 'Grilled lean beef (5oz) with roasted vegetables',
      },
    };

    let phase = month <= 1 ? 1 : month <= 2 ? 2 : month <= 3 ? 3 : month <= 6 ? 6 : 12;
    const phaseRecipes = phases[phase] || phases[12];

    return {
      breakfast: phaseRecipes.breakfast,
      snack1: 'Protein bar (15-20g protein)',
      lunch: phaseRecipes.lunch,
      snack2: 'Greek yogurt (4oz)',
      dinner: phaseRecipes.dinner,
      water: '64+ oz throughout day',
    };
  }

  generateWeekPlan(month) {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const weekPlan = {};

    days.forEach(day => {
      weekPlan[day] = this.generateMealForDay(day, month);
    });

    return weekPlan;
  }

  generateShoppingList(weekPlan) {
    const items = new Set();

    // Analyze meals and extract common ingredients
    const baseItems = [
      'Eggs',
      'Chicken breast',
      'Fish fillets',
      'Ground turkey',
      'Greek yogurt',
      'Cottage cheese',
      'Broth (chicken)',
      'Brown rice',
      'Sweet potato',
      'Broccoli',
      'Spinach',
      'Carrots',
      'Protein powder',
      'Oats',
      'Whole grain bread',
      'Almond butter',
      'Berries',
      'Supplements (iron, B12, calcium)',
    ];

    baseItems.forEach(item => items.add(item));
    return Array.from(items);
  }

  calculateMacros(meal, phase) {
    // Phase-based macro targets
    const targets = {
      1: { protein: 30, carbs: 30, fat: 15 },
      2: { protein: 40, carbs: 40, fat: 20 },
      3: { protein: 50, carbs: 45, fat: 25 },
      6: { protein: 60, carbs: 50, fat: 30 },
      12: { protein: 70, carbs: 60, fat: 35 },
    };

    return targets[phase] || targets[12];
  }

  validateMeal(mealText, phase) {
    // Check for restricted foods
    const restricted = ['sugar', 'soda', 'carbonated', 'fried', 'high fat', 'spicy'];
    const warnings = [];

    restricted.forEach(item => {
      if (mealText.toLowerCase().includes(item)) {
        warnings.push(`⚠️ Contains ${item} - may not be suitable for your phase`);
      }
    });

    return {
      valid: warnings.length === 0,
      warnings,
    };
  }
}

const mealPlanner = new MealPlanner();
