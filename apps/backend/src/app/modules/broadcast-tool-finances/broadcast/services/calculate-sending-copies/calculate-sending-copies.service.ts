import { Injectable } from '@nestjs/common';
import { CalculateSendingCopiesPayload } from './calculate-sending-copies.payload';

@Injectable()
export class CalculateSendingCopiesService {
  public async execute(
    payload: CalculateSendingCopiesPayload
  ): Promise<number> {
    const { broadcastCopies } = payload;

    const lastSendingDateWithCopies = broadcastCopies
      .filter((day) => day.copies.length > 0)
      .reduce((prev, current) => (prev && new Date(prev.date) > new Date(current.date) ? prev : current), null);

    if (!lastSendingDateWithCopies) {
      return 0;
    }

    const copiesCount = lastSendingDateWithCopies.copies.length;

    return copiesCount;
  }
}
