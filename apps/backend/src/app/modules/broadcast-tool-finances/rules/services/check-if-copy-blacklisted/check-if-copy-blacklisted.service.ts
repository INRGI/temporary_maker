import { Injectable } from '@nestjs/common';
import { CheckIfCopyBlacklistedPayload } from './check-if-copy-blacklisted.payload';

@Injectable()
export class CheckIfCopyBlacklistedService {
  public async execute(
    payload: CheckIfCopyBlacklistedPayload
  ): Promise<boolean> {
    const { copyName, blacklistedCopies } = payload;

    if (blacklistedCopies.includes(this.cleanCopyName(copyName))) {
      return true;
    }

    return false;
  }

  private cleanCopyName(copyName: string): string {
    const nameMatch = copyName.match(/^[a-zA-Z]+/);
    const product = nameMatch ? nameMatch[0] : '';
    const liftMatch = copyName.match(/[a-zA-Z]+(\d+)/);
    const productLift = liftMatch ? liftMatch[1] : '';
    return `${product}${productLift}`;
  }
}
