import { Module } from '@nestjs/common';
import { GameService } from './game.service';

@Module({
  providers: [
    {
      provide: GameService,
      useValue: new GameService(0, ['C', 'L', 'O', 'W']),
    },
  ],
  exports: [GameService],
})
export class GameModule {}
