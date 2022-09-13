import { NgModule } from "@angular/core";
import { RemoveUSDTPipe } from "../pipes/removeUSDT.pipe";
import { SharedModule } from "../shared/shared.module";
import { AddTradingPairModalComponent } from "./add-trading-pair-modal/add-trading-pair-modal.component";
import { AlarmsCardComponent } from "./alarms-card/alarms-card.component";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { P2PComponent } from "./p2p/p2p.component";
import { TickerInfoComponent } from './ticker-info/ticker-info.component';
import { PairInfoComponent } from './pair-info/pair-info.component';

@NgModule({
  declarations: [
    DashboardComponent,
    TickerInfoComponent,
    AddTradingPairModalComponent,
    RemoveUSDTPipe,
    AlarmsCardComponent,
    P2PComponent,
    PairInfoComponent,
  ],
  exports: [DashboardComponent],
  imports: [SharedModule],
})
export class ComponentsModule {}