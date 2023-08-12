import api from './api.service';

interface CreateEntity { 
  label: string; 
  description: string;
  author: string;
  source?: string 
}

interface UpdateEntity {
  uuid: string;
  label?: string; 
  description?: string;
  author?: string;
  source?: string 
}

class entities {
  async getEntities(skip: number, limit: number) {
    return await api.get(`/entities?limit=${limit}&skip=${skip}`);
  }
  async createEntity({ label, description, author, source }: CreateEntity) {
    return await api.post(`/entities`, {
      label, description, source, author
    });
  }
  async getEntity({uuid}: JSONObject) {
    return await api.get(`/entities/${uuid}`)
  }

  async updateEntity({uuid, label, description, author, source}: UpdateEntity) {
    return await api.put(`/entities/${uuid}`, Object.assign({}, {
      label,
      description,
      author,
      source
    }))
  }
}

export default new entities();
