import { Controller, Get, Post, Req, Body } from '@nestjs/common';
import { AppService } from './app.service';
import type { Request } from 'express';
import LoginDTO from '../dto/body';
import { UsersService } from './users/users.service';
import { User } from './users/user.entity';
import SuccessDTO from 'dto/success';
import ErrorDTO from 'dto/error';
import SpinDTO from 'dto/spin';
import { GameService } from './game/game.service';

@Controller()
export class AppController {
  constructor(
    private readonly usersService: UsersService,
    private readonly gamesService: GameService,
  ) {}

  @Post('/login')
  async establishSession(
    @Req() request: Request,
    @Body() body: LoginDTO,
  ): Promise<ErrorDTO | SuccessDTO> {
    if (request.session.data?.user)
      return {
        error: true,
        message: 'Session already established',
      } as ErrorDTO;

    const user = await this.usersService.checkCredentialsAndReturnAnUser(body);

    return this.usersService.setSession(user, request);
  }

  @Get('/get-user-from-session')
  getUserFromSession(@Req() request: Request): User {
    return request.session.data?.user || ({} as User);
  }

  @Post('/spin')
  async spin(@Req() request: Request): Promise<SpinDTO> {
    const user: User = request.session.data?.user;

    if (!user) {
      throw new Error('User not found');
    }

    this.gamesService.calculateReSpinChance(user.creditsSession);

    const spin: string[] = this.gamesService.spin();
    const reward = this.gamesService.calculateReward(spin);

    user.creditsSession += reward;

    return { newState: spin, credits: user.creditsSession };
  }

  @Post('/cash-out')
  async cashOut(@Req() request: Request): Promise<User> {
    const user: User = request.session.data?.user;

    if (!user) {
      throw new Error('User not found');
    }

    let user_ = await this.usersService.updateCredits(user);

    request.session.destroy(() => {
      console.log('Session destroyed');
    });

    return user_;
  }

}
