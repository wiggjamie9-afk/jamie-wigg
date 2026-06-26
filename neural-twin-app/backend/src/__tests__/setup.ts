/**
 * Test setup and utilities
 * Configures mocking, database, and test helpers
 */

import { vi, beforeAll, afterEach, afterAll } from 'vitest';

// Mock environment variables
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-secret-key-do-not-use-in-production';
process.env.DATABASE_URL = 'file:./test.db';
process.env.CLAUDE_API_KEY = 'test-api-key';

// Mock Anthropic SDK
vi.mock('@anthropic-ai/sdk', () => {
  const mockMessages = {
    create: vi.fn().mockResolvedValue({
      content: [
        {
          type: 'text',
          text: 'This is a mocked Claude response.'
        }
      ]
    })
  };

  return {
    Anthropic: vi.fn(() => ({
      messages: mockMessages
    }))
  };
});

// Mock Prisma Client
vi.mock('@prisma/client', () => {
  const mockPrisma = {
    user: {
      create: vi.fn(),
      findUnique: vi.fn(),
      findFirst: vi.fn(),
      findMany: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
    twin: {
      create: vi.fn(),
      findUnique: vi.fn(),
      findMany: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
    voiceRecording: {
      create: vi.fn(),
      findUnique: vi.fn(),
      findMany: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
    decision: {
      create: vi.fn(),
      findUnique: vi.fn(),
      findMany: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
    twinInteraction: {
      create: vi.fn(),
      findMany: vi.fn(),
    },
    coherenceState: {
      create: vi.fn(),
      findFirst: vi.fn(),
      findMany: vi.fn(),
      update: vi.fn(),
    },
    accessibilitySettings: {
      create: vi.fn(),
      findUnique: vi.fn(),
      update: vi.fn(),
    },
    bookScan: {
      create: vi.fn(),
      findMany: vi.fn(),
    },
    $connect: vi.fn().mockResolvedValue(undefined),
    $disconnect: vi.fn().mockResolvedValue(undefined),
    $queryRaw: vi.fn().mockResolvedValue([1]),
  };

  return {
    PrismaClient: vi.fn(() => mockPrisma),
    prisma: mockPrisma,
  };
});

/**
 * Create a mock request with common defaults
 */
export function mockRequest(overrides = {}) {
  return {
    headers: {},
    body: {},
    params: {},
    query: {},
    userId: 'test-user-id',
    userEmail: 'test@example.com',
    ...overrides,
  };
}

/**
 * Create a mock response
 */
export function mockResponse() {
  const res = {
    status: vi.fn().mockReturnThis(),
    json: vi.fn().mockReturnThis(),
    send: vi.fn().mockReturnThis(),
    end: vi.fn().mockReturnThis(),
    setHeader: vi.fn().mockReturnThis(),
  };
  return res;
}

/**
 * Create a mock next function
 */
export function mockNext() {
  return vi.fn();
}

/**
 * Generate a valid JWT token
 */
export function generateToken(userId = 'test-user-id', email = 'test@example.com') {
  const jwt = require('jsonwebtoken');
  return jwt.sign(
    { userId, email },
    'test-secret-key-do-not-use-in-production',
    { expiresIn: '30d' }
  );
}

/**
 * Extract response data from mocked res.json
 */
export function getResponseData(mockRes: any) {
  if (mockRes.json.mock.calls.length > 0) {
    return mockRes.json.mock.calls[mockRes.json.mock.calls.length - 1][0];
  }
  return null;
}

/**
 * Extract status code from mocked res.status
 */
export function getResponseStatus(mockRes: any) {
  if (mockRes.status.mock.calls.length > 0) {
    return mockRes.status.mock.calls[mockRes.status.mock.calls.length - 1][0];
  }
  return 200;
}

export const testUtils = {
  mockRequest,
  mockResponse,
  mockNext,
  generateToken,
  getResponseData,
  getResponseStatus,
};
