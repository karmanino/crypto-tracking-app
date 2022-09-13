import { Injectable, OnInit } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class TradingPairsService implements OnInit {
  tradingPairs: string[] = [];
  p2pTradingPairs: string[] = [];
  tradingPairsOnLocalStorage = localStorage.getItem('tradingPairs');
  p2pPairsOnLocalStorage = localStorage.getItem('P2PPairs');
  pairsUpdate: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([]);
  p2pPairsUpdate: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([]);

  constructor(private _snackBar: MatSnackBar) {
    if (this.tradingPairsOnLocalStorage === null) {
      localStorage.setItem('tradingPairs', 'BTCUSDT');
      this.tradingPairs.push('BTCUSDT');
    } else {
      this.tradingPairs = this.tradingPairsOnLocalStorage.split(',');
    }

    if (this.p2pPairsOnLocalStorage === null) {
      localStorage.setItem('P2PPairs', 'ARS,COP,BRL,BOB,PEN,URY,CLP,VEN,MXN');
      this.p2pTradingPairs.push('ARS','COP','BRL','BOB','PEN','URY','CLP','VEN','MXN');
    } else {
      this.p2pTradingPairs = this.p2pPairsOnLocalStorage.split(',');
    }

    this.pairsUpdate.next(this.tradingPairs);
    this.p2pPairsUpdate.next(this.p2pTradingPairs);
  }
  ngOnInit(): void {}

  updatePairs(pair: string, insert: boolean, P2P?: boolean): void {
    if (pair) {
      if (!P2P) {
        this.tradingPairs = this.tradingPairs.filter((tp) => tp !== pair);
        if (insert) this.tradingPairs.push(pair);
        let snackMessage = insert
          ? 'Pair successfully added'
          : 'Pair successfully removed';
        this._snackBar.open(snackMessage, 'Close', {
          panelClass: 'darkSnack',
          duration: 2000,
        });
        localStorage.setItem('tradingPairs', this.tradingPairs.toString());
        this.pairsUpdate.next(this.tradingPairs);
      } else {
        this.p2pTradingPairs = this.p2pTradingPairs.filter((tp) => tp !== pair);
        if (insert) this.p2pTradingPairs.push(pair);
        let snackMessage = insert
          ? 'P2P Currency successfully added'
          : 'P2P Currency removed';
        this._snackBar.open(snackMessage, 'Close', {
          panelClass: 'darkSnack',
          duration: 2000,
        });
        localStorage.setItem('P2PPairs', this.p2pTradingPairs.toString());
        this.p2pPairsUpdate.next(this.p2pTradingPairs);
      }
    }
  }
}
