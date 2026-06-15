import jwt from 'jsonwebtoken';
import bcryptjs from 'bcryptjs';

interface TokenPayload {
  userId: string;
  email: string;
  iat: number;
  exp: number;
}

interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export class AuthService {
  private jwtSecret = process.env.JWT_SECRET || 'dev-secret-key-change-in-production';
  private refreshSecret = process.env.REFRESH_SECRET || 'dev-refresh-secret';
  private accessTokenExpiry = '15m';
  private refreshTokenExpiry = '7d';

  // Hash password
  async hashPassword(password: string): Promise<string> {
    const salt = await bcryptjs.genSalt(10);
    return bcryptjs.hash(password, salt);
  }

  // Verify password
  async verifyPassword(password: string, hash: string): Promise<boolean> {
    return bcryptjs.compare(password, hash);
  }

  // Generate JWT tokens
  generateTokens(userId: string, email: string): AuthTokens {
    const accessToken = jwt.sign(
      { userId, email },
      this.jwtSecret,
      { expiresIn: this.accessTokenExpiry },
    );

    const refreshToken = jwt.sign(
      { userId, email },
      this.refreshSecret,
      { expiresIn: this.refreshTokenExpiry },
    );

    return { accessToken, refreshToken };
  }

  // Verify access token
  verifyAccessToken(token: string): TokenPayload | null {
    try {
      return jwt.verify(token, this.jwtSecret) as TokenPayload;
    } catch {
      return null;
    }
  }

  // Verify refresh token and issue new access token
  refreshAccessToken(refreshToken: string): string | null {
    try {
      const payload = jwt.verify(refreshToken, this.refreshSecret) as TokenPayload;
      const newAccessToken = jwt.sign(
        { userId: payload.userId, email: payload.email },
        this.jwtSecret,
        { expiresIn: this.accessTokenExpiry },
      );
      return newAccessToken;
    } catch {
      return null;
    }
  }

  // Voice biometric authentication
  extractVoiceFeatures(audioBuffer: ArrayBuffer): Float32Array {
    // Placeholder: In production, use advanced audio processing
    // - Extract MFCC (Mel-Frequency Cepstral Coefficients)
    // - Use speaker verification model (e.g., TitaNet, x-vector)
    // - Return normalized feature vector

    return new Float32Array(128); // Placeholder feature vector
  }

  async verifyVoiceBiometric(
    audioBuffer: ArrayBuffer,
    storedFingerprint: Buffer,
    threshold: number = 0.95,
  ): Promise<boolean> {
    const features = this.extractVoiceFeatures(audioBuffer);
    const storedFeatures = new Float32Array(storedFingerprint);

    // Calculate cosine similarity
    const similarity = this.cosineSimilarity(features, storedFeatures);

    return similarity > threshold;
  }

  private cosineSimilarity(a: Float32Array, b: Float32Array): number {
    let dotProduct = 0;
    let normA = 0;
    let normB = 0;

    for (let i = 0; i < a.length; i++) {
      dotProduct += a[i] * b[i];
      normA += a[i] * a[i];
      normB += b[i] * b[i];
    }

    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
  }

  // Generate voice fingerprint for new user
  async createVoiceFingerprint(audioBuffer: ArrayBuffer): Promise<Buffer> {
    const features = this.extractVoiceFeatures(audioBuffer);
    return Buffer.from(features);
  }
}

export const authService = new AuthService();
