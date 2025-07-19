import { Injectable } from "@nestjs/common";
import { CheckIfCopyCanBeTestedPayload } from "./check-if-copy-can-be-tested.payload";
import { GetCopyClicksService } from "../../../bigQuery/services/get-copy-clicks/get-copy-clicks.service";

@Injectable()
export class CheckIfCopyCanBeTestedService {
  constructor(private readonly getCopyClicksService: GetCopyClicksService) {}

  public async execute(
    payload: CheckIfCopyCanBeTestedPayload
  ): Promise<boolean> {
    const { copyName, maxClicksToBeTestCopy } = payload;

    const cleanedTargetName = this.cleanCopyName(copyName);

    const { data } = await this.getCopyClicksService.execute({
      copyName: cleanedTargetName,
    });

    const totalClicks = data.reduce((acc, row) => {
      return this.cleanCopyName(row.Copy) === cleanedTargetName
        ? acc + row.UC
        : acc;
    }, 0);

    return totalClicks < maxClicksToBeTestCopy;
  }

  private cleanCopyName(copyName: string): string {
    const nameMatch = copyName.match(/^[a-zA-Z]+/);
    const product = nameMatch ? nameMatch[0] : "";
    const liftMatch = copyName.match(/[a-zA-Z]+(\\d+)/);
    const productLift = liftMatch ? liftMatch[1] : "";
    return `${product}${productLift}`;
  }
}
