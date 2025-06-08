import { Provider } from '@nestjs/common';
import { CopyMessageController } from './controllers/copy.message.controller';
import { MakeCopyService } from './services/make-copy/make-copy.service';
import { MakeMultipleCopiesService } from './services/make-multiple-copies/make-multiple-copies.service';
import { BuildLinkService } from './services/build-link/build-link.service';
import { ApplyChangesOnCopyService } from './services/apply-changes-on-copy/apply-changes-on-copy.service';
import { GetMondayDataService } from './services/get-monday-data/get-monday-data.service';
import { GetCopyFromDriveService } from './services/get-copy-from-drive/get-copy-from-drive.service';
import { ChangeBgColorService } from '../../finances/copy-parser/services/change-bg-color/change-bg-color.service';
import { ChangeFontFamilyService } from '../../finances/copy-parser/services/change-font-family/change-font-family.service';
import { ChangeFontSizeService } from '../../finances/copy-parser/services/change-font-size/change-font-size.service';
import { ChangeLineHeightService } from '../../finances/copy-parser/services/change-line-height/change-line-height.service';
import { ChangeLinkColorService } from '../../finances/copy-parser/services/change-link-color/change-link-color.service';
import { ChangeMaxWidthService } from '../../finances/copy-parser/services/change-max-width/change-max-width.service';
import { ChangePaddingService } from '../../finances/copy-parser/services/change-padding/change-padding.service';
import { ChangeUrlLinkService } from '../../finances/copy-parser/services/change-url-link/change-url-link.service';
import { GetMondayTrackingsService } from './services/get-monday-trackings/get-monday-trackings.service';
import { GetSubjectService } from './services/get-subject/get-subject.service';
import { HtmlFormatterService } from '../../finances/copy-parser/services/html-formatter/html-formatter.service';
import { GetAllCopiesForProductService } from './services/get-all-copies-for-product/get-all-copies-for-product.service';
import { SpaceAdBuildLinkService } from './services/space-ad-build-link/space-ad-build-link.service';

export const messageControllers = [CopyMessageController];

export const applicationProviders: Provider[] = [];

export const serviceProviders: Provider[] = [
  MakeCopyService,
  MakeMultipleCopiesService,
  BuildLinkService,
  ApplyChangesOnCopyService,
  GetMondayDataService,
  GetCopyFromDriveService,
  ChangeBgColorService,
  ChangeFontFamilyService,
  ChangeFontSizeService,
  ChangeLineHeightService,
  ChangeLinkColorService,
  ChangeMaxWidthService,
  ChangePaddingService,
  ChangeUrlLinkService,
  GetMondayTrackingsService,
  GetSubjectService,
  HtmlFormatterService,
  GetAllCopiesForProductService,
  SpaceAdBuildLinkService,
];
