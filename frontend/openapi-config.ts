import type { ConfigFile } from '@rtk-query/codegen-openapi'

const config: ConfigFile = {
  schemaFile: 'http://localhost:48997/api/v1/openapi.json',
  apiFile: './src/app/baseApi.ts',
  apiImport: 'emptyApi',
  outputFile: './src/app/api.ts',
  exportName: 'api',
  hooks: true,
}

export default config