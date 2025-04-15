import { Injectable } from "@nestjs/common";
import { UnsubData } from "@epc-services/interface-adapters";
import {
  GSpreadsheetApiServicePort,
  InjectGSpreadsheetApiService,
} from "@epc-services/gspreadsheet-api";
import { BuildCustomUnsubBlockService } from "../build-custom-unsub-block/build-custom-unsub-block.service";
import { BuildDefaultUnsubBlockService } from "../build-default-unsub-block/build-default-unsub-block.service";
import { GetPriorityPayload } from "./get-priority.payload";

@Injectable()
export class GetPriorityService {
  constructor(
    @InjectGSpreadsheetApiService()
    private readonly spreadsheetService: GSpreadsheetApiServicePort,
    private readonly customUnsubBlockService: BuildCustomUnsubBlockService,
    private readonly defaultUnsubBlockService: BuildDefaultUnsubBlockService
  ) {}

  private readonly IGNORED_TABS = new Set([
    "Partners' Rules",
    "Requirements(ACM)",
    "Approved Domains(ACM)",
    "Request for Approval (ACM)",
    "Requirements(FIT)",
    "Approved Domains(FIT)",
  ]);

  public async getPriorityDetails(
    payload: GetPriorityPayload
  ): Promise<UnsubData> {
    const { product, unsubLinkUrl } = payload;
    const spreadsheetId = "1EpjVp5ckzQkqYRh-m8RrueA8vlAzB7O6-HL5BXRMvX0";

    try {
      const spreadsheet = await this.spreadsheetService.getSpreadsheetWithData(
        spreadsheetId
      );
      const sheets = spreadsheet?.sheets || [];
      
      for (const sheet of sheets) {
        const tabName = sheet.properties?.title || "";
        if (this.IGNORED_TABS.has(tabName)) continue;

        const rows = sheet.data?.[0]?.rowData || [];
        if (!rows.length) continue;

        let headerRow: string[] = [];
        let headerRowIdx = -1;

        for (let rowIndex = 0; rowIndex < rows.length; rowIndex++) {
          const row = rows[rowIndex];
          const cells = row.values || [];
          const potentialHeaders = cells.map(
            (c) => c.formattedValue?.toLowerCase() || ""
          );

          if (potentialHeaders.includes("product")) {
            headerRow = potentialHeaders;
            headerRowIdx = rowIndex;
            break;
          }
        }
        
        if (headerRowIdx === -1) continue;

        const productColIdx = headerRow.findIndex((h) => h === "product");
        const unsubTextColIdx = headerRow.findIndex((h) => h === "unsub text");
        const unsubUrlColIdx = headerRow.findIndex((h) => h === "unsub url");

        for (
          let rowIndex = headerRowIdx + 1;
          rowIndex < rows.length;
          rowIndex++
        ) {
          const row = rows[rowIndex];
          const cells = row.values || [];

          const productCell = cells[productColIdx]?.formattedValue || "";
          const productCode = productCell.split("/").pop()?.trim();

          if (productCode !== product) continue;

          const unsubTextCell = cells[unsubTextColIdx];
          const unsubUrlCell = cells[unsubUrlColIdx];

          const unsubText = unsubTextCell?.formattedValue || "";
          const unsubUrl = unsubUrlCell?.formattedValue || "";

          let linkedText = "";
          let urlFromLink = "";
          const runs = unsubTextCell?.textFormatRuns || [];

          for (let i = 0; i < runs.length; i++) {
            const start = runs[i].startIndex;
            const end = runs[i + 1]?.startIndex || unsubText.length;
            const fragment = unsubText.substring(start, end);
            const url = runs[i].format?.link?.uri;

            if (url) {
              linkedText = fragment;
              urlFromLink = url;
              break;
            }
          }

          const unsubscribeUrl = unsubUrl || urlFromLink;

          let unsubscribeBuildedBlock = "";
          if (unsubLinkUrl.unsubHtmlBlock?.isUnsubHtmlBlock) {
            if (unsubLinkUrl.unsubHtmlBlock.htmlType === "custom") {
              unsubscribeBuildedBlock =
                await this.customUnsubBlockService.buildCustomUnsubBlock({
                  customUnsubBlock:
                    unsubLinkUrl.unsubHtmlBlock.customHtmlBlock,
                  unsubscribeText: unsubText,
                  linkedText,
                  unsubscribeUrl,
                });
            } else if (unsubLinkUrl.unsubHtmlBlock.htmlType === "default") {
              unsubscribeBuildedBlock =
                await this.defaultUnsubBlockService.buildDefaultUnsubBlock({
                  defaultUnsubBlock:
                    unsubLinkUrl.unsubHtmlBlock.defaultHtmlBlock,
                  unsubscribeText: unsubText,
                  linkedText,
                  unsubscribeUrl,
                });
            }
          }

          return {
            unsubscribeText: unsubText,
            unsubscribeUrl,
            unsubscribeBuildedBlock,
          };
        }
      }

      return this.emptyResult();
    } catch (error) {
      return this.emptyResult();
    }
  }

  private emptyResult(): UnsubData {
    return {
      unsubscribeText: "",
      unsubscribeUrl: "",
      unsubscribeBuildedBlock: "",
    };
  }
}
