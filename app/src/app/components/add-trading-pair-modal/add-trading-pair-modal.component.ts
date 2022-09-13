import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { SymbolList } from 'src/app/helpers/symbolLists';

@Component({
  selector: 'add-trading-pair-modal',
  templateUrl: 'add-trading-pair-modal.component.html',
})
export class AddTradingPairModalComponent {
  formControl = new FormControl();
  filteredOptions!: Observable<string[]>;

  ticker = '';

  constructor(
    public dialogRef: MatDialogRef<AddTradingPairModalComponent>,
  ) {}

  ngOnInit() {
    this.filteredOptions = this.formControl.valueChanges.pipe(
      startWith(''),
      map((value) => this._filter(value))
    );
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return SymbolList.filter((option) =>
      option.toLowerCase().includes(filterValue)
    );
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
