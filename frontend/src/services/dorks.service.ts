import api from './api.service';

class DorksService {
  async getDorks(limit: number, skip: number) {
    return await api.get(`/ghdb/dorks?limit=${limit}&skip=${skip}`);
  }

  async getAuthor(id: number) {
    return await api.get(`/ghdb/author?id=${id}`)
  }

  async updateDorks() {
    return await api.post('/ghdb/update')
  }
}

export default new DorksService();
