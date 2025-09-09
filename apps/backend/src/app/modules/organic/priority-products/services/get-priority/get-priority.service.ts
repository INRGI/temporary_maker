/* eslint-disable no-useless-escape */
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

  public async getPriorityDetails(
    payload: GetPriorityPayload
  ): Promise<UnsubData> {
    const { product, unsubLinkUrl } = payload;
    const { linkStart, linkEnd, sheetName, unsubType } = unsubLinkUrl || {};
    const spreadsheetId = "1dB8SKnQliC8irUOoLBrEVfJxT-ZRnkBuu-iuI0RDtCg";

    try {
      const sheet = await this.spreadsheetService.getSheetWithRichText(
        spreadsheetId,
        sheetName
      );

      if (!sheet?.data?.[0]?.rowData) {
        return {
          unsubscribeText: "",
          unsubscribeUrl: "",
          unsubscribeBuildedBlock: "",
        };
      }

      const rows = sheet.data[0].rowData;
      let headerRow: string[] = [];
      let headerRowIdx = -1;

      for (let rowIndex = 0; rowIndex < rows.length; rowIndex++) {
        const row = rows[rowIndex];
        const cells = row.values || [];
        const potentialHeaders = cells.map(
          (c) => c.formattedValue?.toLowerCase() || ""
        );

        if (potentialHeaders.includes("product name")) {
          headerRow = potentialHeaders;
          headerRowIdx = rowIndex;
          break;
        }
      }

      if (headerRowIdx === -1) {
        return {
          unsubscribeText: "",
          unsubscribeUrl: "",
          unsubscribeBuildedBlock: "",
        };
      }

      const productColIdx = headerRow.findIndex(
        (h) => h.trim().toLocaleLowerCase() === "product name"
      );
      const unsubTextColIdx = headerRow.findIndex(
        (h) => h.trim().toLocaleLowerCase() === "footer"
      );
      const unsubUrlColIdx = headerRow.findIndex(
        (h) => h.trim().toLocaleLowerCase() === "optout link"
      );

      const customUnsubColIdx = unsubType
        ? headerRow.findIndex(
            (h) => h.trim().toLowerCase() === unsubType.trim().toLowerCase()
          )
        : -1;

      for (
        let rowIndex = headerRowIdx + 1;
        rowIndex < rows.length;
        rowIndex++
      ) {
        const row = rows[rowIndex];
        const cells = row.values || [];

        const productCell = cells[productColIdx]?.formattedValue || "";
        const products = productCell
          .split(/[\s\/\\]+/)
          .map((p) => p.trim().toLowerCase());
        if (!products.includes(product.toLowerCase())) continue;

        const unsubTextCell = cells[unsubTextColIdx];
        const unsubUrlCell =
          customUnsubColIdx !== -1
            ? cells[customUnsubColIdx]
            : cells[unsubUrlColIdx];

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

        let unsubscribeUrl: string;
        if (linkStart && linkEnd && unsubUrl && !unsubUrl.includes("http")) {
          unsubscribeUrl = `${linkStart}${unsubUrl}${linkEnd}`;
        } else {
          unsubscribeUrl = unsubUrl || urlFromLink;
        }

        let unsubscribeBuildedBlock = "";
        if (unsubLinkUrl.unsubHtmlBlock?.isUnsubHtmlBlock) {
          if (unsubLinkUrl.unsubHtmlBlock.htmlType === "custom") {
            unsubscribeBuildedBlock =
              await this.customUnsubBlockService.buildCustomUnsubBlock({
                customUnsubBlock: unsubLinkUrl.unsubHtmlBlock.customHtmlBlock,
                unsubscribeText: unsubText,
                linkedText,
                unsubscribeUrl,
              });
          }
          if (unsubLinkUrl.unsubHtmlBlock.htmlType === "default") {
            unsubscribeBuildedBlock =
              await this.defaultUnsubBlockService.buildDefaultUnsubBlock({
                defaultUnsubBlock: unsubLinkUrl.unsubHtmlBlock.defaultHtmlBlock,
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

      return {
        unsubscribeText: "",
        unsubscribeUrl: "",
        unsubscribeBuildedBlock: "",
      };
    } catch (error) {
      return {
        unsubscribeText: "",
        unsubscribeUrl: "",
        unsubscribeBuildedBlock: "",
      };
    }
  }
}
