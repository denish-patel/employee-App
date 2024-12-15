import { Component, effect, input, OnInit, output, signal } from '@angular/core';
import moment from 'moment';
import range from 'lodash.range';
import { CalendarDate } from '../../app.interface';
import { CommonModule } from '@angular/common';
import { NzFlexModule } from 'ng-zorro-antd/flex';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';

@Component({
    selector: 'app-calendar',
    standalone: true,
    imports: [CommonModule, NzFlexModule, NzButtonModule, NzIconModule],
    templateUrl: './calendar.component.html',
    styleUrl: './calendar.component.css'
})

export class CalendarComponent  {

    btnNodate = input<boolean>(false);
    btnToday = input<boolean>(false);
    nextDay = input<boolean>(false);
    nextNextDay = input<boolean>(false);
    afterWeek = input<boolean>(false);

    disabledDateWise = input<boolean>(false);
    getStartDate = input<any>();
    getNoDate = input<any>();
    
    onSelectDatePicker = output<any>();
    
    // Calendar Variable
    public btnBehaveChange:any = {
        today: false,
        nextday: false,
        nextnextday: false,
        nodate: false,
        afterweek: false,
    };
    public currentDate: moment.Moment = moment();
    public tomorrowDate: moment.Moment = moment().add(1,'days');
    public dayAfterTomorrowDate: moment.Moment = moment().add(2,'days');
    public yesterdayDate: moment.Moment = moment().add(-1, 'days');
    public namesOfDays = signal<string[]> (['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']);
    public weeks: Array<CalendarDate[]> = [];
    public selectedDate: any = moment(this.currentDate).format('DD/MM/YYYY');
    public disabledDate!: any;


    constructor( ) { 
        effect(() => {
            console.log(this.getStartDate())
            if(this.getStartDate()) {
                this.selectedDate = moment(this.getStartDate(), 'DD/MM/YYYY').format('DD/MM/YYYY');
            }
            if(this.getStartDate() || this.getNoDate()) {
                this.disabledDate = moment(this.getStartDate(), 'DD/MM/YYYY').format('DD/MM/YYYY');
                if(this.getNoDate() != null || this.getNoDate() != undefined){
                    this.selectedDate = moment(this.getNoDate(), 'DD/MM/YYYY').format('DD/MM/YYYY');
                }
            }
            this.generateCalendar();
        });
    }
    
    private generateCalendar(): void {
        const dates = this.fillDates(this.currentDate);
        const weeks = [];
        while (dates.length > 0) {
            weeks.push(dates.splice(0, 7));
        }
        this.weeks = weeks;
    }

    private fillDates(currentMoment: moment.Moment) {
        const firstOfMonth = moment(currentMoment).startOf('month').day();
        const lastOfMonth = moment(currentMoment).endOf('month').day();

        const firstDayOfGrid = moment(currentMoment).startOf('month').subtract(firstOfMonth, 'days');
        const lastDayOfGrid = moment(currentMoment).endOf('month').subtract(lastOfMonth, 'days').add(7, 'days');
        const startCalendar = firstDayOfGrid.date();

        return range(startCalendar, startCalendar + lastDayOfGrid.diff(firstDayOfGrid, 'days')).map((date:any) => {
            const newDate = moment(firstDayOfGrid).date(date);
            return {
                today: this.isToday(newDate),
                selected: this.isSelected(newDate),
                disabled: !this.isSelectedMonth(newDate),
                mDate: newDate,
            };
        });
    }

    public getTodayDay() {
        this.makeFalseBtnBehaveChange();
        this.btnBehaveChange.today = true;
        this.currentDate = moment();
        this.selectedDate= moment(this.currentDate).format('DD/MM/YYYY') ;
        this.onSelectDatePicker.emit(this.currentDate.format('DD/MM/YYYY'));
        this.generateCalendar();
    }

    public getNextDay(dayNumber:number):void {
        this.makeFalseBtnBehaveChange();
        if(dayNumber === 1) 
            this.btnBehaveChange.nextday = true;
        if(dayNumber === 2) 
            this.btnBehaveChange.nextnextday = true;
        if(dayNumber === 7) 
            this.btnBehaveChange.afterweek = true;
        this.selectedDate= moment(this.currentDate).add(dayNumber, 'days').format('DD/MM/YYYY') ;
        this.onSelectDatePicker.emit( moment(this.currentDate).add(dayNumber, 'days').format('DD/MM/YYYY') );
        this.generateCalendar();
    }

    public noDate():void {
        this.onSelectDatePicker.emit(null);
        this.generateCalendar();
    }

    private makeFalseBtnBehaveChange(){
        Object.keys(this.btnBehaveChange).forEach(v => this.btnBehaveChange[v] = false);
    }

    private isToday(date: moment.Moment): boolean {
        return moment().isSame(moment(date), 'day');
    }

    private isSelected(date: moment.Moment): boolean {
        return this.selectedDate === moment(date).format('DD/MM/YYYY');
    }

    public prevMonth(): void {
        this.currentDate = moment(this.currentDate).subtract(1, 'months');
        this.generateCalendar();
    }

    public nextMonth(): void {
        this.currentDate = moment(this.currentDate).add(1, 'months');
        this.generateCalendar();
    }

    public isDisabledMonth(currentDate:any): boolean {
        const today = moment();
        return moment(currentDate).isBefore(today, 'months');
    }

    public isSelectedMonth(date: moment.Moment): boolean {
        return this.disabledDateWise() === false ? true : moment(date).isSameOrAfter(moment(this.disabledDate,'DD/MM/YYYY'));
    }

    public selectDate(date:CalendarDate) {
        this.selectedDate= moment(date.mDate).format('DD/MM/YYYY') ;
        this.onSelectDatePicker.emit(moment(date.mDate).format('DD/MM/YYYY'));
        this.generateCalendar();
    }

}
