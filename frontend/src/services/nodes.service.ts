import api from './api.service';

class NodesService {
  async getCases(caseId: number) {
    return await api.get(`/nodes?case_id=${caseId}`)
  }

}

export default new NodesService();
