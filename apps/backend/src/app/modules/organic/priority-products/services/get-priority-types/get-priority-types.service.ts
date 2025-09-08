import {
  GDriveApiServicePort,
  InjectGDriveApiService,
} from "@epc-services/gdrive-api";
import {
  GetPriorityTypesResponseDto,
  UnsubSheet,
} from "@epc-services/interface-adapters";
import { Injectable, Logger, Inject } from "@nestjs/common";
import * as XLSX from "xlsx";
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { Cache } from "cache-manager";

@Injectable()
export class GetPriorityTypesService {
  private readonly logger: Logger = new Logger(GetPriorityTypesService.name, {
    timestamp: true,
  });

  constructor(
    @InjectGDriveApiService()
    private readonly gdriveApiService: GDriveApiServicePort,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache
  ) {}

  public async getPriorityTypes(): Promise<GetPriorityTypesResponseDto> {
    const cacheKey = `organicGetPriorityTypes`;

    const cached = await this.cacheManager.get<GetPriorityTypesResponseDto>(
      cacheKey
    );

    if (cached) return cached;

    try {
      const fileContent = await this.gdriveApiService.getContentLikeBuffer(
        "1dB8SKnQliC8irUOoLBrEVfJxT-ZRnkBuu-iuI0RDtCg",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );
      const workbook = await XLSX.read(fileContent, { type: "buffer" });

      const unsubSheets: UnsubSheet[] = [];

      for (const sheetName of workbook.SheetNames) {
        if (sheetName.toLowerCase() === "fit(agora)") {
          continue;
        }

        if (sheetName.toLowerCase() === "stansberry") {
          continue;
        }

        const worksheet = workbook.Sheets[sheetName];

        const aoa = XLSX.utils.sheet_to_json<any[]>(worksheet, { header: 1 });

        if (aoa.length === 0) continue;

        for (let rowIdx = 0; rowIdx < aoa.length; rowIdx++) {
          const row = aoa[rowIdx] as any[];

          if (!Array.isArray(row)) continue;

          let unsubTextColIdx = -1;
          for (let colIdx = 0; colIdx < row.length; colIdx++) {
            const cell = row[colIdx];
            if (
              cell &&
              typeof cell === "string" &&
              cell.trim().toLowerCase() === "footer"
            ) {
              unsubTextColIdx = colIdx;
              break;
            }
            
          }

          if (unsubTextColIdx !== -1) {
            const unsubTypes: string[] = [];

            for (
              let colIdx = unsubTextColIdx + 1;
              colIdx < row.length;
              colIdx++
            ) {
              const header = row[colIdx];
              if (
                header &&
                typeof header === "string" &&
                header.trim() !== ""
              ) {
                unsubTypes.push(header.toString().trim());
              }
            }

            if (unsubTypes.length > 0) {
              unsubSheets.push({
                sheetName,
                unsubTypes,
              });
            }

            break;
          }
        }
      }

      await this.cacheManager.set(cacheKey, { sheets: unsubSheets }, 900000);
      return {
        sheets: unsubSheets,
      };
    } catch (error) {
      this.logger.error("Error getting priority types", error);
      return {
        sheets: [],
      };
    }
  }
}
