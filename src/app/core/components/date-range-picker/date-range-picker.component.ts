import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { DateRangeType } from '../../interfaces/date-range-type';
import { DateType } from '../../interfaces/date-type';

@Component({
  selector: 'app-date-range-picker',
  templateUrl: './date-range-picker.component.html',
  styleUrls: ['./date-range-picker.component.scss']
})
export class DateRangePickerComponent implements OnInit, AfterViewInit {
  dateRange = {} as DateRangeType;
  range = new FormGroup({});
  @Input() data: any;
  @Output() onValueChange = new EventEmitter();

  constructor(
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.range = this.fb.group({
      start: [new Date(this.data.year, this.data.previousMonth, this.data.day)],
      end: [new Date(this.data.year, this.data.month, this.data.day), Validators.required]
    });
  }

  ngAfterViewInit() {
    this.range.valueChanges.pipe(debounceTime(500)).subscribe(event => {
      if (event.start && event.end) {
        this.onDateRangeChange(event);
      }
    });
  }

  onDateRangeChange(event: any) {
    console.log("event=========", event);
    this.dateRange.start = {} as DateType;
    this.dateRange.end = {} as DateType;
    // get data
    const startDate = this.range?.get('start')?.value;
    const endDate = this.range?.get('end')?.value;
    // set data
    if (startDate._i.date !== undefined) {
      // when date range change
      this.dateRange.start.day = startDate._i.date;
      this.dateRange.start.month = startDate._i.month;
      this.dateRange.start.year = startDate._i.year;
      this.dateRange.end.day = endDate._i.date;
      this.dateRange.end.month = endDate._i.month;
      this.dateRange.end.year = endDate._i.year;
    } else {
      // when initially date range set
      this.dateRange.start.day = this.data.day;
      this.dateRange.start.month = this.data.previousMonth;
      this.dateRange.start.year = this.data.year;
      this.dateRange.end.day = this.data.day;
      this.dateRange.end.month = this.data.month;
      this.dateRange.end.year = this.data.year;
    }
    // increase 1 in month
    this.dateRange.start.month = this.dateRange.start.month + 1;
    this.dateRange.end.month = this.dateRange.end.month + 1;
    // emit data
    this.onValueChange.emit(this.dateRange);
  }

}
