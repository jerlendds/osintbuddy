import api from './api.service';

class projects {
  async getProjects(skip: number, limit: number) {
    return await api.get(`/cases?limit=${limit}&skip=${skip}`);
  }
  async createProject({ name, description }: { name: string; description: string }) {
    return await api.post(`/cases?name=${encodeURIComponent(name)}&description=${encodeURIComponent(description)}`);
  }
}

export default new projects();
