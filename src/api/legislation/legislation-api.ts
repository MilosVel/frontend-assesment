import { BaseApi } from '@/api/base/base-api';

import type {
  IGetLegislationParams,
  ILegislationResponse,
} from '@/api/legislation/dto/legislation-dto';

class LegislationApi extends BaseApi {
  constructor() {
    super();
  }

  public async getLegislation(params?: IGetLegislationParams) {
    const api = this.getAxiosInstance();

    const { data } = await api.get<ILegislationResponse>('/legislation', {
      params,
    });
    return data;
  }
}

export const legislationApi = new LegislationApi();
