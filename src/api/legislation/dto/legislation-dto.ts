export interface ILegislationItem {
  bill: {
    billNo: string;
    billYear: string;

    billType: string;
    billTypeURI: string;

    shortTitleEn: string;
    shortTitleGa: string;

    source: string;
    sourceURI: string;

    status: string;
    statusURI: string;

    method: string;
    methodURI: string;

    lastUpdated: string;

    uri: string;

    mostRecentStage: {
      event: {
        progressStage: number;
        showAs: string;
        stageCompleted: boolean;
        stageOutcome: string | null;
      };
    };

    sponsors: {
      sponsor: {
        as: {
          showAs: string | null;
          uri: string | null;
        };
        by: {
          showAs: string | null;
          uri: string | null;
        };
        isPrimary: boolean;
      };
    }[];
  };

  contextDate: string;
}

export interface ILegislationResponse {
  head: {
    counts: {
      billCount: number;
      resultCount: number;
    };
  };
  results: ILegislationItem[];
}

export interface IGetLegislationParams {
  bill_status?: string[];
  bill_source?: string[];

  date_start?: string;
  date_end?: string;
  last_updated?: string;

  skip?: number;
  limit?: number;

  member_id?: string;
  bill_id?: string;
  bill_no?: string;
  bill_year?: string;

  chamber_id?: string[];

  act_year?: string;
  act_no?: string;

  lang?: string;
}
