# Cohort analysis spec — find the over-retaining segment

> **Question this answers:** Among the 500 customers, which segment churns at materially less than 8%? That segment is the niche.
>
> **Schema below is a generic SaaS shape.** Map the column names to the actual tables; the queries themselves are portable.

## Assumed schema

```sql
-- Core identity
customers (
  id            uuid primary key,
  signup_date   date not null,
  churn_date    date,                    -- null if still active
  plan          text not null,           -- 'starter' / 'standard' / 'plus'
  mrr           numeric not null,
  acquisition_channel text                -- 'referral' / 'organic' / 'paid' / 'outbound' / 'founder'
)

-- Practice attributes (whatever you have — fill in what's missing as part of this exercise)
practice_attributes (
  customer_id uuid references customers(id),
  practice_type text,                    -- 'solo' / 'group_2_5' / 'group_6_plus' / 'dso'
  specialty text,                        -- 'general' / 'ortho' / 'endo' / 'oms' / 'pedo' / 'perio' / 'mixed'
  num_chairs int,
  state text,
  legacy_pms text                        -- 'dentrix' / 'eaglesoft' / 'open_dental' / 'none' / etc.
)

-- Activity (whatever exists)
monthly_activity (
  customer_id uuid references customers(id),
  month date,                            -- first of month
  active_users int,
  sessions int,
  feature_x_used boolean
)
```

## Step 1 — Compute monthly churn rate by segment

```sql
-- Monthly churn rate, last 6 months, by practice_type
WITH active_each_month AS (
  SELECT
    DATE_TRUNC('month', m)::date AS month,
    pa.practice_type,
    COUNT(*) FILTER (WHERE c.signup_date <= m AND (c.churn_date IS NULL OR c.churn_date > m)) AS active_start
  FROM generate_series(
    CURRENT_DATE - INTERVAL '6 months',
    CURRENT_DATE,
    INTERVAL '1 month'
  ) AS m
  CROSS JOIN customers c
  JOIN practice_attributes pa ON pa.customer_id = c.id
  GROUP BY 1, 2
),
churned_each_month AS (
  SELECT
    DATE_TRUNC('month', c.churn_date)::date AS month,
    pa.practice_type,
    COUNT(*) AS churned
  FROM customers c
  JOIN practice_attributes pa ON pa.customer_id = c.id
  WHERE c.churn_date IS NOT NULL
    AND c.churn_date >= CURRENT_DATE - INTERVAL '6 months'
  GROUP BY 1, 2
)
SELECT
  a.practice_type,
  AVG(c.churned::numeric / NULLIF(a.active_start, 0)) AS avg_monthly_churn_rate,
  SUM(a.active_start) / 6.0 AS avg_active
FROM active_each_month a
LEFT JOIN churned_each_month c USING (month, practice_type)
GROUP BY a.practice_type
ORDER BY avg_monthly_churn_rate;
```

Run the same query swapping `practice_type` for `specialty`, `acquisition_channel`, `legacy_pms`, and `state`-region. Five slices.

## Step 2 — Cohort retention curve

```sql
-- Retention by signup-month cohort
WITH cohorts AS (
  SELECT
    id,
    DATE_TRUNC('month', signup_date)::date AS cohort_month,
    EXTRACT(MONTH FROM AGE(COALESCE(churn_date, CURRENT_DATE), signup_date))::int AS months_active
  FROM customers
)
SELECT
  cohort_month,
  COUNT(*) AS cohort_size,
  COUNT(*) FILTER (WHERE months_active >= 1)::numeric / COUNT(*) AS m1_retention,
  COUNT(*) FILTER (WHERE months_active >= 3)::numeric / COUNT(*) AS m3_retention,
  COUNT(*) FILTER (WHERE months_active >= 6)::numeric / COUNT(*) AS m6_retention,
  COUNT(*) FILTER (WHERE months_active >= 12)::numeric / COUNT(*) AS m12_retention
FROM cohorts
GROUP BY 1
ORDER BY 1;
```

Overlay with segment by joining `practice_attributes` and adding a segment column to GROUP BY.

## Step 3 — LTV by segment (rough)

```sql
SELECT
  pa.specialty,
  COUNT(*) AS customers,
  AVG(c.mrr) AS avg_mrr,
  -- LTV = MRR / monthly_churn_rate (geometric series, simple)
  AVG(c.mrr) / NULLIF(
    (COUNT(*) FILTER (WHERE c.churn_date IS NOT NULL)::numeric
     / NULLIF(COUNT(*), 0)
     / 18.0)  -- 18 months in market; adjust if cohort window differs
  , 0) AS ltv_estimate
FROM customers c
JOIN practice_attributes pa ON pa.customer_id = c.id
GROUP BY pa.specialty
ORDER BY ltv_estimate DESC;
```

## Decision rule

Pick the segment that satisfies all three:

1. **Churn rate ≤ 5%/month** (≥ 1.5 percentage points below the company average of 8%)
2. **At least 50 customers** in the segment (statistically meaningful)
3. **Same retention pattern repeats** when you slice it differently (e.g., "ortho" looks good across both `specialty` and `legacy_pms = open_dental`)

If two segments tie, pick the one with the higher absolute customer count — easier to compound.

If no segment hits all three: the problem isn't segmentation, it's the product. Skip to the churn interview kit and don't pivot positioning yet.

## Output template

```
Segment slice: [practice_type / specialty / channel / etc.]
Top 3 segments by retention:
  1. [name] — [N] customers, [X]%/mo churn, $[Y] avg MRR
  2. [name] — [N] customers, [X]%/mo churn, $[Y] avg MRR
  3. [name] — [N] customers, [X]%/mo churn, $[Y] avg MRR

Recommended niche: [name]
  - Why: [reasoning, including any cross-cut validation]
  - Volume in TAM: [N] practices in the US (estimate)
  - Headline message: [one sentence positioning]
```
