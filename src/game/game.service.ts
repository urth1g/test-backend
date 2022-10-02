import { IGame } from '../../interface/IGame';
import { Injectable } from '@nestjs/common';

enum Rewards {
  C = 10,
  L = 20,
  O = 30,
  W = 40,
}

@Injectable()
export class GameService implements IGame {
  reSpinChance: number;
  possibleSymbols: string[];
  constructor(reSpinChance: number, possibleSymbols: string[]) {
    this.reSpinChance = reSpinChance;
    this.possibleSymbols = possibleSymbols;
  }

  spin(): string[] {
    const symbols = [];

    for (let i = 0; i < 3; i++) {
      symbols.push(
        this.possibleSymbols[
          Math.floor(Math.random() * this.possibleSymbols.length)
        ],
      );
    }

    const didUserWin = this.userWon(symbols);

    if (!didUserWin) return symbols;

    const shouldRespin =
      Math.floor(Math.random() * 101) / 100 < this.reSpinChance;
    this.disableReSpin();
    return shouldRespin ? this.spin() : symbols;
  }

  userWon(symbols: string[]): boolean {
    return symbols[0] === symbols[1] && symbols[1] === symbols[2];
  }

  calculateReward(symbols: string[]): number {
    if (!this.userWon(symbols)) return -1;

    switch (symbols[0]) {
      case 'C':
        return Rewards.C;
      case 'L':
        return Rewards.L;
      case 'O':
        return Rewards.O;
      case 'W':
        return Rewards.W;
      default:
        return 0;
    }
  }

  calculateReSpinChance(sessionCredits: number): void {
    if (sessionCredits < 40) {
      this.reSpinChance = 0;
    } else if (sessionCredits >= 40 && sessionCredits <= 60) {
      this.reSpinChance = 0.3;
    } else if (sessionCredits > 60) {
      this.reSpinChance = 0.6;
    }
  }

  disableReSpin(): void {
    this.reSpinChance = 0;
  }
}
