// Medical tracking and lab value analysis
class MedicalTracker {
  constructor() {
    this.labHistory = [];
    this.normalRanges = {
      protein: { min: 6.0, max: 8.3, unit: 'g/dL' },
      albumin: { min: 3.4, max: 5.4, unit: 'g/dL' },
      iron: { min: 60, max: 170, unit: 'µg/dL' },
      ferritin: { min: 30, max: 400, unit: 'ng/mL' },
      b12: { min: 200, max: 900, unit: 'pg/mL' },
      folate: { min: 5.4, max: 16.8, unit: 'ng/mL' },
      calcium: { min: 8.5, max: 10.2, unit: 'mg/dL' },
      vitaminD: { min: 30, max: 100, unit: 'ng/mL' },
      magnesium: { min: 1.7, max: 2.2, unit: 'mg/dL' },
      zinc: { min: 70, max: 150, unit: 'µg/dL' },
    };
  }

  addLabResult(date, values) {
    const result = {
      date: new Date(date).toISOString(),
      values,
      analysis: this.analyzeLabValues(values),
    };
    this.labHistory.push(result);
    return result;
  }

  analyzeLabValues(values) {
    const analysis = {
      deficiencies: [],
      warnings: [],
      recommendations: [],
    };

    Object.entries(values).forEach(([key, value]) => {
      const range = this.normalRanges[key];
      if (!range) return;

      const numValue = parseFloat(value);
      if (numValue < range.min) {
        analysis.deficiencies.push({
          nutrient: key,
          value: numValue,
          range,
          severity: numValue < range.min * 0.8 ? 'severe' : 'mild',
        });
      } else if (numValue > range.max) {
        analysis.warnings.push({
          nutrient: key,
          value: numValue,
          range,
          message: `${key} is elevated`,
        });
      }
    });

    // Generate recommendations
    if (analysis.deficiencies.some(d => d.nutrient === 'b12')) {
      analysis.recommendations.push('Consider B12 supplementation or injections');
    }
    if (analysis.deficiencies.some(d => d.nutrient === 'iron')) {
      analysis.recommendations.push('Take iron supplement with vitamin C for better absorption');
    }
    if (analysis.deficiencies.some(d => d.nutrient === 'calcium')) {
      analysis.recommendations.push('Increase calcium intake and ensure adequate vitamin D');
    }
    if (analysis.deficiencies.some(d => d.nutrient === 'protein')) {
      analysis.recommendations.push('Increase protein intake to 60-80g daily');
    }

    return analysis;
  }

  generateWeightTrendData(weights) {
    if (weights.length === 0) return null;

    const data = weights.map((w, idx) => ({
      x: idx,
      y: w,
      week: Math.floor(idx / 7) + 1,
    }));

    return {
      points: data,
      trend: this.calculateTrend(weights),
      projectedWeight6Mo: this.projectWeight(weights, 26),
      projectedWeight12Mo: this.projectWeight(weights, 52),
    };
  }

  calculateTrend(weights) {
    if (weights.length < 2) return 'insufficient_data';

    const start = weights[0];
    const end = weights[weights.length - 1];
    const change = start - end;
    const percentChange = (change / start) * 100;

    if (change > 0 && percentChange > 2) return 'rapid_loss';
    if (change > 0 && percentChange <= 2) return 'steady_loss';
    if (change <= 0) return 'stable_or_gain';

    return 'unknown';
  }

  projectWeight(weights, weeksOut) {
    if (weights.length < 2) return null;

    // Linear regression simplified
    const start = weights[0];
    const end = weights[weights.length - 1];
    const weeksElapsed = Math.max(1, Math.floor(weights.length / 7));
    const weeklyChange = (end - start) / weeksElapsed;

    return end + (weeklyChange * weeksOut);
  }

  drawWeightChart(canvasId, weights) {
    const canvas = document.getElementById(canvasId);
    if (!canvas || weights.length === 0) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    // Simple line drawing
    const minWeight = Math.min(...weights);
    const maxWeight = Math.max(...weights);
    const range = maxWeight - minWeight || 1;

    ctx.clearRect(0, 0, width, height);
    ctx.strokeStyle = '#E89B9B';
    ctx.lineWidth = 2;
    ctx.beginPath();

    weights.forEach((weight, idx) => {
      const x = (idx / (weights.length - 1 || 1)) * width;
      const y = height - ((weight - minWeight) / range) * height;

      if (idx === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });

    ctx.stroke();

    // Draw axes
    ctx.strokeStyle = '#ccc';
    ctx.beginPath();
    ctx.moveTo(20, height);
    ctx.lineTo(width, height);
    ctx.stroke();
  }

  flagConcerns(vitals) {
    const concerns = [];

    // Rapid weight loss
    if (vitals.weight && vitals.weight.length > 7) {
      const lastWeek = vitals.weight.slice(-7);
      const loss = lastWeek[0] - lastWeek[lastWeek.length - 1];
      if (loss > 5) {
        concerns.push({
          level: 'warning',
          message: 'Rapid weight loss detected (>5 lbs/week)',
          action: 'Contact surgeon if experiencing fatigue or weakness',
        });
      }
    }

    // Low protein
    concerns.push({
      level: 'info',
      message: 'Have you logged your protein intake this week?',
      action: 'Aim for 60-80g daily in divided meals',
    });

    return concerns;
  }
}

const medicalTracker = new MedicalTracker();
