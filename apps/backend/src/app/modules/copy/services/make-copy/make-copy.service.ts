import {
  MakeCopyResponseDto,
  UnsubData,
} from '@epc-services/interface-adapters';
import { Injectable, Logger } from '@nestjs/common';
import { GetSubjectService } from '../get-subject/get-subject.service';
import { GetCopyFromDriveService } from '../get-copy-from-drive/get-copy-from-drive.service';
import { ApplyChangesOnCopyService } from '../apply-changes-on-copy/apply-changes-on-copy.service';
import { BuildLinkService } from '../build-link/build-link.service';
import { GetPriorityService } from '../../../priority-products/services/get-priority/get-priority.service';
import { AntiSpamService } from '../../../copy-parser/services/anti-spam/anti-spam.service';
import { GetImageLinksService } from '../../../copy-parser/services/get-image-links/get-image-links.service';
import { MakeCopyPayload } from './make-copy.payload';

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
  ) {}

  public async makeCopy(
    payload: MakeCopyPayload
  ): Promise<MakeCopyResponseDto> {
    let link: string;
    let subjects: string;
    let unsubData: UnsubData;
    const { copyName, preset } = payload;

    const product = copyName.match(/^[a-zA-Z]+/)[0];
    const productLift = copyName.match(/[a-zA-Z]+(\d+)/)
      ? copyName.match(/[a-zA-Z]+(\d+)/)[1]
      : '';
    const productImage = copyName.match(/\d+([a-zA-Z].*)/)
      ? copyName.match(/\d+([a-zA-Z].*)/)[1]
      : '';


    const presetProps = preset;

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
      if (presetProps.subjectLine.subjectLine === 'Spam Words Only')
        subjects = await this.antiSpamService.changeSpamWords({
          html: subjects,
        });
      if (presetProps.subjectLine.subjectLine === 'Full Anti Spam')
        subjects = await this.antiSpamService.changeAllWords({
          html: subjects,
        });
    }

    const html = await this.getCopyFromDriveService.getCopyFromDrive({
      product,
      productLift,
    });

    const updatedHtml = await this.applyChangesOnCopyService.applyChangesOnCopy(
      {
        html,
        presetProps,
        linkUrl: link,
      }
    );

    const links = await this.getImageLinks.getLinks({
      html: updatedHtml,
    });

    return {
      copyName,
      html: updatedHtml,
      unsubData,
      subjects,
      imageLinks: links,
      buildedLink: link || 'urlhere',
    };
  }
}
