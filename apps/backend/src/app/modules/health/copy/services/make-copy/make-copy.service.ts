import { HealthMakeCopyResponseDto, HealthUnsubData } from "@epc-services/interface-adapters";
import { Injectable, Logger } from "@nestjs/common";
import { GetSubjectService } from "../get-subject/get-subject.service";
import { GetCopyFromDriveService } from "../get-copy-from-drive/get-copy-from-drive.service";
import { ApplyChangesOnCopyService } from "../apply-changes-on-copy/apply-changes-on-copy.service";
import { BuildLinkService } from "../build-link/build-link.service";
import { AntiSpamService } from "../../../../finances/copy-parser/services/anti-spam/anti-spam.service";
import { GetImageLinksService } from "../../../../finances/copy-parser/services/get-image-links/get-image-links.service";
import { MakeCopyPayload } from "./make-copy.payload";
import { HtmlFormatterService } from "../../../../finances/copy-parser/services/html-formatter/html-formatter.service";
import { GetPriorityService } from "../../../priority-products/services/get-priority/get-priority.service";

@Injectable()
export class MakeCopyService {
  private readonly logger: Logger = new Logger(MakeCopyService.name, {
    timestamp: true,
  });

  constructor(
    private readonly getCopyFromDriveService: GetCopyFromDriveService,
    private readonly applyChangesOnCopyService: ApplyChangesOnCopyService,
    private readonly buildLinkService: BuildLinkService,
    private readonly getSubjectService: GetSubjectService,
    private readonly antiSpamService: AntiSpamService,
    private readonly getImageLinks: GetImageLinksService,
    private readonly htmlFormatterService: HtmlFormatterService,
    private readonly getPriorityService: GetPriorityService,
  ) {}

  public async makeCopy(
    payload: MakeCopyPayload
  ): Promise<HealthMakeCopyResponseDto> {
    let link: string;
    let subjects: string[];
    let unsubData: HealthUnsubData;

    const { copyName, preset, sendingDate } = payload;

    const match = copyName.match(/^([a-zA-Z]+)(\d+)?_?(\d+)?$/);

    const product = match?.[1] || "";
    const productLift = match?.[2] || "";
    const productImage = match?.[3] || "";

    if (!product || !productLift) {
      return {
        copyName,
        html: "",
        unsubData,
        subjects,
        sendingDate,
        imageLinks: [],
        buildedLink: "urlhere",
      };
    }

    const presetProps = preset;

    const html = await this.getCopyFromDriveService.getCopyFromDrive({
      product,
      productLift,
      format: presetProps.format,
    });

    if (html.includes("Error reading file")) {
      return {
        copyName,
        html: html,
        unsubData,
        sendingDate,
        subjects,
        imageLinks: [],
        buildedLink: "urlhere",
      };
    }

    if (presetProps.copyWhatToReplace?.isLinkUrl) {
      link = await this.buildLinkService.buildLink({
        product,
        productLift,
        productImage,
        linkUrl: presetProps.linkUrl,
      });
    }

    if (presetProps.copyWhatToReplace?.isUnsubLink) {
      unsubData = await this.getPriorityService.getPriorityDetails({
        product,
        unsubLinkUrl: presetProps.unsubLinkUrl,
      });
    }

    if (presetProps.subjectLine && presetProps.subjectLine?.isSubjectLine) {
      subjects = await this.getSubjectService.getSubject({
        product,
        productLift,
      });
      if (presetProps.subjectLine.subjectLine === "Spam Words Only") {
        for (let i = 0; i < subjects.length; i++) {
          subjects[i] = await this.antiSpamService.changeSpamWords({
            html: subjects[i],
          });
          subjects[i] = await this.antiSpamService.optimizeSubject({
            html: subjects[i],
          });
        }
      }

      if (presetProps.subjectLine.subjectLine === "Full Anti Spam") {
        for (let i = 0; i < subjects.length; i++) {
          subjects[i] = await this.antiSpamService.changeAllWords({
            html: subjects[i],
          });
          subjects[i] = await this.antiSpamService.optimizeSubject({
            html: subjects[i],
          });
        }
      }
    }

    const updatedHtml = await this.applyChangesOnCopyService.applyChangesOnCopy(
      {
        html,
        presetProps,
        linkUrl: link,
      }
    );

    const formattedHtml = await this.htmlFormatterService.formatHtml({
      html: updatedHtml,
    });

    const links = await this.getImageLinks.getLinks({
      html: updatedHtml,
    });

    return {
      copyName,
      html: formattedHtml,
      subjects,
      unsubData,
      sendingDate,
      imageLinks: links,
      buildedLink: link || "urlhere",
    };
  }
}
