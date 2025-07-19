import { Injectable } from "@nestjs/common";
import { CheckIfCopyBlacklistedPayload } from "./check-if-copy-blacklisted.payload";

@Injectable()
export class CheckIfCopyBlacklistedService {
  private cache: Map<string, Set<string>> = new Map();

  public async execute(
    payload: CheckIfCopyBlacklistedPayload
  ): Promise<boolean> {
    const { copyName, blacklistedCopies } = payload;
    const cleaned = this.cleanCopyName(copyName);

    const hash = blacklistedCopies.join("|");
    if (!this.cache.has(hash)) {
      this.cache.set(hash, new Set(blacklistedCopies));
    }

    const blacklistedSet = this.cache.get(hash);
    return blacklistedSet.has(cleaned);
  }

  private cleanCopyName(copyName: string): string {
    const nameMatch = copyName.match(/^[a-zA-Z]+/);
    const product = nameMatch ? nameMatch[0] : "";
    const liftMatch = copyName.match(/[a-zA-Z]+(\\d+)/);
    const productLift = liftMatch ? liftMatch[1] : "";
    return `${product}${productLift}`;
  }
}
