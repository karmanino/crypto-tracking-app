import { LiveAnnouncer } from '@angular/cdk/a11y';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, Input, ViewChild } from '@angular/core';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { interval, startWith, Subscription, switchMap } from 'rxjs';
import { APIResponse } from 'src/app/interfaces/api-response.interface';
import { TradingPairsService } from 'src/app/services/tradingPairs.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-pair-info',
  templateUrl: './pair-info.component.html',
  styleUrls: ['./pair-info.component.scss'],
})
export class PairInfoComponent {
  displayedColumns: string[] = ['position', 'price', 'amount', 'methods'];
  _ticker: string = 'COP';
  response!: APIResponse;
  ads: any = [];
  subs: Subscription[] = [];
  empty = false;
  dataSource = new MatTableDataSource();
  params = JSON.parse(
    `{"page":1,"rows":20,"publisherType":null,"fiat":"${this._ticker}","tradeType":"BUY","asset":"USDT","merchantCheck":false}`
  );
  refreshInfo = interval(60000).pipe(
    startWith(0),
    switchMap(() =>
      this.http.post<APIResponse>(
        environment.endpoint + '/api/p2p',
        JSON.stringify(this.params),
        {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
          }),
        }
      )
    )
  );
  showAlarmsCard = false;

  @Input() set pair(value: string) {
    this.showAlarmsCard = false;
    this.empty = false;
    this.response = new Response();
    this._ticker = value;
    this.params = JSON.parse(
      `{"page":1,"rows":20,"publisherType":null,"fiat":"${this._ticker}","tradeType":"BUY","asset":"USDT","merchantCheck":false}`
    );
    this.subs.forEach((sub) => sub.unsubscribe());
    const newSub = this.refreshInfo.subscribe((res: APIResponse) => {
      this.ads = [];
      this.empty = false;
      this.response = res;
      const propertyNames = Object.keys(res);
      propertyNames.forEach((val) => {
        if (val.length <= 2) {
          this.ads.push([
            Number.parseInt(val),
            Number.parseFloat(this.response[val].price),
            Number.parseFloat(this.response[val].amount),
            Object.entries(this.response[val].paymentMethods),
          ]);
        }
        this.dataSource = new MatTableDataSource(this.ads);
      });
    });
    this.subs.push(newSub);
  }

  get pair(): string {
    return this._ticker;
  }

  constructor(
    private http: HttpClient,
    private tradingPairsSvc: TradingPairsService,
    private _liveAnnouncer: LiveAnnouncer
  ) {}

  @ViewChild(MatSort) sort: MatSort = new MatSort();

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  /** Announce the change in sort state for assistive technology. */
  announceSortChange(sortState: Sort) {
    // This example uses English messages. If your application supports
    // multiple language, you would internationalize these strings.
    // Furthermore, you can customize the message to add additional
    // details about the values being sorted.
    if (sortState.direction) {
      console.log('alla se estan acomodando');
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      console.log('sin coso');
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

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
    this.response = new Response();
    this.empty = true;
    this.subs.forEach((sub) => sub.unsubscribe());
  }
}
