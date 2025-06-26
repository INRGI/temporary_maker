import { Injectable } from "@nestjs/common";
import { MakeBroadcaastPayload } from "./make-broadcast.payload";
import { GetAllDomainsResponseDto } from "@epc-services/interface-adapters";
import { GetBroadcastRulesByIdQueryService } from "../../../rules/queries/get-broadcast-rules-by-id/get-broadcast-rules-by-id.query-service";
import { GetAllDomainsService } from "../get-all-domains/get-all-domains.service";
import { GetClickableCopiesService } from "../get-clickable-copies/get-clickable-copies.service";
import { GetConvertableCopiesService } from "../get-convertable-copies/get-convertable-copies.service";
import { GetWarmupCopiesService } from "../get-warmup-copies/get-warmup-copies.service";
import { GetTestableCopiesService } from "../get-testable-copies/get-testable-copies.service";
import { BroadcastAssignerService } from "../broadcast-assigner/broadcast-assigner.service";
import { GetAllDomainsDataService } from "../../../monday/services/get-all-domains-data/get-all-domains-data.service";
import { GetAllProductsDataService } from "../../../monday/services/get-all-products-data/get-all-products-data.service";
import { GetDomainsRevenueService } from "../../../bigQuery/services/get-domains-revenue/get-domains-revenue.service";
import { GetAllPriorityProductsService } from "../../../priority/services/get-all-priority-products/get-all-priority-products.service";
import { AddPriorityCopyIndicatorService } from "../add-priority-copy-indicator/add-priority-copy-indicator.service";

@Injectable()
export class MakeBroadcastService {
  constructor(
    private readonly getBroadcastRulesByIdQueryService: GetBroadcastRulesByIdQueryService,
    private readonly getBroadcastService: GetAllDomainsService,
    private readonly getClickableCopiesService: GetClickableCopiesService,
    private readonly getConvertableCopiesService: GetConvertableCopiesService,
    private readonly getWarmupCopiesService: GetWarmupCopiesService,
    private readonly getTestableCopiesService: GetTestableCopiesService,
    private readonly broadcastAssignerService: BroadcastAssignerService,
    private readonly getAllMondayDomainsDataService: GetAllDomainsDataService,
    private readonly getAllMondayProductsDataService: GetAllProductsDataService,
    private readonly getDomainsRevenueService: GetDomainsRevenueService,
    private readonly getAllPriorityProductsService: GetAllPriorityProductsService,
    private readonly addPriorityCopyIndicatorService: AddPriorityCopyIndicatorService
  ) {}
  public async execute(
    payload: MakeBroadcaastPayload
  ): Promise<GetAllDomainsResponseDto> {
    const { broadcastRuleId, fromDate, toDate } = payload;

    const broadcastRule = await this.getBroadcastRulesByIdQueryService.execute({
      broadcastRulesId: broadcastRuleId,
    });

    const broadcast = await this.getBroadcastService.execute({
      broadcastId: broadcastRule.broadcastSpreadsheetId,
      usageRules: broadcastRule.usageRules,
      fromDate,
    });

    const domainsRevenue = await this.getDomainsRevenueService.execute({
      days: broadcastRule.analyticSelectionRules.domainRevenueDaysInterval,
    });

    const clickableCopies = await this.getClickableCopiesService.execute({
      daysBeforeInterval:
        broadcastRule.analyticSelectionRules.clickableCopiesDaysInterval,
    });

    const convertibleCopies = await this.getConvertableCopiesService.execute({
      daysBeforeInterval:
        broadcastRule.analyticSelectionRules.convertibleCopiesDaysInterval,
    });

    // const testableCopies = await this.getTestableCopiesService.execute({
    //   daysBeforeInterval:
    //     broadcastRule.analyticSelectionRules.testCopiesDaysInterval,
    // });

    const warmupCopies = await this.getWarmupCopiesService.execute({
      daysBeforeInterval:
        broadcastRule.analyticSelectionRules.warmUpCopiesDaysInterval,
    });

    const priorityCopiesData =
      await this.getAllPriorityProductsService.execute();

    const copiesWithoutQueue = broadcastRule.productRules.copyMinLimitPerDay;

    const domainsData = await this.getAllMondayDomainsDataService.execute();

    const productsData = await this.getAllMondayProductsDataService.execute();

    const CLICK_WEIGHT = 1;
    const CONVERSION_WEIGHT = 50;

    const domainPriorityMap = new Map<string, number>();

    domainsRevenue.data.forEach((entry) => {
      const key = this.normalizeDomain(entry.Domain ?? "");
      const clicks = Number(entry.UC ?? 0);
      const conversions = Number(entry.Conversion ?? 0);

      const score = CLICK_WEIGHT * clicks + CONVERSION_WEIGHT * conversions;

      if (key) {
        domainPriorityMap.set(key, score);
      }
    });

    for (const date of this.getDateRange(fromDate, toDate)) {
      for (const sheet of broadcast.sheets) {
        sheet.domains.sort((a, b) => {
          const priorityA =
            domainPriorityMap.get(this.normalizeDomain(a.domain)) ?? 0;
          const priorityB =
            domainPriorityMap.get(this.normalizeDomain(b.domain)) ?? 0;
          return priorityB - priorityA;
        });

        for (let i = 0; i < sheet.domains.length; i++) {
          const updatedDomain = await this.broadcastAssignerService.execute({
            domain: sheet.domains[i],
            broadcastRules: broadcastRule,
            broadcast,
            date,
            clickableCopies,
            convertibleCopies,
            warmupCopies,
            testCopies: [],
            domainsData,
            productsData,
            copiesWithoutQueue,
            priorityCopiesData,
          });

          sheet.domains[i] = updatedDomain;
        }
      }
    }

    const modifiedBroadcast =
      await this.addPriorityCopyIndicatorService.execute({
        broadcast: broadcast,
        dateRange: this.getDateRange(fromDate, toDate),
      });
    return modifiedBroadcast;
  }

  private getDateRange(from: string, to: string): string[] {
    const result: string[] = [];
    const current = new Date(from);
    const end = new Date(to);

    while (current <= end) {
      result.push(current.toISOString().split("T")[0]);
      current.setDate(current.getDate() + 1);
    }

    return result;
  }

  private normalizeDomain(domain: string): string {
    return domain.trim().toLowerCase();
  }
}
