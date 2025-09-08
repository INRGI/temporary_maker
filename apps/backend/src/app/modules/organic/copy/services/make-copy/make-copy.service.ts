import {
  MakeCopyResponseDto,
  UnsubData,
} from "@epc-services/interface-adapters";
import { Injectable, Logger } from "@nestjs/common";
import { GetSubjectService } from "../get-subject/get-subject.service";
import { GetCopyFromDriveService } from "../get-copy-from-drive/get-copy-from-drive.service";
import { ApplyChangesOnCopyService } from "../apply-changes-on-copy/apply-changes-on-copy.service";
import { BuildLinkService } from "../build-link/build-link.service";
import { MakeCopyPayload } from "./make-copy.payload";
import { AntiSpamService } from "../../../../finances/copy-parser/services/anti-spam/anti-spam.service";
import { GetImageLinksService } from "../../../../finances/copy-parser/services/get-image-links/get-image-links.service";
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
    private readonly getPriorityService: GetPriorityService,
    private readonly getSubjectService: GetSubjectService,
    private readonly antiSpamService: AntiSpamService,
    private readonly getImageLinks: GetImageLinksService,
    private readonly htmlFormatterService: HtmlFormatterService
  ) {}

  public async makeCopyWithData(
    payload: MakeCopyPayload
  ): Promise<MakeCopyResponseDto> {
    let link: string;
    let subjects: string[];
    let unsubData: UnsubData;
    const { copyName, preset, sendingDate, mondayProductsData } = payload;

    const nameMatch = copyName.match(/^[a-zA-Z]+/);
    const product = nameMatch ? nameMatch[0] : "";

    const liftMatch = copyName.match(/[a-zA-Z]+(\d+)/);
    const productLift = liftMatch ? liftMatch[1] : "";

    const imageMatch = copyName.match(/\d+([a-zA-Z].*)/);
    const productImage = imageMatch ? imageMatch[1] : "";

    if (!product || !productLift) {
      return {
        copyName,
        html: "",
        sendingDate,
        unsubData,
        subjects,
        imageLinks: [],
        buildedLink: "insertlink",
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
        sendingDate,
        unsubData,
        subjects,
        imageLinks: [],
        buildedLink: "insertlink",
      };
    }

    if (presetProps.copyWhatToReplace?.isLinkUrl) {
      link = await this.buildLinkService.buildLinkWithDataProvided({
        product,
        productLift,
        productImage,
        linkUrl: presetProps.linkUrl,
        mondayProductsData,
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
      sendingDate,
      unsubData,
      subjects,
      imageLinks: links,
      buildedLink: link || "insertlink",
    };
  }

  public async makeCopy(
    payload: MakeCopyPayload
  ): Promise<MakeCopyResponseDto> {
    let link: string;
    let subjects: string[];
    let unsubData: UnsubData;
    const { copyName, preset, sendingDate } = payload;

    const nameMatch = copyName.match(/^[a-zA-Z]+/);
    const product = nameMatch ? nameMatch[0] : "";

    const liftMatch = copyName.match(/[a-zA-Z]+(\d+)/);
    const productLift = liftMatch ? liftMatch[1] : "";

    const imageMatch = copyName.match(/\d+([a-zA-Z].*)/);
    const productImage = imageMatch ? imageMatch[1] : "";

    if (!product || !productLift) {
      return {
        copyName,
        html: "",
        sendingDate,
        unsubData,
        subjects,
        imageLinks: [],
        buildedLink: "insertlink",
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
        sendingDate,
        unsubData,
        subjects,
        imageLinks: [],
        buildedLink: "insertlink",
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
      sendingDate,
      unsubData,
      subjects,
      imageLinks: links,
      buildedLink: link || "insertlink",
    };
  }
}
