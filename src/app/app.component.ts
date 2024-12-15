import { CommonModule } from '@angular/common';
import {
    FormBuilder,
    FormsModule,
    FormGroup,
    ReactiveFormsModule,
    Validators,
    FormControl
} from '@angular/forms';
import moment from 'moment';
import { Component, computed, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { IEmployees, IEmployeesColumn, FilterEnumEmployee } from './app.interface';
import { AppService } from './app.service';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzMessageModule } from 'ng-zorro-antd/message';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';
import { NzSegmentedModule } from 'ng-zorro-antd/segmented';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzFlexModule } from 'ng-zorro-antd/flex';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { CalendarComponent } from './component/calendar/calendar.component';


@Component({
    selector: 'app-root',
    standalone: true,
    imports: [
        RouterOutlet, FormsModule, CommonModule, ReactiveFormsModule, CalendarComponent,
        NzButtonModule,
        NzTableModule,
        NzMessageModule,
        NzModalModule,
        NzInputModule,
        NzIconModule,
        NzToolTipModule,
        NzSelectModule,
        NzDatePickerModule,
        NzDropDownModule,
        NzMenuModule,
        NzLayoutModule,
        NzGridModule,
        NzFormModule,
        NzPageHeaderModule,
        NzSegmentedModule,
        NzCardModule,
        NzAvatarModule,
        NzFlexModule,
    ],
    templateUrl: './app.component.html',
    styles: [''],
    providers: [AppService]
})

export class AppComponent implements OnInit {

    public selectedIndex = signal<number>(0); 
    public selectedTab = signal<string>('');
    public options:any = signal([
        { value: 'list', icon: 'bars' },
        { value: 'kanban', icon: 'appstore' }
    ]);

    public isModalVisible = false;
    
    public employeeForm = signal( 
        new FormGroup({
            id: new FormControl(''),
            emp_name: new FormControl('', Validators.required),
            emp_role: new FormControl('', Validators.required),
            start_date: new FormControl('', Validators.required),
            end_date: new FormControl( {value: "", disabled: true}),
        })
    );
    public startdateSignal = signal<any>('');
    public enddateSignal = signal<any>('');

    public filterenumEmployee = FilterEnumEmployee;
    public filterSelected = signal<FilterEnumEmployee>(FilterEnumEmployee.all);
    public employeeList = signal<IEmployees[]>([]);
    public roleList: any = signal([]);
    public listOfColumns = signal<IEmployeesColumn[]>([
        {
            title: 'Name',
            compare: (a: IEmployees, b: IEmployees) => a.emp_name.localeCompare(b.emp_name),
            priority: 1
        },
        {
            title: 'Role',
            compare: (a: IEmployees, b: IEmployees) => a.emp_role.localeCompare(b.emp_role),
            priority: 2
        },
        {
            title: 'Start Date',
            compare: (a: IEmployees, b: IEmployees) => a.start_date.localeCompare(b.start_date),
            priority: 3
        },
        {
            title: 'End Date',
            compare: (a: IEmployees, b: IEmployees) => a.end_date.localeCompare(b.end_date),
            priority: false
        }
    ]);

    constructor(
        private appService: AppService,
        private message: NzMessageService
    ) {  }

    ngOnInit(): void {
        this.handleModelChange(this.selectedIndex());
        this.getRole();
        this.getEmp();
    }

    public handleModelChange(index: number): void {
        this.selectedTab.set(this.options()[index].value);
    }

    public showCreateModal(): void {
        this.employeeForm().reset();
        this.startdateSignal.set(null);
        this.enddateSignal.set(null);
        this.isModalVisible = true;
    }

    // Role List
    public getRole(): void {
        this.roleList.set(this.appService.getRoleMaster());
    }

    public checkValidInput() {
        this.employeeForm().controls['start_date'].value == '' ? (this.employeeForm().controls['end_date'].value == '' ? this.employeeForm().controls['end_date'].disable() : this.employeeForm().controls['end_date'].enable()) : this.employeeForm().controls['end_date'].enable();
    }

    // Get Employee List
    public getEmp(): void {
        this.appService.getEmployeeMaster().subscribe((res: any) => {
            if (res) {
                this.employeeList.set(res);
            } else {
                this.employeeList.set([]);
            }
        });
    }

    // Filter Employee List
    filterEmployeeList = computed(() => {
        const list = this.employeeList();
        const filter = this.filterSelected();
        if(filter === FilterEnumEmployee.current){
            return list.filter((x:any) => { return x.emp_status === 'current' });
        } else if(filter === FilterEnumEmployee.previous){
            return list.filter((x:any) => { return x.emp_status === 'previous'});
        }
        return list;
    });

    // Get Filter name
    public getFilteredEmp(option:FilterEnumEmployee): void {
        this.filterSelected.set(option);
    }

    // Get Single Employee List
    public getSingleEmp(key: number): void {
        this.appService.getSingleEmployeeMaster(key).subscribe((res: any) => {
            if (res) {
                this.employeeForm().patchValue({
                    id: res.id,
                    emp_name: res.emp_name,
                    emp_role: res.emp_role,
                    start_date: res.start_date,
                    end_date: res.end_date,
                });
                this.startdateSignal.set(res.start_date);
                this.enddateSignal.set(res.end_date);
                this.employeeForm().controls['end_date'].enable();
                this.isModalVisible = true;
            }
        });
    }

    // Insert & Update Emp Method
    public submitForm() {
        if (this.employeeForm().valid) {
            if (this.employeeForm().value.id === null) {
                this.appService.createEmployee(this.employeeForm().value).subscribe((res: any) => {
                    if(res){
                        this.message.success('Employee data has been created');
                        this.getEmp();
                        this.resetForm();
                    } else {
                        this.message.error('Employee data has not been created');
                    }
                });
            } else {
                this.appService.updateEmployee(this.employeeForm().value).subscribe((res: any) => {
                    if(res){ 
                        this.message.success('Employee data has been updated');
                        this.getEmp();
                        this.resetForm();
                    } else {
                        this.message.error('Employee data has not been updated');
                    }
                });
            }
        } else {
            Object.values(this.employeeForm().controls).forEach(control => {
                if (control.invalid) {
                    control.markAsDirty();
                    control.updateValueAndValidity({ onlySelf: true });
                }
            });
        }
    }

    // Delete Emp Method
    public deleteEmp(id: number): void {
        this.appService.deleteEmployee(id).subscribe((res: any) => {
            if (res) {
                this.message.success('Employee data has been deleted');
                this.getEmp();
            } else {
                this.message.error('Employee data has not been deleted');
            }
        });
    }

    // Reset the Reactive Form
    public resetForm(): void {
        this.employeeForm().reset();
        this.employeeForm().controls['end_date'].disable();
        this.isModalVisible = false;
    }

    // Emitted Value from Calendar Component
    public setStartDateValue(data: any): void {
        this.startdateSignal.set(data);
        this.employeeForm().controls['start_date'].setValue(data);
        this.employeeForm().controls['end_date'].enable();
    }

    // Emitted Value from Calendar Component
    public setEndDateValue(data: any): void {
        this.enddateSignal.set(data);
        this.employeeForm().controls['end_date'].setValue(data);
    }

}
