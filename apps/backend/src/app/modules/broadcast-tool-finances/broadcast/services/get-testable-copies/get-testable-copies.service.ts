import { Injectable } from '@nestjs/common';
import { GetTestableCopiesPayload } from './get-testable-copies.payload';
import { GetCopiesForTestService } from '../../../bigQuery/services/get-copies-for-test/get-copies-for-test.service';

@Injectable()
export class GetTestableCopiesService {
  constructor(
    private readonly getCopiesForTestService: GetCopiesForTestService
  ) {}

  public async execute(payload: GetTestableCopiesPayload): Promise<string[]> {
    const { daysBeforeInterval } = payload;

    const convertableCopies = await this.getCopiesForTestService.execute({
      daysBefore: daysBeforeInterval,
    });

    const filteredTestableCopies = convertableCopies.data.filter((copy) => {
      return (
        !copy.Copy.includes('_SA') &&
        !isNaN(Number(this.extractLift(copy.Copy))) &&
        this.extractLift(copy.Copy) !== '00'
      );
    });

    return filteredTestableCopies.map((copy) => copy.Copy);
  }

  private extractLift(copyName: string): string {
    const liftMatch = copyName.match(/[a-zA-Z]+(\d+)/);
    const productLift = liftMatch ? liftMatch[1] : '';
    return productLift;
  }
}
