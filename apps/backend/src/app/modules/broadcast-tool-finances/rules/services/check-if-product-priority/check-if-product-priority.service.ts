import { Injectable } from "@nestjs/common";
import { CheckIfProductPriorityPayload } from "./check-if-product-priority.payload";

@Injectable()
export class CheckIfProductPriorityService {
  public async execute(
    payload: CheckIfProductPriorityPayload
  ): Promise<boolean> {
    const { product, priorityCopiesData } = payload;

    if (priorityCopiesData.includes(product)) {
      return true;
    }

    return false;
  }
}
