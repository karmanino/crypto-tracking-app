import { Component, OnInit} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TradingPairsService } from 'src/app/services/tradingPairs.service';
import { AddTradingPairModalComponent } from '../add-trading-pair-modal/add-trading-pair-modal.component';

@Component({
  selector: 'app-p2p',
  templateUrl: './p2p.component.html',
  styleUrls: ['./p2p.component.scss'],
})
export class P2PComponent implements OnInit {

   ultimoPrecio: Response | any  = {};
   p2pTradingPairs: string[] = [];
   
   ticker: string = 'ARS';

  constructor(private tradingPairsSvc: TradingPairsService,
    public dialog: MatDialog) {

    // let ws: WebSocket = new WebSocket(
    //   'wss://stream.binance.com:9443/ws/btcusdt@trade/ethusdt@trade'
    // );

    // ws.onmessage = (response) => {
    //     let data: Response = JSON.parse(response.data);
    //     this.ultimoPrecio = data;
    //     console.log(data.p);
    // }
  }
  
  ngOnInit(): void {
    this.tradingPairsSvc.p2pPairsUpdate.subscribe(pairs => this.p2pTradingPairs = pairs);
  }

  changeTicker(ticker: string){
      this.ticker = ticker;
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(AddTradingPairModalComponent, {
      width: '250px',
      data: {ticker: this.ticker},
    });

    dialogRef.afterClosed().subscribe(result => {
      this.tradingPairsSvc.updatePairs(result, true, true);
    });
  }

}
