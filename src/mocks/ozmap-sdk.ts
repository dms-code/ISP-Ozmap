import { Box, BoxType, CreateBoxDTO, CreateCableDTO, CreateProjectDTO, Pagination, Prospect, UpdateBoxDTO } from '@ozmap/ozmap-sdk-original';

// Mock da classe principal
class OZMapSDK {
  constructor(baseUrl: string, options: any) {}

  prospect: any = {
    create: async (data:any) => {
      return Promise.resolve({
        id: Math.random().toString(36).substring(2, 10) + (new Date()).getTime().toString(36),
        name: data.name,
        address: data.address,
        code: data.code,
        external_id: data.external_id,
        tags: data.tags,
        createdAt: new Date(),
        updatedAt: new Date()
      } as Prospect);
    }
  }

  boxType: any = {
    find: async (query: any) => {
      return Promise.resolve({
        total: 2,
        count: 2,
        rows: [
          {
            config: {
              base: {
                color: "#3388FFFF"
              },
              regular: {
                fillColor: "#3388FFFF"
              },
              not_implanted: {
                fillColor: "#FFA500A6"
              },
              draft: {
                fillColor: "#FF00FF"
              }
            },
            default_reserve: 10,
            code: "Nap",
            brand: "NAP650A",
            mold: "650A",
            description: "Nap",
            prefix: "Nap",
            default_level: 2,
            default_template: "5da6146f493d9c00066653f7",
            createdAt: "2023-01-18T14:04:50.938Z",
            updatedAt: "2023-01-18T14:04:50.938Z",
            id: "63c7fc82ea930c0014f7fcba"
          },
          {
            config: {
              base: {
                color: "#3388FFFF"
              },
              regular: {
                fillColor: "#3388FFFF"
              },
              not_implanted: {
                fillColor: "#FFA500A6"
              },
              draft: {
                fillColor: "#FF00FF"
              }
            },
            default_reserve: 10,
            code: "Splitter",
            brand: "SPLITTER650A",
            mold: "650A",
            description: "Splitter",
            prefix: "Splitter",
            default_level: 2,
            default_template: "5da6146f493d9c00066653f7",
            createdAt: "2023-01-18T14:04:50.938Z",
            updatedAt: "2023-01-18T14:04:50.938Z",
            id: "63c7fc82ea930c0014f7fcbb"
          }
        ]
      } as Pagination<BoxType>);
    }
  }

  box: any = {
    create: async (data: CreateBoxDTO) => {
      return Promise.resolve({
        id: Math.random().toString(36).substring(2, 10) + (new Date()).getTime().toString(36),
        name: "Box " + Math.random().toString(36).substring(2, 10),
        boxType: {
          id: data.boxType ?? Math.random().toString(36).substring(2, 10) + (new Date()).getTime().toString(36)
        },
        hierarchyLevel: 1,
        project: data.project,
        createdAt: new Date(),
        updatedAt: new Date()
      } as Box);
    }
  } 

  project: any = {
    create: async (data: CreateProjectDTO) => {
      return Promise.resolve({
        id: Math.random().toString(36).substring(2, 10) + (new Date()).getTime().toString(36),
        name: data.name,
        identifier: data.identifier,
        createdAt: new Date(),
        updatedAt: new Date()
      })
    }
  } 

  cable: any = {
    create: async (data: CreateCableDTO) => {
      return Promise.resolve(
        {
          id: Math.random().toString(36).substring(2, 10) + (new Date()).getTime().toString(36),
          ...data 
        }
      );
    }
  }
  
}

// Reexporte os tipos/interfaces do SDK real
export type { 
  CreateProjectDTO,
  CreateProspectDTO,
  CreateBoxDTO,
  Box,
  BoxType,
  CreateBoxTypeDTO,
  CreateCableDTO,
  CreatePoleDTO,
  Cable,
  Prospect,
  Project
} from '@ozmap/ozmap-sdk-original';

// Exporte o mock como default
export default OZMapSDK;