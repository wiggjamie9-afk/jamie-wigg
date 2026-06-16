// Claude AI meal planning & analysis
class ClaudeAI {
  constructor() {
    this.apiKey = localStorage.getItem('claude-api-key');
    this.baseUrl = 'https://api.anthropic.com/v1/messages';
  }

  setApiKey(key) {
    this.apiKey = key;
    localStorage.setItem('claude-api-key', key);
  }

  async generateMealPlan(userProfile) {
    if (!this.apiKey) {
      console.error('Claude API key not set');
      return null;
    }

    const prompt = this.buildMealPlanPrompt(userProfile);

    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': this.apiKey,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: 'claude-opus-4-8',
          max_tokens: 2048,
          system: this.buildSystemPrompt(),
          messages: [{
            role: 'user',
            content: prompt,
          }],
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        console.error('Claude API error:', error);
        throw new Error(`Claude API error: ${response.status}`);
      }

      const data = await response.json();
      return data.content[0].text;
    } catch (err) {
      console.error('Claude API call failed:', err);
      return null;
    }
  }

  async analyzeLabResults(labText) {
    if (!this.apiKey) {
      console.error('Claude API key not set');
      return null;
    }

    const prompt = `
Analyze these post-operative lab results for a weight loss surgery patient:

${labText}

Provide:
1. Summary of key findings
2. Any deficiencies to address
3. Recommended nutritional interventions
4. When to follow up with surgeon
    `;

    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': this.apiKey,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: 'claude-opus-4-8',
          max_tokens: 1024,
          system: 'You are a medical nutritionist specializing in post-operative weight loss surgery support. Provide evidence-based recommendations.',
          messages: [{
            role: 'user',
            content: prompt,
          }],
        }),
      });

      if (!response.ok) {
        throw new Error(`Claude API error: ${response.status}`);
      }

      const data = await response.json();
      return data.content[0].text;
    } catch (err) {
      console.error('Claude analysis failed:', err);
      return null;
    }
  }

  async generateFitnessProgram(userProfile) {
    if (!this.apiKey) return null;

    const prompt = `
Generate a ${userProfile.month}-month post-operative fitness program for:
- Surgery type: ${userProfile.surgeryType}
- Current fitness level: ${userProfile.fitnessLevel}
- Goals: ${userProfile.fitnessGoals.join(', ')}
- Surgeon clearances: ${userProfile.clearances.join(', ')}

Provide phase-appropriate exercises with:
1. Exercise descriptions
2. Duration and frequency
3. Intensity progression
4. Safety precautions
5. Signs to stop
    `;

    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': this.apiKey,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: 'claude-opus-4-8',
          max_tokens: 1536,
          system: 'You are a post-operative exercise specialist. Prioritize safety and gradual progression.',
          messages: [{
            role: 'user',
            content: prompt,
          }],
        }),
      });

      if (!response.ok) throw new Error(`API error: ${response.status}`);
      const data = await response.json();
      return data.content[0].text;
    } catch (err) {
      console.error('Fitness program generation failed:', err);
      return null;
    }
  }

  buildSystemPrompt() {
    return `You are a specialized post-operative nutrition AI coach for weight loss surgery patients.

Your role:
- Generate medically accurate, safe, personalized meal plans
- Consider surgery type, healing phase, and lab results
- Recommend appropriate protein intake, meal frequency, and portion sizes
- Flag potential deficiencies (iron, B12, calcium, vitamin D)
- Always include medical disclaimers
- Emphasize this is not a replacement for professional medical advice

Safety rules:
- Meals should be soft, easily digestible
- Avoid high-sugar, high-fat, carbonated items
- Prioritize protein in every meal (25-30g minimum post-recovery)
- Suggest small, frequent meals based on surgery type
- Recommend supplements if deficiencies noted`;
  }

  buildMealPlanPrompt(userProfile) {
    return `
PATIENT PROFILE:
- Surgery Type: ${userProfile.surgeryType}
- Surgery Date: ${userProfile.surgeryDate}
- Current Month Post-Op: ${userProfile.currentMonth}
- Current Weight: ${userProfile.currentWeight} lbs
- Target Weight: ${userProfile.targetWeight} lbs
- Caloric Target: ${this.getCalorieTarget(userProfile.currentMonth)} calories/day
- Lab Values: Protein ${userProfile.protein}g/dL, Iron ${userProfile.iron}µg/dL, B12 ${userProfile.b12}pg/mL, Calcium ${userProfile.calcium}mg/dL
- Surgeon Clearances: ${userProfile.clearances.join(', ')}

GOALS:
- Weight Loss: ${userProfile.weightLossGoal} lbs in 12 months
- Fitness: ${userProfile.fitnessGoals.join(', ')}
- Lifestyle: ${userProfile.lifeGoals.join(', ')}

TASK:
Generate a 1-week personalized meal plan with:
1. Daily meal schedule (breakfast, snack, lunch, snack, dinner)
2. Specific recipes with exact portion sizes in ounces
3. Macro targets (protein/carbs/fat in grams)
4. Meal timing (e.g., 7am breakfast, 10am snack)
5. Hydration plan (64oz minimum daily)
6. Supplement recommendations
7. Phase-safety notes
8. Shopping list for the week
9. Meal prep tips

CRITICAL:
- This is NOT medical advice—consult surgeon with concerns
- Include all appropriate disclaimers
- Avoid triggers and restriction foods per phase
- Emphasize slow eating, thorough chewing, hydration between meals
    `;
  }

  getCalorieTarget(month) {
    if (month <= 1) return 400; // Immediate post-op: liquid diet
    if (month <= 2) return 600; // Soft diet phase
    if (month <= 3) return 800; // Early solid phase
    if (month <= 6) return 1000; // Stabilization phase
    return 1200; // Maintenance phase (months 6-12)
  }
}

const claudeAI = new ClaudeAI();
