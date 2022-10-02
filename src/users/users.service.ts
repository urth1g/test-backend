import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import type { Request } from 'express';
import SuccessDTO from 'dto/success';
import ErrorDTO from 'dto/error';
import LoginDTO from '../../dto/body';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  async findByUsername(username: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { username: username } });
  }

  async checkCredentialsAndReturnAnUser(body: LoginDTO): Promise<User> {
    const user = await this.findByUsername(body.username);
    const startingCredits = 10;

    if (user) {
      if (user.password == body.password) {
        return {
          id: user.id,
          username: user.username,
          credits: user.credits,
          creditsSession: startingCredits,
        } as User;
      }
    }
    return {} as User;
  }

  async updateCredits(user: User): Promise<User> {
    let user_ = await this.findByUsername(user.username);

    if(!user_){
      throw new Error("Unable to update credits");
    }

    user.credits += user.creditsSession;
    return this.usersRepository.save(user);
  }

  setSession(user: User, request: Request): ErrorDTO | SuccessDTO {
    if (!user.hasOwnProperty('id'))
      return { error: true, message: 'Invalid credentials' } as ErrorDTO;

    request.session.data = {
      user,
    };

    return { error: false, message: 'Session established' } as SuccessDTO;
  }
}

