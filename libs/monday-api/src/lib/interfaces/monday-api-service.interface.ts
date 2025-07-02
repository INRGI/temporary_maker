export type MondayApiColumnValue = {
    column: { title: string };
    text: string | null;
  };
  
  export type MondayApiBoardData = {
    id: string;
    name: string;
    group?: { title: string };
    column_values: MondayApiColumnValue[];
  };
  
  export interface MondayApiGetDataResponse {
    data: {
      boards: {
        items_page: {
          items: MondayApiBoardData[];
          cursor?: string | null;
        };
      };
    };
    account_id: number;
  }
  