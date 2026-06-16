const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api/v1';

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  headers?: Record<string, string>;
  body?: any;
  token?: string;
}

class APIClient {
  private token: string | null = null;

  setToken(token: string) {
    this.token = token;
    localStorage.setItem('accessToken', token);
  }

  getToken(): string | null {
    return this.token || localStorage.getItem('accessToken');
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem('accessToken');
  }

  async request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const {
      method = 'GET',
      headers = {},
      body,
      token = this.getToken(),
    } = options;

    const finalHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
      ...headers,
    };

    if (token) {
      finalHeaders['Authorization'] = `Bearer ${token}`;
    }

    const config: RequestInit = {
      method,
      headers: finalHeaders,
    };

    if (body) {
      config.body = JSON.stringify(body);
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(error.error || `HTTP ${response.status}`);
    }

    return response.json();
  }

  // Auth endpoints
  async signup(email: string, password: string, displayName: string) {
    return this.request('/auth/signup', {
      method: 'POST',
      body: { email, password, displayName },
    });
  }

  async login(email: string, password: string) {
    return this.request('/auth/login', {
      method: 'POST',
      body: { email, password },
    });
  }

  async logout() {
    return this.request('/auth/logout', { method: 'POST' });
  }

  // Progress endpoints
  async getProgress(userId: string, appId: string) {
    return this.request(`/progress/${userId}/${appId}`);
  }

  async completeLesson(
    userId: string,
    appId: string,
    trackId: string,
    lessonIndex: number,
    timeSpent?: number,
    emotionalRating?: number
  ) {
    return this.request(`/progress/${userId}/${appId}/complete`, {
      method: 'POST',
      body: { trackId, lessonIndex, timeSpent, emotionalRating },
    });
  }

  async getStats(userId: string) {
    return this.request(`/progress/${userId}/stats`);
  }

  async getTimeline(userId: string, limit?: number) {
    const url = limit
      ? `/progress/${userId}/timeline?limit=${limit}`
      : `/progress/${userId}/timeline`;
    return this.request(url);
  }

  // Chat endpoints
  async sendMessage(userId: string, message: string, appId?: string, sessionId?: string) {
    return this.request(`/chat/${userId}/send`, {
      method: 'POST',
      body: { message, appId, sessionId },
    });
  }

  async getChatSessions(userId: string) {
    return this.request(`/chat/${userId}/sessions`);
  }

  async getChatHistory(userId: string, sessionId: string) {
    return this.request(`/chat/${userId}/sessions/${sessionId}`);
  }

  async clearChatSession(userId: string, sessionId: string) {
    return this.request(`/chat/${userId}/sessions/${sessionId}/clear`, {
      method: 'POST',
    });
  }

  async generateAffirmation(userId: string, appId: string, trackId: string, mood?: string) {
    return this.request(`/chat/${userId}/generate-affirmation`, {
      method: 'POST',
      body: { appId, trackId, mood },
    });
  }

  // Biometrics endpoints
  async submitBiometrics(
    userId: string,
    data: {
      heartRate?: number;
      hrv?: number;
      breathingRate?: number;
      stressLevel?: number;
      emotionalState?: string;
      source: string;
    }
  ) {
    return this.request(`/biometrics/${userId}/submit`, {
      method: 'POST',
      body: data,
    });
  }

  async getLatestBiometrics(userId: string) {
    return this.request(`/biometrics/${userId}/latest`);
  }

  async getBiometricTrend(userId: string, range?: string) {
    const url = range
      ? `/biometrics/${userId}/trend?range=${range}`
      : `/biometrics/${userId}/trend`;
    return this.request(url);
  }

  async getBiometricHistory(userId: string, limit?: number) {
    const url = limit
      ? `/biometrics/${userId}/history?limit=${limit}`
      : `/biometrics/${userId}/history`;
    return this.request(url);
  }

  async linkHealthKit(userId: string, token: string) {
    return this.request(`/biometrics/${userId}/link-apple-health`, {
      method: 'POST',
      body: { token },
    });
  }

  async linkGoogleFit(userId: string, token: string) {
    return this.request(`/biometrics/${userId}/link-google-fit`, {
      method: 'POST',
      body: { token },
    });
  }
}

export const apiClient = new APIClient();
