import nodesService from './nodes.service';
import dorksService from './dorks.service';
import casesService from './projects.service';
import api from './api.service';

export { nodesService, dorksService, casesService, api }

export default {
  nodes: nodesService,
  dorks: dorksService,
  cases: casesService,
  api,
}