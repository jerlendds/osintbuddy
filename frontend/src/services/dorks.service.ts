import api from './api.service';

class DorksService {
  async getDorks(limit: number, skip: number, filter?: number) {
    return await api.get(`/ghdb/dorks?limit=${limit}&skip=${skip}&filter=${filter ?? -1}`);
  }

  async getAuthor(id: number) {
    return await api.get(`/ghdb/author?id=${id}`)
  }

  async updateDorks() {
    return await api.post('/ghdb/update')
  }
}

export default new DorksService();
