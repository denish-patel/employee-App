import { Injectable } from '@angular/core';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { IEmployees } from './app.interface';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import moment from 'moment';
import { roles } from './roles.json';

@Injectable()
export class AppService {

    constructor(
        private dbService: NgxIndexedDBService
    ) { }

    
    public getEmployeeMaster(): Observable<IEmployees[]> {
        return this.dbService.getAll('employee_master').pipe(
            map((response:any) => {
                return response.map((e:any) => ({
                    ...e,
                    checked: false,
                    avatarIcon: e.emp_name === null ? '' : Array.from(e.emp_name)[0],
                    start_date: e.start_date,
                    end_date: e.end_date,
                    start_date_format: e.start_date === '' || e.start_date === null || e.start_date === 'Invalid date' ? null : moment(e.start_date,'LL').format('LL'),
                    end_date_format: e.end_date === '' || e.end_date === null || e.end_date === 'Invalid date' ? null : moment(e.end_date,'LL').format('LL'),
                    emp_status:  e.end_date === '' || e.end_date === null || e.end_date === 'Invalid date' ? 'current' : 'previous',
                }));
            })
        );
    }
    
    public getSingleEmployeeMaster(key:number): Observable<IEmployees[]> {
        return this.dbService.getByKey('employee_master',key);
    }
    
    public createEmployee(empData:any) {
        return this.dbService.add('employee_master', empData);
    }

    public updateEmployee(empData:any) {
        return this.dbService.update('employee_master', empData);
    }

    public deleteEmployee(key:number) {
        return this.dbService.delete('employee_master', key);
    }

    public getRoleMaster() {
        return roles;
    }

}
