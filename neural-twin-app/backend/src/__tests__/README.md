# Neural Twin Backend Test Suite

Comprehensive Jest/Vitest test suite for the Neural Twin backend API with complete coverage of all routes and middleware.

## Test Structure

```
src/__tests__/
├── setup.ts                    # Test configuration and mock utilities
├── README.md                   # This file
├── routes/
│   ├── auth.test.ts           # Auth registration, login, JWT validation
│   ├── voice.test.ts          # Voice recording, emotion analysis
│   ├── twins.test.ts          # Twin interactions, 9 twin types, history
│   ├── coherence.test.ts      # Coherence state, metrics, patterns
│   └── accessibility.test.ts  # Book scanning, TTS, settings
└── middleware/
    └── auth.test.ts           # Authentication middleware, token handling
```

## Running Tests

### Run all tests
```bash
npm test
# or
pnpm test
```

### Run tests in watch mode
```bash
npm test -- --watch
```

### Run specific test file
```bash
npm test -- src/__tests__/routes/auth.test.ts
```

### Run tests with coverage
```bash
npm test -- --coverage
```

### Run tests with specific reporter
```bash
npm test -- --reporter=verbose
```

## Test Suite Breakdown

### 1. Auth Routes (`routes/auth.test.ts`)

**Registration Tests:**
- ✅ Valid user registration with JWT token generation
- ✅ Reject duplicate email addresses (409 Conflict)
- ✅ Reject weak passwords (< 8 characters)
- ✅ Reject invalid email formats
- ✅ Auto-initialize 8 Twin types and Knowledge Graph

**Login Tests:**
- ✅ Successful login with valid credentials
- ✅ Reject non-existent users
- ✅ Reject incorrect passwords
- ✅ Reject invalid email formats

**Token Verification Tests:**
- ✅ Verify valid JWT tokens
- ✅ Reject missing tokens
- ✅ Reject invalid tokens
- ✅ Reject expired tokens

**OAuth Tests:**
- ✅ Create new user from OAuth (Apple/Google)
- ✅ Return token for existing OAuth users
- ✅ Reject invalid OAuth providers

### 2. Voice Routes (`routes/voice.test.ts`)

**Upload & Analysis:**
- ✅ Upload voice recording with emotion analysis
- ✅ Extract acoustic features (pitch, speech rate, formants, MFCC)
- ✅ Detect primary emotion with confidence score
- ✅ Handle multiple emotion detection
- ✅ Support context metadata (location, decision title, clarity level)

**Retrieval:**
- ✅ List all voice recordings for user
- ✅ Filter by context
- ✅ Get detailed recording information
- ✅ Verify user ownership

**Error Handling:**
- ✅ Reject upload without audioBase64
- ✅ Handle database connection errors
- ✅ Handle Anthropic API failures

### 3. Twins Routes (`routes/twins.test.ts`)

**Twin Types (All 9 Supported):**
1. **Task** - Productivity and workflow optimization
2. **Coach** - Real-time guidance and metacognitive coaching
3. **Growth** - Learning and development
4. **Health** - Wellness and biometric optimization
5. **Relationship** - Social coherence and connection
6. **Financial** - Money psychology and transformation
7. **Creative** - Flow and creative expression
8. **Research** - Knowledge synthesis and learning
9. **Metacognition** - Thinking and cognitive processes

**Interaction Tests:**
- ✅ Chat with any Twin type
- ✅ Support metacognitive phases (planning, monitoring, evaluating, reflecting)
- ✅ Include context data in responses
- ✅ Validate required fields (twinType, userMessage)

**Conversation History:**
- ✅ Retrieve history with specific Twin
- ✅ Pagination support
- ✅ Empty history for new Twins
- ✅ Timestamp ordering

**Error Handling:**
- ✅ Handle Anthropic API errors
- ✅ Handle database write failures
- ✅ Timeout handling for long responses

### 4. Coherence Routes (`routes/coherence.test.ts`)

**State Metrics (8 Dimensions):**
1. Heart Rate Variability (HRV)
2. Sleep Quality
3. Stress Level
4. Mental Clarity
5. Emotional Balance
6. Physical Energy
7. Social Connection
8. Creative Flow

**Current State Retrieval:**
- ✅ Get all coherence metrics
- ✅ Calculate overall coherence score
- ✅ Identify low coherence areas
- ✅ Default values when no data exists

**Historical Analysis:**
- ✅ 7-day history
- ✅ 30-day history
- ✅ 90-day history
- ✅ Custom date range queries
- ✅ Calculate trends (improving/stable/declining)

**Detailed Metrics:**
- ✅ Sleep quality analysis with recommendations
- ✅ Stress level trend analysis
- ✅ Heart rate variability tracking
- ✅ Individual metric statistics (avg, min, max)

**Pattern Recognition:**
- ✅ Identify coherence cycles
- ✅ Correlate with voice emotion patterns
- ✅ Pattern-based insights

**Error Handling:**
- ✅ Handle database connection errors
- ✅ Validate date parameters
- ✅ Handle invalid timeframe formats
- ✅ Date parsing error handling

### 5. Accessibility Routes (`routes/accessibility.test.ts`)

**Book Scanning (OCR):**
- ✅ Upload image and extract text using Claude Vision
- ✅ Confidence scoring for OCR results
- ✅ Multi-language detection
- ✅ Layout analysis (images, formulas, tables)
- ✅ Quality warnings for low-confidence scans
- ✅ Enhanced processing option for technical content

**Text-to-Speech:**
- ✅ Generate speech from scanned text
- ✅ Multiple voice options
- ✅ Variable playback speeds (0.8x to 2.0x)
- ✅ MP3 format support
- ✅ Duration calculation
- ✅ Screen reader optimization

**Settings Management:**
- ✅ Retrieve accessibility preferences
- ✅ Update TTS settings
- ✅ Font size control (with validation)
- ✅ High contrast mode
- ✅ Screen reader optimization
- ✅ Default values when settings don't exist

**Accessibility Features:**
- ✅ Screen reader support
- ✅ High contrast mode
- ✅ Customizable font sizes
- ✅ Multiple voice options
- ✅ Playback speed control
- ✅ Captions support

**Error Handling:**
- ✅ Invalid image format handling
- ✅ TTS service unavailability
- ✅ Database write failures
- ✅ Invalid settings validation

### 6. Auth Middleware (`middleware/auth.test.ts`)

**Token Validation:**
- ✅ Accept valid Bearer tokens
- ✅ Verify JWT signature and expiration
- ✅ Extract userId and email from token payload
- ✅ Attach user data to request object

**Error Cases:**
- ✅ Missing authorization header (401)
- ✅ Missing Bearer prefix (401)
- ✅ Expired tokens (401)
- ✅ Invalid signatures (401)
- ✅ Missing userId in payload (401)
- ✅ Malformed JWT (401)

**Edge Cases:**
- ✅ Trim whitespace around Bearer token
- ✅ Handle case-insensitive headers
- ✅ Support tokens without email field
- ✅ Handle very long tokens
- ✅ Support special characters in email
- ✅ Support UUID-format user IDs

**Security:**
- ✅ Reject tokens signed with different algorithms
- ✅ Reject future-dated tokens (iat tampering)
- ✅ Validate against configured secret

## Mocking Strategy

### Database (Prisma)
All Prisma operations are mocked using `vi.mocked()` from Vitest:
```typescript
vi.mocked(prisma.user).findUnique.mockResolvedValueOnce(mockUser);
vi.mocked(prisma.voiceRecording).create.mockResolvedValueOnce(mockRecording);
```

### Anthropic API
The Claude API is mocked to return simulated responses:
```typescript
vi.mocked(getAnthropic).mockResolvedValueOnce({
  messages: {
    create: vi.fn().mockResolvedValue({
      content: [{ type: 'text', text: 'Mocked response' }]
    })
  }
});
```

### HTTP Requests
Uses `supertest` for end-to-end route testing without external dependencies.

## Test Utilities

### `setup.ts` Exports

**Mock Generators:**
```typescript
mockRequest(overrides?)     // Create mock Express Request
mockResponse()              // Create mock Express Response
mockNext()                  // Create mock next() function
generateToken()             // Generate valid JWT token
getResponseData()           // Extract response body
getResponseStatus()         // Extract HTTP status
```

**Usage Example:**
```typescript
const req = mockRequest({ userId: 'test-user-id' });
const res = mockResponse();
const next = mockNext();

await requireAuth(req, res, next);
expect(mockNext).toHaveBeenCalled();
```

## Coverage Targets

- **Lines:** 80%
- **Functions:** 80%
- **Branches:** 75%
- **Statements:** 80%

Run coverage report:
```bash
npm test -- --coverage
open coverage/index.html  # View HTML report
```

## Writing New Tests

### Template
```typescript
import { describe, it, expect, beforeEach, vi } from 'vitest';
import express, { Express } from 'express';
import request from 'supertest';
import router from '../../routes/example';
import { prisma } from '../../index';

vi.mocked(prisma);

const app: Express = express();
app.use(express.json());
app.use((req, res, next) => {
  req.userId = 'test-user-id';
  next();
});
app.use('/api/example', router);

describe('Example Route', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should do something', async () => {
    vi.mocked(prisma.example).findUnique.mockResolvedValueOnce(mockData);

    const response = await request(app).get('/api/example/1');

    expect(response.status).toBe(200);
  });
});
```

### Best Practices
1. **Clear test names** - Use `should...` format
2. **Arrange-Act-Assert** - Setup, execute, verify
3. **Mock at boundaries** - Database, external APIs
4. **Test happy path first** - Then error cases
5. **Use `beforeEach`** - Reset mocks between tests
6. **Test assertions** - Both success and failure cases
7. **Validate types** - Check response structure

## Debugging Tests

### Run single test
```bash
npm test -- routes/auth.test.ts -t "should register a valid user"
```

### Verbose output
```bash
npm test -- --reporter=verbose
```

### Debug in VSCode
Add to `.vscode/launch.json`:
```json
{
  "type": "node",
  "request": "launch",
  "program": "${workspaceFolder}/node_modules/vitest/vitest.mjs",
  "args": ["run"],
  "console": "integratedTerminal"
}
```

## CI/CD Integration

### GitHub Actions Example
```yaml
- name: Run tests
  run: npm test -- --coverage

- name: Upload coverage
  uses: codecov/codecov-action@v3
  with:
    files: ./coverage/lcov.info
```

## Troubleshooting

### Timeout Errors
Increase timeout in `vitest.config.ts`:
```typescript
testTimeout: 15000
```

### Mock Not Working
Ensure mocks are cleared in `beforeEach`:
```typescript
beforeEach(() => {
  vi.clearAllMocks();
});
```

### Database Connection
Mocks prevent actual DB access - all queries should use mocked Prisma.

### Import Errors
Check TypeScript paths in `tsconfig.json` and test setup.

## References

- [Vitest Documentation](https://vitest.dev/)
- [Supertest Documentation](https://github.com/visionmedia/supertest)
- [JWT Testing](https://github.com/auth0/node-jsonwebtoken)
- [Prisma Mocking](https://www.prisma.io/docs/orm/more/help-and-troubleshooting/help-articles/testing)
