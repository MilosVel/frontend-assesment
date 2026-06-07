import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { legislationApi } from '@/api/legislation/legislation-api';
import { legislationKeys } from '@/features/legislation/api/legislation-keys';
import type { IGetLegislationParams } from '@/api/legislation/dto/legislation-dto';

function getLegislations(params: IGetLegislationParams) {
  return legislationApi.getLegislation(params);
}

export function useGetLegislations(params: IGetLegislationParams) {
  return useQuery({
    queryKey: legislationKeys.list(JSON.stringify(params)),
    queryFn: () => getLegislations(params),
    placeholderData: keepPreviousData,
  });
}
