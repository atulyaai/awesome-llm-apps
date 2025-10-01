import axios, { AxiosInstance, AxiosResponse } from 'axios';

// Base URL for the API
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

// Types
export interface User {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'developer' | 'user';
  permissions: string[];
  created_at: string;
  last_login?: string;
  is_active: boolean;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: User;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  role?: 'user' | 'developer';
}

export interface ChatResponse {
  response: string;
  session_id?: string;
  metadata?: {
    reasoning?: string;
    confidence?: number;
    sources?: string[];
    tokens?: number;
  };
}

export interface SystemStatus {
  status: 'healthy' | 'warning' | 'error' | 'offline';
  uptime: number;
  cpu_usage: number;
  memory_usage: number;
  active_connections: number;
  last_updated: string;
  components: {
    memory: 'healthy' | 'warning' | 'error';
    reasoning: 'healthy' | 'warning' | 'error';
    learning: 'healthy' | 'warning' | 'error';
    evolution: 'healthy' | 'warning' | 'error';
  };
}

export interface MemoryRequest {
  content: string;
  type: 'episodic' | 'semantic' | 'procedural';
  importance: number;
  context?: Record<string, any>;
}

export interface MemoryResponse {
  id: string;
  content: string;
  type: string;
  importance: number;
  timestamp: string;
  context?: Record<string, any>;
  similarity_score?: number;
}

export interface MemoryStats {
  total_memories: number;
  recent_memories: number;
  memory_types: Record<string, number>;
  storage_size: number;
  average_importance: number;
}

export interface ReasoningRequest {
  query: string;
  context?: Record<string, any>;
  reasoning_type?: 'deductive' | 'inductive' | 'abductive';
}

export interface ReasoningResponse {
  reasoning_chain: string[];
  conclusion: string;
  confidence: number;
  evidence: string[];
  assumptions: string[];
}

export interface LearningRequest {
  experience: string;
  outcome: 'success' | 'failure' | 'neutral';
  context?: Record<string, any>;
  feedback?: string;
}

export interface LearningStats {
  total_experiences: number;
  success_rate: number;
  learning_rate: number;
  adaptation_score: number;
  knowledge_growth: number;
  recent_improvements: string[];
}

export interface EvolutionStatus {
  generation: number;
  fitness_score: number;
  mutations: number;
  improvements: string[];
  last_evolution: string;
  next_evolution_eta?: string;
}

export interface SystemMetrics {
  performance: {
    response_time: number;
    throughput: number;
    error_rate: number;
  };
  resources: {
    cpu_usage: number;
    memory_usage: number;
    disk_usage: number;
    network_io: number;
  };
  ai_metrics: {
    reasoning_accuracy: number;
    learning_efficiency: number;
    memory_utilization: number;
    evolution_progress: number;
  };
}

// API Client Class
class AGIApiClient {
  private client: AxiosInstance;
  private token: string | null = null;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor to add auth token
    this.client.interceptors.request.use(
      (config) => {
        if (this.token) {
          config.headers.Authorization = `Bearer ${this.token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401) {
          // Token expired, try to refresh
          try {
            await this.refreshToken();
            // Retry the original request
            return this.client.request(error.config);
          } catch (refreshError) {
            // Refresh failed, clear token and redirect to login
            this.clearToken();
            window.location.href = '/auth';
          }
        }
        return Promise.reject(error);
      }
    );

    // Load token from localStorage
    this.loadToken();
  }

  private loadToken(): void {
    const token = localStorage.getItem('agi_token');
    if (token) {
      this.token = token;
    }
  }

  private setToken(token: string): void {
    this.token = token;
    localStorage.setItem('agi_token', token);
  }

  private clearToken(): void {
    this.token = null;
    localStorage.removeItem('agi_token');
  }

  public getToken(): string | null {
    return this.token;
  }

  // Authentication endpoints
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response: AxiosResponse<AuthResponse> = await this.client.post('/auth/login', credentials);
    const { access_token } = response.data;
    this.setToken(access_token);
    return response.data;
  }

  async register(userData: RegisterRequest): Promise<AuthResponse> {
    const response: AxiosResponse<AuthResponse> = await this.client.post('/auth/register', userData);
    const { access_token } = response.data;
    this.setToken(access_token);
    return response.data;
  }

  async logout(): Promise<void> {
    try {
      await this.client.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      this.clearToken();
    }
  }

  async getCurrentUser(): Promise<User> {
    const response: AxiosResponse<User> = await this.client.get('/auth/me');
    return response.data;
  }

  async refreshToken(): Promise<AuthResponse> {
    const response: AxiosResponse<AuthResponse> = await this.client.post('/auth/refresh');
    const { access_token } = response.data;
    this.setToken(access_token);
    return response.data;
  }

  // Health check
  async healthCheck(): Promise<SystemStatus> {
    const response: AxiosResponse<SystemStatus> = await this.client.get('/health');
    return response.data;
  }

  // Chat endpoints
  async sendMessage(message: string, context?: Record<string, any>, sessionId?: string): Promise<ChatResponse> {
    const response: AxiosResponse<ChatResponse> = await this.client.post('/chat/message', {
      message,
      context,
      session_id: sessionId,
    });
    return response.data;
  }

  async getChatHistory(sessionId?: string): Promise<any[]> {
    const params = sessionId ? { session_id: sessionId } : {};
    const response: AxiosResponse<any[]> = await this.client.get('/chat/history', { params });
    return response.data;
  }

  async getChatSessions(): Promise<any[]> {
    const response: AxiosResponse<any[]> = await this.client.get('/chat/sessions');
    return response.data;
  }

  async clearChatHistory(sessionId?: string): Promise<{ success: boolean; message: string }> {
    const data = sessionId ? { session_id: sessionId } : {};
    const response: AxiosResponse<{ success: boolean; message: string }> = await this.client.delete('/chat/history', { data });
    return response.data;
  }

  // Memory endpoints
  async storeMemory(request: MemoryRequest): Promise<MemoryResponse> {
    const response: AxiosResponse<MemoryResponse> = await this.client.post('/api/v1/memory/store', request);
    return response.data;
  }

  async retrieveMemories(query: string, limit: number = 10): Promise<MemoryResponse[]> {
    const response: AxiosResponse<MemoryResponse[]> = await this.client.get('/api/v1/memory/retrieve', {
      params: { query, limit },
    });
    return response.data;
  }

  async getMemoryStats(): Promise<MemoryStats> {
    const response: AxiosResponse<MemoryStats> = await this.client.get('/api/v1/memory/stats');
    return response.data;
  }

  // Reasoning endpoints
  async analyzeReasoning(request: ReasoningRequest): Promise<ReasoningResponse> {
    const response: AxiosResponse<ReasoningResponse> = await this.client.post('/api/v1/reasoning/analyze', request);
    return response.data;
  }

  // Learning endpoints
  async addLearningExperience(request: LearningRequest): Promise<{ success: boolean; message: string }> {
    const response: AxiosResponse<{ success: boolean; message: string }> = await this.client.post('/api/v1/learning/experience', request);
    return response.data;
  }

  async getLearningStats(): Promise<LearningStats> {
    const response: AxiosResponse<LearningStats> = await this.client.get('/api/v1/learning/stats');
    return response.data;
  }

  // Evolution endpoints
  async getEvolutionStatus(): Promise<EvolutionStatus> {
    const response: AxiosResponse<EvolutionStatus> = await this.client.get('/api/v1/evolution/status');
    return response.data;
  }

  async triggerEvolution(): Promise<{ success: boolean; message: string }> {
    const response: AxiosResponse<{ success: boolean; message: string }> = await this.client.post('/api/v1/evolution/trigger');
    return response.data;
  }

  // System endpoints
  async getSystemStatus(): Promise<SystemStatus> {
    const response: AxiosResponse<SystemStatus> = await this.client.get('/api/v1/system/status');
    return response.data;
  }

  async getSystemMetrics(): Promise<SystemMetrics> {
    const response: AxiosResponse<SystemMetrics> = await this.client.get('/api/v1/system/metrics');
    return response.data;
  }

  // Admin endpoints
  async getAdminDashboard(): Promise<any> {
    const response: AxiosResponse<any> = await this.client.get('/admin/dashboard');
    return response.data;
  }

  async getSystemHealth(): Promise<any> {
    const response: AxiosResponse<any> = await this.client.get('/admin/system/health');
    return response.data;
  }

  async getSystemLogs(level?: string, limit?: number): Promise<any[]> {
    const params: any = {};
    if (level) params.level = level;
    if (limit) params.limit = limit;
    const response: AxiosResponse<any[]> = await this.client.get('/admin/system/logs', { params });
    return response.data;
  }

  async getConfiguration(): Promise<any> {
    const response: AxiosResponse<any> = await this.client.get('/admin/config');
    return response.data;
  }

  async updateConfiguration(config: any): Promise<{ success: boolean; message: string }> {
    const response: AxiosResponse<{ success: boolean; message: string }> = await this.client.put('/admin/config', config);
    return response.data;
  }

  async restartSystem(): Promise<{ success: boolean; message: string }> {
    const response: AxiosResponse<{ success: boolean; message: string }> = await this.client.post('/admin/system/restart');
    return response.data;
  }

  async getUserActivity(): Promise<any[]> {
    const response: AxiosResponse<any[]> = await this.client.get('/admin/users/activity');
    return response.data;
  }

  async getPerformanceMetrics(): Promise<any> {
    const response: AxiosResponse<any> = await this.client.get('/admin/performance/metrics');
    return response.data;
  }

  // Developer endpoints
  async getDeveloperDashboard(): Promise<any> {
    const response: AxiosResponse<any> = await this.client.get('/developer/dashboard');
    return response.data;
  }

  async getDeveloperMetrics(component?: string, category?: string): Promise<any[]> {
    const params: any = {};
    if (component) params.component = component;
    if (category) params.category = category;
    const response: AxiosResponse<any[]> = await this.client.get('/developer/metrics', { params });
    return response.data;
  }

  async getDebugInfo(component: string): Promise<any> {
    const response: AxiosResponse<any> = await this.client.get(`/developer/debug/${component}`);
    return response.data;
  }

  async getSystemTraces(limit?: number): Promise<any[]> {
    const params = limit ? { limit } : {};
    const response: AxiosResponse<any[]> = await this.client.get('/developer/traces', { params });
    return response.data;
  }

  async triggerDebugOperation(operation: string): Promise<{ success: boolean; message: string }> {
    const response: AxiosResponse<{ success: boolean; message: string }> = await this.client.post('/developer/debug/trigger', { operation });
    return response.data;
  }
}

// Create and export API client instance
export const agiApi = new AGIApiClient();

// Export default
export default agiApi;