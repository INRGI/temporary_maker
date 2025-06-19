import { registerAs } from '@nestjs/config';

export default registerAs('monday', () => ({
  accessToken: process.env.MONDAY_ACCESS_TOKEN,
  productsBoardId: process.env.MONDAY_PRODUCTS_BOARD_ID,
  domainsBoardId: process.env.MONDAY_DOMAINS_BOARD_ID,
}));
