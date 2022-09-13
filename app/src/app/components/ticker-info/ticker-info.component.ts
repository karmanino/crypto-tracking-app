import { HttpClient } from '@angular/common/http';
import { Component, Input } from '@angular/core';
import { interval, startWith, Subscription, switchMap } from 'rxjs';
import { TradingPairsService } from 'src/app/services/tradingPairs.service';

@Component({
  selector: 'app-ticker-info',
  templateUrl: './ticker-info.component.html',
  styleUrls: ['./ticker-info.component.scss'],
})
export class TickerInfoComponent {
  _ticker: string = 'BTCUSDT';
  response: Response | any = {};
  subs: Subscription[] = [];
  empty = false;
  refreshInfo = interval(1500).pipe(
    startWith(0),
    switchMap(() =>
      this.http.get<Response>(
        'https://api.binance.com/api/v3/ticker/24hr?symbol=' + this.ticker
      )
    )
  );
  showAlarmsCard = false;

  @Input() set ticker(value: string) {
    this.showAlarmsCard = false;
    this.empty = false;
    this.response = {};
    this._ticker = value;
    this.subs.forEach((sub) => sub.unsubscribe());
    const newSub = this.refreshInfo.subscribe((res) => {
      this.response = res;
    });
    this.subs.push(newSub);
  }

  get ticker(): string {
    return this._ticker;
  }

  constructor(
    private http: HttpClient,
    private tradingPairsSvc: TradingPairsService,
  ) {}

  deletePair() {
    this.tradingPairsSvc.updatePairs(this._ticker, false);
    this.cleanUp();
  }
  
  ngOnDestroy(): void {
    this.cleanUp();
  }

  toggleAlarmsCard() {
    this.showAlarmsCard = !this.showAlarmsCard;
  }

  cleanUp(): void {
    this.showAlarmsCard = false;
    this.response = {};
    this.empty = true;
    this.subs.forEach((sub) => sub.unsubscribe());
  }
}
