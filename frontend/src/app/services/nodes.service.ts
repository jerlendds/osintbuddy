import api from './api.service';
import { XYPosition } from 'reactflow';

class NodesService {
  async getProjects(caseId: number) {
    // @todo refactor me to be more consistent like below...
    return await api.get(`/nodes?case_id=${caseId}`);
  }

  async createNode({ label, position, uuid }: { label: string; position: XYPosition, uuid: string }) {
    const result = await api.post(`/nodes/`, {
      label,
      position,
      project_uuid: uuid
    });
    return result.data as ApiNode;
  }

  async getTransforms({ label }: { label: string }) {
    const result = await api.get('/nodes/transforms', {
      params: {
        label,
      },
    });
    return result.data as ApiTransforms;
  }
}

export default new NodesService();
