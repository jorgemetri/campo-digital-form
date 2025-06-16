
// Configuração da API - ALTERE ESTAS CONFIGURAÇÕES
const API_BASE_URL = 'http://localhost:8000'; // ALTERE: URL da sua API FastAPI
const API_ENDPOINTS = {
  // ALTERE: Endpoints da sua API FastAPI
  saveFormData: '/api/field-data',
  getFormData: '/api/field-data',
  // Adicione outros endpoints conforme necessário
};

// Interface para resposta da API - ALTERE conforme sua API
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// Classe para gerenciar as chamadas da API
class ApiService {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  // Método genérico para fazer requisições
  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const url = `${this.baseUrl}${endpoint}`;
      
      // CONFIGURAÇÃO: Headers padrão - adicione autenticação se necessário
      const defaultHeaders = {
        'Content-Type': 'application/json',
        // 'Authorization': `Bearer ${token}`, // DESCOMENTE se usar autenticação
      };

      const response = await fetch(url, {
        ...options,
        headers: {
          ...defaultHeaders,
          ...options.headers,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return {
        success: true,
        data,
      };
    } catch (error) {
      console.error('API Error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  // INTEGRAÇÃO 1: Salvar dados do formulário na API
  async saveFieldData(formData: any): Promise<ApiResponse<any>> {
    return this.makeRequest(API_ENDPOINTS.saveFormData, {
      method: 'POST',
      body: JSON.stringify(formData),
    });
  }

  // INTEGRAÇÃO 2: Buscar dados do formulário da API
  async getFieldData(filters?: any): Promise<ApiResponse<any[]>> {
    const queryParams = filters ? `?${new URLSearchParams(filters)}` : '';
    return this.makeRequest(`${API_ENDPOINTS.getFormData}${queryParams}`, {
      method: 'GET',
    });
  }

  // INTEGRAÇÃO 3: Exemplo de endpoint para buscar fazendas
  async getFarms(): Promise<ApiResponse<string[]>> {
    return this.makeRequest('/api/farms', {
      method: 'GET',
    });
  }
}

// Instância singleton do serviço
export const apiService = new ApiService();

// Hook personalizado para usar a API com React Query
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// INTEGRAÇÃO 4: Hook para salvar dados
export const useSaveFieldData = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (formData: any) => apiService.saveFieldData(formData),
    onSuccess: () => {
      // Invalida cache para atualizar dados
      queryClient.invalidateQueries({ queryKey: ['fieldData'] });
    },
  });
};

// INTEGRAÇÃO 5: Hook para buscar dados
export const useFieldData = (filters?: any) => {
  return useQuery({
    queryKey: ['fieldData', filters],
    queryFn: () => apiService.getFieldData(filters),
  });
};

// INTEGRAÇÃO 6: Hook para buscar fazendas
export const useFarms = () => {
  return useQuery({
    queryKey: ['farms'],
    queryFn: () => apiService.getFarms(),
  });
};
