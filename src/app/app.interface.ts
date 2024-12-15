import * as moment from 'moment';

export interface IEmployees {
    id: number;
    checked: boolean;
    emp_name: string;
    avatarIcon: string;
    emp_role: string;
    start_date: string;
    start_date_format: string;
    end_date: string;
    end_date_format:string;
    emp_status: string;
}


export interface IEmployeesColumn {
    title: string;
    compare: any;
    priority: any;
}

export interface CalendarDate {
    mDate: moment.Moment;
    selected?: boolean;
    today?: boolean;
    disabled?: boolean;
}

export enum FilterEnumEmployee {
    all = 'all',
    current = 'current',
    previous = 'previous',
}