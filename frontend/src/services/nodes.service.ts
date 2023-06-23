import { JSONObject } from '@/globals';
import api from './api.service';
import { XYPosition } from 'reactflow';

class NodesService {
  async getCases(caseId: number) {
    return await api.get(`/nodes?case_id=${caseId}`);
  }

  async createNode({ label, position }: { label: string; position: XYPosition }) {
    const result = await api.post(`/nodes/`, {
      label,
      ...position,
    });
    return result.data as JSONObject;
  }

  async getTransforms({ label }: { label: string }) {
    const result = await api.get('/nodes/transforms', {
      params: {
        label,
      },
    });
    return result.data as JSONObject
  }
}

export default new NodesService();
