import { Component, Inject} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'remove-trading-pair-modal',
  templateUrl: 'remove-trading-pair-modal.component.html',
})
export class RemoveTradingPairModalComponent {
  constructor(
    public dialogRef: MatDialogRef<RemoveTradingPairModalComponent>,
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}