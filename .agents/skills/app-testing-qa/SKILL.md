---
name: app-testing-qa
description: Comprehensive testing strategy for iOS/Android apps, web apps, and generation pipelines
---

# App Testing & QA

Test iOS/Android apps, web interfaces, and generation pipelines for reliability and user experience.

## When to use

- Before shipping iOS/Android builds
- Testing generation pipeline reliability
- Validating user flows end-to-end
- Performance and load testing
- Accessibility and device compatibility
- A/B testing features

## Testing Pyramid

```
        E2E Tests (10%)
      Integration Tests (30%)
    Unit Tests (60%)
```

### Unit Tests (60%)
- Test individual functions
- Database queries
- API endpoints
- Generation logic

### Integration Tests (30%)
- Test component interactions
- API + database together
- Third-party API mocks
- User flows (signup → generate → share)

### E2E Tests (10%)
- Full app testing
- User journey from start to finish
- Real device or simulator
- Network conditions

## Test Examples

### Unit: Prompt Validation

```javascript
// test: generatePrompt.test.js
describe('generatePrompt', () => {
  it('should create valid FLUX prompt', () => {
    const prompt = generatePrompt({
      style: 'minimalist',
      subject: 'watch',
      lighting: 'studio'
    });
    
    expect(prompt).toContain('watch');
    expect(prompt).toContain('studio');
    expect(prompt.length).toBeGreaterThan(20);
  });
  
  it('should reject empty subject', () => {
    expect(() => generatePrompt({ subject: '' }))
      .toThrow('Subject required');
  });
});
```

### Integration: Generation API

```javascript
// test: generation.integration.test.js
describe('POST /api/generate', () => {
  beforeEach(() => {
    // Setup test database, mock Replicate
  });
  
  it('should create generation record and queue job', async () => {
    const response = await request(app)
      .post('/api/generate')
      .set('Authorization', `Bearer ${testToken}`)
      .send({
        type: 'image',
        model: 'FLUX',
        prompt: 'golden hour landscape'
      });
    
    expect(response.status).toBe(202);
    expect(response.body.generationId).toBeDefined();
    
    // Check database
    const gen = await db.generations.findOne(response.body.generationId);
    expect(gen.status).toBe('pending');
  });
});
```

### E2E: User Flow

```javascript
// test: user-flow.e2e.test.js
describe('Generate and share music', () => {
  it('should complete full flow: signup → generate → download', async () => {
    // Signup
    await page.goto('https://starlightmix.com');
    await page.click('[data-testid=signup-button]');
    await page.fill('[name=email]', 'test@example.com');
    await page.fill('[name=password]', 'Test123!');
    await page.click('[data-testid=signup-submit]');
    
    // Wait for dashboard
    await page.waitForSelector('[data-testid=dashboard]');
    
    // Generate
    await page.click('[data-testid=create-button]');
    await page.fill('[name=prompt]', 'lo-fi hip-hop, chill');
    await page.click('[data-testid=generate-button]');
    
    // Wait for completion
    await page.waitForSelector('[data-testid=download-button]', { timeout: 60000 });
    
    // Download
    await page.click('[data-testid=download-button]');
    
    // Verify file
    expect(fs.existsSync(downloadPath)).toBe(true);
  });
});
```

## Testing Tools

### Unit Testing
```bash
# Jest (JavaScript/TypeScript)
npm test

# Vitest (faster alternative)
npm run test:vitest

# Python
pytest test_unit.py
```

### Integration Testing
```bash
# Supertest (API testing)
npm test:integration

# Playwright (browser automation)
npx playwright test

# Mock API responses
npm install --save-dev nock
```

### E2E Testing
```bash
# Playwright (recommended)
npx playwright install chromium
npx playwright test

# Cypress (alternative)
npx cypress run

# Device testing
npx playwright test --headed --debug
```

### Performance Testing
```bash
# Load testing
npm install -g k6
k6 run tests/load-test.js

# Lighthouse (web performance)
npx lighthouse https://studio.starlightmix.com --view
```

## Test Coverage Targets

| Component | Target | Critical |
|---|---|---|
| Authentication | 90%+ | Yes |
| Generation API | 85%+ | Yes |
| Database queries | 90%+ | Yes |
| UI components | 70%+ | No |
| Utils/helpers | 80%+ | No |
| **Overall** | **80%+** | **Yes** |

Check coverage:
```bash
npm test -- --coverage
```

## CI/CD Testing

### GitHub Actions Workflow

```yaml
# .github/workflows/test.yml
name: Test

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Install dependencies
        run: npm install
      
      - name: Unit tests
        run: npm test
      
      - name: Coverage
        run: npm test -- --coverage
      
      - name: Integration tests
        run: npm run test:integration
      
      - name: E2E tests
        run: npx playwright test
      
      - name: Upload coverage
        uses: codecov/codecov-action@v3
```

## Device Testing Matrix

### iOS
```
iPhone 15 Pro (latest)
iPhone 14 (common)
iPhone SE (budget)
iPad Pro (tablet)

iOS versions: 16, 17, 18
```

### Android
```
Pixel 8 (Google standard)
Samsung Galaxy S24 (common)
OnePlus 12 (performance)
Moto G54 (budget)

Android versions: 12, 13, 14, 15
```

### Web
```
Chrome (Windows, Mac)
Safari (Mac, iOS)
Firefox (Windows)
Edge (Windows)

Viewport sizes: 320px, 768px, 1440px
```

## Testing Checklist

### Before Shipping

- [ ] Unit test coverage ≥80%
- [ ] All integration tests passing
- [ ] E2E tests on 3+ devices
- [ ] No console errors/warnings
- [ ] Performance: Lighthouse >90
- [ ] Accessibility: WCAG AA compliance
- [ ] Offline functionality works
- [ ] App stores updated (iOS/Android)
- [ ] Marketing assets ready
- [ ] Support docs updated

### Generation Pipeline

- [ ] All models tested (FLUX, Soul, Kling, seedance)
- [ ] Failure scenarios: timeout, rate limit, invalid params
- [ ] Quality scoring accurate
- [ ] Webhook delivery reliable
- [ ] Database transactions atomic
- [ ] Cost tracking accurate

## Performance Benchmarks

### API Endpoints
```
POST /api/generate: <200ms
GET /api/generations: <100ms
POST /auth/login: <150ms
GET /api/user/credits: <50ms

p95 latency should be <300ms
```

### App Performance
```
Cold start: <3s
Interaction delay: <100ms
Frame rate: 60 FPS
Memory: <200MB (mobile)
CPU: <50% average load
```

### Generation Quality
```
Image generation success: >98%
Video generation success: >95%
Music generation success: >97%
Avg quality score: >7.5/10
```

## Debugging Failed Tests

### Common Issues

```
❌ Timeout
→ Increase timeout for slow operations
→ Check API mocks are working
→ Add debug logs

❌ Flaky tests (pass/fail randomly)
→ Remove time-dependent assertions
→ Use wait-for patterns
→ Check for race conditions

❌ API errors
→ Verify mock responses match real API
→ Check headers and auth tokens
→ Validate request/response schema

❌ Device-specific failures
→ Test on actual device, not just simulator
→ Check for network conditions (slow 3G)
→ Verify permissions (camera, microphone)
```

## Automation

### Pre-commit Hook

```bash
#!/bin/sh
# .git/hooks/pre-commit
npm run lint
npm run test
npm run build

# Prevent commit if tests fail
if [ $? -ne 0 ]; then
  echo "Tests failed. Commit aborted."
  exit 1
fi
```

### Auto-test on PR

```yaml
# .github/workflows/pr-check.yml
on: [pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - run: npm install
      - run: npm test
      - run: npm run test:coverage
      - uses: codecov/codecov-action@v3
```

## Monitoring in Production

### Error Tracking

```javascript
// Sentry integration
import * as Sentry from "@sentry/react-native";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: 1.0,
});

// Errors auto-captured
try {
  await generateImage(prompt);
} catch (error) {
  Sentry.captureException(error);
}
```

### Metrics Tracking

```javascript
// Track generation success rate
analytics.track('generation_started', { model: 'FLUX' });
analytics.track('generation_success', { 
  model: 'FLUX', 
  duration: 62.3, 
  quality_score: 8.2 
});
analytics.track('generation_failed', { 
  model: 'FLUX', 
  error: 'timeout' 
});
```

## Next Steps

1. **Now:** Write unit tests for core logic
2. **Week 2:** Add integration tests for APIs
3. **Week 3:** E2E tests for critical flows
4. **Week 4:** Device compatibility testing
5. **Ongoing:** Monitor production errors
