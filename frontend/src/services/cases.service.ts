import api from './api.service';

class CasesService {
  async getCases(skip: number, limit: number) {
    return await api.get(`/cases?limit=${limit}&skip=${skip}`);
  }
  async createCase(name: string, description: string) {
    return await api.post(`/cases?name=${name}&description=${description}`);
  }
}

export default new CasesService();
