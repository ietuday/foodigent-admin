import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
  @Input() placeholder: string = "";
  @Input() searchQuery: string = "";
  @Output() onInputChange = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }

  /**
   * @description on input change
   */
  onSearch() {
    this.onInputChange.emit(this.searchQuery);
  }

}
