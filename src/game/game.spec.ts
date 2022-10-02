import { Test, TestingModule } from '@nestjs/testing';
import { GameService } from './game.service';
import { User } from '../users/user.entity';

describe('GameService', () => {
  let gameService: GameService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: GameService,
          useValue: new GameService(0, ['C', 'L', 'O', 'W']),
        },
      ],
    }).compile();

    gameService = app.get<GameService>(GameService);
  });

  describe('Check if the respin chance is being properly set', () => {
    it('Should pass if the respin chance is 0%', () => {
      const user = new User();
      user.creditsSession = 0;
      gameService.calculateReSpinChance(user.creditsSession);
      expect(gameService.reSpinChance).toBe(0);
    });

    it('Should pass if the respin chance is 30%', () => {
      const user = new User();
      user.creditsSession = 40;
      gameService.calculateReSpinChance(user.creditsSession);
      expect(gameService.reSpinChance).toBe(0.3);
      user.creditsSession = 60;
      gameService.calculateReSpinChance(user.creditsSession);
      expect(gameService.reSpinChance).toBe(0.3);
    });

    it('Should pass if the respin chance is 60%', () => {
      const user = new User();
      user.creditsSession = 500;
      gameService.calculateReSpinChance(user.creditsSession);
      expect(gameService.reSpinChance).toBe(0.6);
    });
  })

  describe("Check if spin function is being called multiple times based on re spin chance", () => {
    it("Should pass if spin function is being called once", () => {
      const user = new User();
      user.creditsSession = 0;
      gameService.calculateReSpinChance(user.creditsSession);
      const spy = jest.spyOn(gameService, 'spin');
      gameService.spin();
      expect(spy).toHaveBeenCalledTimes(1);
    })

    it("Should pass if spin function is being called twice", () => {
      gameService.reSpinChance = 1;
      const spy = jest.spyOn(gameService, 'spin');
      gameService.spin();
      expect(spy).toHaveBeenCalledTimes(2);
    })
  })

  describe('House is winning in the long run:', () => {
    it('User credits are decreasing - !!! REPORT TO THE CLIENT !!!', () => {
      const user = new User();
      user.creditsSession = 10;
      let userWins = 0;
      let houseWins = 0;

      for (let i = 0; i < 1000; i++) {
        gameService.calculateReSpinChance(user.creditsSession);

        const spin = gameService.spin();

        gameService.userWon(spin) ? userWins++ : houseWins++;

        user.creditsSession += gameService.calculateReward(spin);
      }

      console.log(houseWins);
      console.log(userWins);
      expect(houseWins).toBeGreaterThan(userWins);
      //expect(user.creditsSession).toBeLessThan(0);
    });
  });


});
