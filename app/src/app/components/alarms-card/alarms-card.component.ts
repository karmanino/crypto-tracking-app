import { Component, Input } from "@angular/core";

@Component({
    selector: 'app-alarms-card',
    templateUrl: 'alarms-card.component.html',
    styleUrls: ['alarms-card.component.scss']
})
export class AlarmsCardComponent {

    @Input('matBadgeHidden') hidden: boolean = true;

    toggleBadgeVisibility(){
        this.hidden = !this.hidden;
    }
}