import {
  MondayApiProductBoardData,
  MondayApiDomainBoardData,
  MondayApiQueryParams,
  MondayApiBoardData,
} from "../interfaces";

export interface MondayApiServicePort {
  getProductData(
    productName: string,
    boardId: number
  ): Promise<MondayApiProductBoardData[]>;

  getDomainData(
    domainName: string,
    boardId: number
  ): Promise<MondayApiDomainBoardData[]>;

  getProductDataByEndsWith(
    productName: string,
    boardId: number
  ): Promise<MondayApiProductBoardData[]>;

  getMultipleProductsData(
    productNames: string[],
    boardId: number
  ): Promise<MondayApiProductBoardData[]>;

  getItemsWithCursor(queryParams: MondayApiQueryParams): Promise<{
    items: MondayApiBoardData[];
    cursor: string | null;
  }>;

  getItemsByQuery(
    queryParams: MondayApiQueryParams
  ): Promise<MondayApiBoardData[]>;
}
