# Neural Twin - Phase 2 Implementation Guide

**Purpose:** Detailed code patterns and examples for implementing Phase 2 features  
**Audience:** Developers implementing each feature  
**Updated:** 2026-06-25

---

## Table of Contents

1. [Backend Setup](#backend-setup)
2. [Authentication (JWT)](#authentication-jwt)
3. [Voice Recording & Emotion Detection](#voice-recording--emotion-detection)
4. [Decision Logging & Metacognition](#decision-logging--metacognition)
5. [Twin Interactions](#twin-interactions)
6. [Android Integration](#android-integration)
7. [iOS Integration](#ios-integration)
8. [Testing Patterns](#testing-patterns)
9. [Error Handling](#error-handling)
10. [Performance Optimization](#performance-optimization)

---

## Backend Setup

### 1. Environment Configuration

**File: `.env`**
```env
# API Keys
ANTHROPIC_API_KEY=sk-ant-api03-xxxxxx

# Database
DATABASE_URL=postgresql://user:password@hostname.neon.tech:5432/dbname?sslmode=require

# Authentication
JWT_SECRET=your-super-secret-key-min-32-chars-long-change-in-production
JWT_EXPIRATION=24h

# Server
NODE_ENV=development
PORT=3000

# CORS
CORS_ORIGIN=http://localhost:3000,http://localhost:8000,http://192.168.1.100:8000

# Optional: Claude API Caching (Phase 2.5)
ENABLE_PROMPT_CACHING=true
CLAUDE_MODEL=claude-3-5-sonnet-20241022
```

### 2. Prisma Configuration

**File: `backend/prisma/schema.prisma` (additions)**

```prisma
// Add JWT fields to User model
model User {
  id String @id @default(cuid())
  email String @unique
  passwordHash String
  name String?
  
  // Authentication
  jwtSecret String @unique @default(cuid())
  lastLogin DateTime?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  // Relations
  voices VoiceRecording[]
  decisions Decision[]
  twins TwinInteraction[]
  coherence CoherenceMetric[]
}

// Update VoiceRecording with emotion scores
model VoiceRecording {
  id String @id @default(cuid())
  userId String
  user User @relation(fields: [userId], references: [id])
  
  audioUrl String
  primaryEmotion String
  emotionScores String @db.Text // JSON string with all 7 emotions
  
  createdAt DateTime @default(now())
}

// Update Decision model
model Decision {
  id String @id @default(cuid())
  userId String
  user User @relation(fields: [userId], references: [id])
  
  title String
  category String
  planningClarity Int
  strategyChosen String?
  monitoringComprehension Int
  evaluationEffectiveness Int
  reflectionInsights String?
  metacognitiveScore Float
  
  createdAt DateTime @default(now())
}
```

**Run migrations:**
```bash
cd backend
npx prisma migrate dev --name add_phase2_fields
```

### 3. Seeding Database

**File: `backend/prisma/seed.ts`**

```typescript
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Create test user
  const password = 'test123';
  const hashedPassword = await bcrypt.hash(password, 10);
  
  const user = await prisma.user.upsert({
    where: { email: 'test@neuraltwin.com' },
    update: {},
    create: {
      email: 'test@neuraltwin.com',
      passwordHash: hashedPassword,
      name: 'Test User',
    },
  });
  
  console.log('Created user:', user);
  
  // Seed 9 Twins (if needed - they may already exist)
  const twins = [
    { type: 'TASK', name: 'Task Twin', description: 'Productivity & workflow' },
    { type: 'COACH', name: 'Coach Twin', description: 'Metacognitive coaching' },
    // ... add all 9
  ];
  
  console.log('Database seeded');
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
```

**Run seed:**
```bash
npx prisma db seed
```

---

## Authentication (JWT)

### 1. Backend Login Endpoint

**File: `backend/src/routes/auth.ts`**

```typescript
import express, { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

const getJwtSecret = (): string => {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error('JWT_SECRET must be set and at least 32 characters');
  }
  return secret;
};

// POST /api/auth/login
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }
    
    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
    });
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Check password
    const passwordMatch = await bcrypt.compare(password, user.passwordHash);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Generate JWT
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      getJwtSecret(),
      { expiresIn: process.env.JWT_EXPIRATION || '24h' }
    );
    
    // Update lastLogin
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() },
    });
    
    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// POST /api/auth/register (Phase 2.5)
router.post('/register', async (req: Request, res: Response) => {
  try {
    const { email, password, name } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }
    
    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });
    
    if (existingUser) {
      return res.status(400).json({ error: 'Email already in use' });
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash: hashedPassword,
        name,
      },
    });
    
    res.json({
      message: 'User created successfully',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

export default router;
```

### 2. JWT Middleware

**File: `backend/src/middleware/auth.ts` (update)**

```typescript
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface JwtPayload {
  userId: string;
  email: string;
  iat?: number;
  exp?: number;
}

// Extend Express Request to include userId
declare global {
  namespace Express {
    interface Request {
      userId?: string;
      userEmail?: string;
    }
  }
}

const getJwtSecret = (): string => {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error('JWT_SECRET not configured');
  }
  return secret;
};

export const requireAuth = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ error: 'Missing or invalid Authorization header' });
      return;
    }
    
    const token = authHeader.substring(7); // Remove "Bearer "
    
    const decoded = jwt.verify(token, getJwtSecret()) as JwtPayload;
    
    req.userId = decoded.userId;
    req.userEmail = decoded.email;
    
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
};

export const optionalAuth = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const authHeader = req.headers.authorization;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      const decoded = jwt.verify(token, getJwtSecret()) as JwtPayload;
      req.userId = decoded.userId;
      req.userEmail = decoded.email;
    }
    
    next();
  } catch (error) {
    // Token is optional, so continue even if invalid
    next();
  }
};
```

---

## Voice Recording & Emotion Detection

### 1. Backend Voice Endpoint (Enhanced)

**File: `backend/src/routes/voice.ts` (update)**

```typescript
import express, { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { getAnthropic } from '../lib/anthropic';
import { requireAuth } from '../middleware/auth';

const router = express.Router();
const prisma = new PrismaClient();

interface EmotionScore {
  emotion: string;
  confidence: number;
}

// POST /api/voice - Upload voice recording with emotion detection
router.post('/voice', requireAuth, async (req: Request, res: Response) => {
  try {
    const { audioBase64, context, location } = req.body;
    const userId = req.userId!;
    
    if (!audioBase64) {
      return res.status(400).json({ error: 'audioBase64 required' });
    }
    
    // In production, upload to S3/CDN
    // For now, store base64 (limited to ~30 seconds of audio)
    const audioUrl = `data:audio/wav;base64,${audioBase64.split(',').pop()}`;
    
    // Use Claude API to detect emotions
    const client = getAnthropic();
    const emotionAnalysis = await analyzeEmotions(client, audioBase64);
    
    // Store in database
    const voiceRecording = await prisma.voiceRecording.create({
      data: {
        userId,
        audioUrl,
        primaryEmotion: emotionAnalysis.primaryEmotion,
        emotionScores: JSON.stringify(emotionAnalysis.scores),
        context,
        location,
      },
    });
    
    res.json({
      id: voiceRecording.id,
      primaryEmotion: emotionAnalysis.primaryEmotion,
      emotionScores: emotionAnalysis.scores,
      createdAt: voiceRecording.createdAt,
    });
  } catch (error) {
    console.error('Voice upload error:', error);
    res.status(500).json({ error: 'Failed to process voice recording' });
  }
});

// Helper function: Analyze emotions using Claude API
async function analyzeEmotions(
  client: ReturnType<typeof getAnthropic>,
  audioBase64: string
): Promise<{
  primaryEmotion: string;
  scores: EmotionScore[];
}> {
  // Since Claude API doesn't directly analyze audio,
  // we'll use vision API to analyze audio waveform or
  // we could use a separate audio analysis service
  
  // For Phase 2, use mock emotion detection
  // In Phase 2.5+, integrate with real audio API (Assembly AI, Deepgram, etc.)
  
  const emotions = ['happy', 'sad', 'angry', 'neutral', 'surprised', 'fearful', 'disgusted'];
  const scores = emotions.map(emotion => ({
    emotion,
    confidence: Math.random() * 0.3 + 0.1, // Mock: 0.1-0.4 per emotion
  }));
  
  const primaryEmotion = scores.reduce((a, b) => a.confidence > b.confidence ? a : b).emotion;
  
  return { primaryEmotion, scores };
}

export default router;
```

### 2. Android Voice Recording

**File: `android/app/src/main/java/com/neuraltwin/app/ui/screens/VoiceRecordingScreen.kt` (update)**

```kotlin
@Composable
fun VoiceRecordingScreen() {
    val viewModel: VoiceViewModel = hiltViewModel()
    val uiState by viewModel.uiState.collectAsState()
    
    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center
    ) {
        // Recording button
        Button(
            onClick = {
                if (uiState.isRecording) {
                    viewModel.stopRecording()
                } else {
                    viewModel.startRecording()
                }
            },
            modifier = Modifier.size(80.dp),
            shape = CircleShape,
            colors = ButtonDefaults.buttonColors(
                containerColor = if (uiState.isRecording) Color.Red else DesignTokens.PrimaryPurple
            )
        ) {
            Icon(
                imageVector = if (uiState.isRecording) Icons.Default.Stop else Icons.Default.Mic,
                contentDescription = null,
                tint = Color.White,
                modifier = Modifier.size(40.dp)
            )
        }
        
        Spacer(modifier = Modifier.height(16.dp))
        
        Text(
            text = if (uiState.isRecording) "Recording..." else "Tap to record",
            style = MaterialTheme.typography.bodyMedium
        )
        
        // Loading state
        if (uiState.isProcessing) {
            Spacer(modifier = Modifier.height(16.dp))
            CircularProgressIndicator()
            Text("Processing emotion detection...", style = MaterialTheme.typography.bodySmall)
        }
        
        // Emotion results
        if (uiState.lastEmotionScores != null) {
            Spacer(modifier = Modifier.height(24.dp))
            Text("Primary Emotion: ${uiState.primaryEmotion}", style = MaterialTheme.typography.titleMedium)
            
            // Show all emotion scores
            uiState.lastEmotionScores!!.forEach { (emotion, confidence) ->
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(8.dp),
                    horizontalArrangement = Arrangement.SpaceBetween
                ) {
                    Text(emotion)
                    LinearProgressIndicator(
                        progress = confidence.toFloat(),
                        modifier = Modifier.weight(1f).padding(horizontal = 8.dp)
                    )
                    Text("${(confidence * 100).toInt()}%")
                }
            }
        }
        
        // Error state
        if (uiState.error != null) {
            Spacer(modifier = Modifier.height(16.dp))
            Text(
                text = uiState.error!!,
                color = Color.Red,
                style = MaterialTheme.typography.bodySmall
            )
        }
    }
}
```

---

## Decision Logging & Metacognition

### 1. Backend Decision Endpoint (Enhanced)

**File: `backend/src/routes/decisions.ts` (update)**

```typescript
import express, { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { getAnthropic } from '../lib/anthropic';
import { requireAuth } from '../middleware/auth';

const router = express.Router();
const prisma = new PrismaClient();

// POST /api/decisions - Log decision with metacognitive analysis
router.post('/decisions', requireAuth, async (req: Request, res: Response) => {
  try {
    const {
      title,
      description,
      category,
      planningClarity,
      strategyChosen,
      monitoringComprehension,
      evaluationEffectiveness,
      reflectionInsights,
    } = req.body;
    
    const userId = req.userId!;
    
    // Calculate metacognitive score from 4 pillars
    const metacognitiveScore = calculateMetacognitiveScore({
      planningClarity: planningClarity || 5,
      monitoringComprehension: monitoringComprehension || 5,
      evaluationEffectiveness: evaluationEffectiveness || 5,
      reflectionInsights: reflectionInsights || '',
    });
    
    // Use Claude API for insights (Phase 2.5+)
    // For Phase 2, use basic scoring
    
    const decision = await prisma.decision.create({
      data: {
        userId,
        title,
        description,
        category: category || 'personal',
        planningClarity: planningClarity || 5,
        strategyChosen,
        monitoringComprehension: monitoringComprehension || 5,
        evaluationEffectiveness: evaluationEffectiveness || 5,
        reflectionInsights,
        metacognitiveScore,
      },
    });
    
    res.json({
      id: decision.id,
      metacognitiveScore,
      pillars: {
        planning: (planningClarity || 5) / 10,
        monitoring: (monitoringComprehension || 5) / 10,
        evaluating: (evaluationEffectiveness || 5) / 10,
        reflecting: reflectionInsights ? 1 : 0.3,
      },
      createdAt: decision.createdAt,
    });
  } catch (error) {
    console.error('Decision logging error:', error);
    res.status(500).json({ error: 'Failed to log decision' });
  }
});

function calculateMetacognitiveScore(data: {
  planningClarity: number;
  monitoringComprehension: number;
  evaluationEffectiveness: number;
  reflectionInsights: string;
}): number {
  const planningComponent = (data.planningClarity / 10) * 0.25;
  const monitoringComponent = (data.monitoringComprehension / 10) * 0.25;
  const evaluatingComponent = (data.evaluationEffectiveness / 10) * 0.25;
  const reflectingComponent = data.reflectionInsights.length > 0 ? 0.25 : 0;
  
  return Math.min(1, planningComponent + monitoringComponent + evaluatingComponent + reflectingComponent);
}

export default router;
```

### 2. Android Decision Logging UI

**File: `android/app/src/main/java/com/neuraltwin/app/ui/screens/DecisionLoggingScreen.kt` (new)**

```kotlin
@Composable
fun DecisionLoggingScreen() {
    val viewModel: DecisionViewModel = hiltViewModel()
    val uiState by viewModel.uiState.collectAsState()
    
    var title by remember { mutableStateOf("") }
    var category by remember { mutableStateOf("personal") }
    var planningClarity by remember { mutableIntStateOf(5) }
    var strategyChosen by remember { mutableStateOf("") }
    
    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp)
            .verticalScroll(rememberScrollState())
    ) {
        Text("Log a Decision", style = MaterialTheme.typography.headlineSmall)
        
        Spacer(modifier = Modifier.height(16.dp))
        
        // Title
        OutlinedTextField(
            value = title,
            onValueChange = { title = it },
            label = { Text("Decision Title") },
            modifier = Modifier.fillMaxWidth()
        )
        
        // Category
        OutlinedTextField(
            value = category,
            onValueChange = { category = it },
            label = { Text("Category") },
            modifier = Modifier.fillMaxWidth()
        )
        
        // Planning Clarity (slider)
        Text("How clear is your goal? (1-10)")
        Slider(
            value = planningClarity.toFloat(),
            onValueChange = { planningClarity = it.toInt() },
            valueRange = 1f..10f,
            steps = 8,
            modifier = Modifier.fillMaxWidth()
        )
        Text("${planningClarity}/10")
        
        // Strategy
        OutlinedTextField(
            value = strategyChosen,
            onValueChange = { strategyChosen = it },
            label = { Text("What strategy will you use?") },
            modifier = Modifier.fillMaxWidth(),
            minLines = 3
        )
        
        Spacer(modifier = Modifier.height(16.dp))
        
        // Submit button
        Button(
            onClick = {
                viewModel.logDecision(
                    title = title,
                    category = category,
                    planningClarity = planningClarity,
                    strategyChosen = strategyChosen
                )
            },
            modifier = Modifier.fillMaxWidth()
        ) {
            Text("Log Decision")
        }
        
        // Results
        if (uiState.lastDecisionScore != null) {
            Spacer(modifier = Modifier.height(24.dp))
            Card {
                Column(modifier = Modifier.padding(16.dp)) {
                    Text("Metacognitive Score: ${(uiState.lastDecisionScore!! * 100).toInt()}", 
                        style = MaterialTheme.typography.titleMedium)
                    Text("Your decision shows good metacognitive awareness!", 
                        style = MaterialTheme.typography.bodySmall)
                }
            }
        }
    }
}
```

---

## Twin Interactions

### 1. Backend Twin Endpoint (Enhanced)

**File: `backend/src/routes/twins.ts` (update)**

```typescript
import express, { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { getAnthropic } from '../lib/anthropic';
import { requireAuth } from '../middleware/auth';

const router = express.Router();
const prisma = new PrismaClient();

const TWIN_PROMPTS: Record<string, string> = {
  TASK: "You are the Task Twin, focused on productivity and workflow optimization...",
  COACH: "You are the Coach Twin, specializing in metacognitive coaching using the 4-pillar framework...",
  GROWTH: "You are the Growth Twin, focused on learning and development...",
  // ... add all 9
};

// POST /api/twins/interaction - Chat with a Twin
router.post('/twins/interaction', requireAuth, async (req: Request, res: Response) => {
  try {
    const { twinType, userMessage } = req.body;
    const userId = req.userId!;
    
    if (!twinType || !userMessage) {
      return res.status(400).json({ error: 'twinType and userMessage required' });
    }
    
    // Get Twin system prompt
    const systemPrompt = TWIN_PROMPTS[twinType];
    if (!systemPrompt) {
      return res.status(400).json({ error: 'Invalid twinType' });
    }
    
    // Call Claude API
    const client = getAnthropic();
    const response = await client.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 1024,
      system: systemPrompt,
      messages: [
        {
          role: 'user',
          content: userMessage,
        },
      ],
    });
    
    const twinMessage = (response.content[0] as { type: 'text'; text: string }).text;
    
    // Store interaction
    await prisma.twinInteraction.create({
      data: {
        userId,
        twinType,
        userMessage,
        twinMessage,
        phase: 'conversation',
      },
    });
    
    res.json({
      twinType,
      twinMessage,
      timestamp: new Date(),
    });
  } catch (error) {
    console.error('Twin interaction error:', error);
    res.status(500).json({ error: 'Failed to get Twin response' });
  }
});

// GET /api/twins/:type/history - Get conversation history with a Twin
router.get('/twins/:type/history', requireAuth, async (req: Request, res: Response) => {
  try {
    const { type } = req.params;
    const userId = req.userId!;
    const limit = parseInt(req.query.limit as string) || 30;
    
    const interactions = await prisma.twinInteraction.findMany({
      where: { userId, twinType: type },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
    
    res.json({
      twinType: type,
      messages: interactions.reverse(), // Reverse to show oldest first
    });
  } catch (error) {
    console.error('History error:', error);
    res.status(500).json({ error: 'Failed to fetch history' });
  }
});

export default router;
```

---

## Android Integration

### 1. API Service Updates

**File: `android/app/src/main/java/com/neuraltwin/app/data/network/ApiService.kt` (new endpoints)**

```kotlin
interface ApiService {
    
    // Authentication
    @POST("api/auth/login")
    suspend fun login(@Body request: LoginRequest): LoginResponse
    
    // Voice
    @POST("api/voice")
    suspend fun uploadVoice(@Body request: VoiceUploadRequest): VoiceResponse
    
    @GET("api/voice")
    suspend fun getVoiceRecordings(
        @Query("limit") limit: Int = 20,
        @Query("offset") offset: Int = 0
    ): List<VoiceRecordingData>
    
    // Decisions
    @POST("api/decisions")
    suspend fun logDecision(@Body request: DecisionRequest): DecisionResponse
    
    // Twins
    @POST("api/twins/interaction")
    suspend fun chatWithTwin(@Body request: TwinChatRequest): TwinChatResponse
    
    @GET("api/twins/{type}/history")
    suspend fun getTwinHistory(@Path("type") twinType: String): TwinHistoryResponse
}
```

### 2. Repository Pattern

**File: `android/app/src/main/java/com/neuraltwin/app/data/repository/NeuralTwinRepository.kt` (enhanced)**

```kotlin
@Singleton
class NeuralTwinRepository @Inject constructor(
    private val apiService: ApiService,
    private val tokenManager: TokenManager,
) {
    
    suspend fun login(email: String, password: String): Result<LoginResponse> = withContext(Dispatchers.IO) {
        try {
            val response = apiService.login(LoginRequest(email, password))
            tokenManager.saveToken(response.token)
            Result.Success(response)
        } catch (e: Exception) {
            Result.Error(e.message ?: "Login failed")
        }
    }
    
    suspend fun uploadVoice(audioBase64: String): Result<VoiceResponse> = withContext(Dispatchers.IO) {
        try {
            val request = VoiceUploadRequest(
                audioBase64 = audioBase64,
                context = "User decision context",
                location = "Unknown"
            )
            val response = apiService.uploadVoice(request)
            Result.Success(response)
        } catch (e: Exception) {
            Result.Error(e.message ?: "Voice upload failed")
        }
    }
    
    suspend fun logDecision(
        title: String,
        category: String,
        planningClarity: Int,
        strategyChosen: String
    ): Result<DecisionResponse> = withContext(Dispatchers.IO) {
        try {
            val request = DecisionRequest(
                title = title,
                category = category,
                planningClarity = planningClarity,
                strategyChosen = strategyChosen
            )
            val response = apiService.logDecision(request)
            Result.Success(response)
        } catch (e: Exception) {
            Result.Error(e.message ?: "Decision logging failed")
        }
    }
    
    suspend fun chatWithTwin(
        twinType: String,
        userMessage: String
    ): Result<TwinChatResponse> = withContext(Dispatchers.IO) {
        try {
            val request = TwinChatRequest(twinType, userMessage)
            val response = apiService.chatWithTwin(request)
            Result.Success(response)
        } catch (e: Exception) {
            Result.Error(e.message ?: "Twin chat failed")
        }
    }
}

sealed class Result<T> {
    data class Success<T>(val data: T) : Result<T>()
    data class Error<T>(val message: String) : Result<T>()
}
```

---

## iOS Integration

### 1. Network Client

**File: `ios/NeuralTwin/Network/APIClient.swift` (new)**

```swift
import Foundation

class APIClient {
    static let shared = APIClient()
    
    private let session: URLSession
    private let baseURL: URL
    
    init(baseURL: URL = URL(string: "http://localhost:3000")!) {
        self.baseURL = baseURL
        
        let config = URLSessionConfiguration.default
        config.timeoutIntervalForRequest = 30
        config.timeoutIntervalForResource = 300
        self.session = URLSession(configuration: config)
    }
    
    // MARK: - Generic Request
    func request<T: Decodable>(_ endpoint: String, method: String = "GET", body: Data? = nil, token: String? = nil) async throws -> T {
        let url = baseURL.appendingPathComponent(endpoint)
        var request = URLRequest(url: url)
        request.httpMethod = method
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        
        if let token = token {
            request.setValue("Bearer \(token)", forHTTPHeaderField: "Authorization")
        }
        
        if let body = body {
            request.httpBody = body
        }
        
        let (data, response) = try await session.data(for: request)
        
        guard let httpResponse = response as? HTTPURLResponse, (200...299).contains(httpResponse.statusCode) else {
            throw APIError.invalidResponse
        }
        
        return try JSONDecoder().decode(T.self, from: data)
    }
    
    // MARK: - Login
    func login(email: String, password: String) async throws -> LoginResponse {
        let body = LoginRequest(email: email, password: password)
        let encoded = try JSONEncoder().encode(body)
        return try await request("api/auth/login", method: "POST", body: encoded)
    }
    
    // MARK: - Voice
    func uploadVoice(audioBase64: String, token: String) async throws -> VoiceResponse {
        let body = VoiceUploadRequest(audioBase64: audioBase64, context: nil, location: nil)
        let encoded = try JSONEncoder().encode(body)
        return try await request("api/voice", method: "POST", body: encoded, token: token)
    }
    
    // MARK: - Twin Chat
    func chatWithTwin(twinType: String, message: String, token: String) async throws -> TwinChatResponse {
        let body = TwinChatRequest(twinType: twinType, userMessage: message)
        let encoded = try JSONEncoder().encode(body)
        return try await request("api/twins/interaction", method: "POST", body: encoded, token: token)
    }
}

enum APIError: Error {
    case invalidResponse
    case decodingError
    case networkError
}
```

---

## Testing Patterns

### 1. Backend Unit Tests

**File: `backend/test/auth.test.ts`**

```typescript
import request from 'supertest';
import app from '../src/index';

describe('Authentication', () => {
  it('should login with valid credentials', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test@neuraltwin.com',
        password: 'test123',
      });
    
    expect(response.status).toBe(200);
    expect(response.body.token).toBeDefined();
    expect(response.body.user.email).toBe('test@neuraltwin.com');
  });
  
  it('should fail with invalid credentials', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test@neuraltwin.com',
        password: 'wrongpassword',
      });
    
    expect(response.status).toBe(401);
  });
});
```

### 2. Android ViewModel Tests

**File: `android/app/src/test/java/com/neuraltwin/app/viewmodel/VoiceViewModelTest.kt`**

```kotlin
@RunWith(RobolectricTestRunner::class)
class VoiceViewModelTest {
    
    private val repository = MockRepository()
    private val viewModel = VoiceViewModel(repository)
    
    @Test
    fun `uploadVoice should emit success state`() = runTest {
        val audioBase64 = "mockaudiobase64"
        
        viewModel.uploadVoice(audioBase64)
        
        val state = viewModel.uiState.first()
        assertThat(state.isProcessing).isFalse()
        assertThat(state.lastEmotionScores).isNotNull()
    }
    
    @Test
    fun `uploadVoice should emit error state on failure`() = runTest {
        repository.setShouldFail(true)
        
        viewModel.uploadVoice("audioBase64")
        
        val state = viewModel.uiState.first()
        assertThat(state.error).isNotNull()
    }
}
```

---

## Error Handling

### 1. Backend Global Error Handler

**File: `backend/src/middleware/errorHandler.ts`**

```typescript
import { Request, Response, NextFunction } from 'express';

interface AppError extends Error {
  status?: number;
  details?: string;
}

export const errorHandler = (
  error: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const status = error.status || 500;
  const message = error.message || 'Internal server error';
  
  console.error(`[${new Date().toISOString()}] Error:`, {
    status,
    message,
    path: req.path,
    details: error.details,
  });
  
  res.status(status).json({
    error: message,
    status,
    ...(process.env.NODE_ENV === 'development' && { details: error.details }),
  });
};
```

### 2. Android Error Handling

```kotlin
// In ViewModel
try {
    val response = repository.uploadVoice(audioBase64)
    when (response) {
        is Result.Success -> {
            _uiState.update { it.copy(lastEmotionScores = response.data.emotionScores) }
        }
        is Result.Error -> {
            _uiState.update { it.copy(error = response.message) }
        }
    }
} catch (e: Exception) {
    _uiState.update { it.copy(error = "Network error: ${e.message}") }
}
```

---

## Performance Optimization

### 1. API Request Caching

**File: `backend/src/lib/cache.ts`**

```typescript
import NodeCache from 'node-cache';

const cache = new NodeCache({ stdTTL: 300 }); // 5 minutes

export const getCachedOrFetch = async <T>(
  key: string,
  fetchFn: () => Promise<T>,
  ttl: number = 300
): Promise<T> => {
  const cached = cache.get<T>(key);
  if (cached) {
    return cached;
  }
  
  const data = await fetchFn();
  cache.set(key, data, ttl);
  return data;
};
```

### 2. Pagination

```typescript
// Backend
router.get('/voice', requireAuth, async (req: Request, res: Response) => {
  const limit = Math.min(parseInt(req.query.limit as string) || 20, 100);
  const offset = parseInt(req.query.offset as string) || 0;
  
  const recordings = await prisma.voiceRecording.findMany({
    where: { userId: req.userId! },
    take: limit,
    skip: offset,
    orderBy: { createdAt: 'desc' },
  });
  
  res.json({
    data: recordings,
    pagination: { limit, offset, hasMore: recordings.length === limit },
  });
});
```

---

## Summary

This implementation guide provides:
- ✅ Backend setup (env, Prisma, seeding)
- ✅ JWT authentication patterns
- ✅ Voice recording with emotion detection
- ✅ Decision logging with metacognitive scoring
- ✅ Twin interactions
- ✅ Android & iOS integration patterns
- ✅ Testing patterns
- ✅ Error handling
- ✅ Performance optimization

**Next Steps:**
1. Set up backend with `.env` and database
2. Implement authentication endpoints
3. Wire Android/iOS to login flow
4. Implement feature endpoints one by one
5. Test end-to-end on physical devices

---

**Status:** Ready for implementation  
**Prepared:** 2026-06-25  
**For:** Phase 2 Development
