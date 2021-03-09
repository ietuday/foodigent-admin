import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss']
})
export class SelectComponent implements OnInit {
  @Input() filterName: string = "";
  @Input() selectedValue: string = "";
  @Input() options: Array<any> = [];
  @Output() onSelectionChange = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }

  /**
   * @description on selection
   */
  onSelection(value: any) {
    this.onSelectionChange.emit(value);
  }

}
