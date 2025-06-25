import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { OAuth2Client } from 'google-auth-library';
import { UserService } from '../services/user.service';

const client = new OAuth2Client(process.env.AUTH_GOOGLE_CLIENT_ID);

@Controller('finances/broadcast-tool/auth')
export class AuthController {
  constructor(private readonly userService: UserService) {}

  @Post('google')
  async loginWithGoogle(@Body('id_token') idToken: string) {
    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.AUTH_GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    if (!payload?.email || !payload.email.endsWith('@epcnetwork.io')) {
      throw new UnauthorizedException('Not an authorized domain');
    }

    const user = await this.userService.createOrUpdate({
      email: payload.email,
      name: payload.name || '',
      lastLogin: new Date(),
    });

    return { user };
  }
}
