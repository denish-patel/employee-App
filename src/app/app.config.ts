import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { registerLocaleData } from '@angular/common';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';

import { DBConfig, provideIndexedDb } from 'ngx-indexed-db';
import en from '@angular/common/locales/en';
import { provideNzI18n, en_US } from 'ng-zorro-antd/i18n';
import { provideNzIcons } from 'ng-zorro-antd/icon';
import { IconDefinition } from '@ant-design/icons-angular';
import * as AllIcons from '@ant-design/icons-angular/icons';

registerLocaleData(en);

const antDesignIcons = AllIcons as {
    [key: string]: IconDefinition;
};
const icons: IconDefinition[] = Object.keys(antDesignIcons).map(key => antDesignIcons[key])

const dbConfig: DBConfig = {
    name: 'myDb',
    version: 1,
    objectStoresMeta: [
        {
            store: 'employee_master',
            storeConfig: { keyPath: 'id', autoIncrement: true },
            storeSchema: [
                { name: 'emp_name', keypath: 'emp_name', options: { unique: false } },
                { name: 'emp_role', keypath: 'emp_role', options: { unique: false } },
                { name: 'start_date', keypath: 'start_date', options: { unique: false } },
                { name: 'end_date', keypath: 'end_date', options: { unique: false } },
            ]
        }
    ]
};

export const appConfig: ApplicationConfig = {
    providers: [
        provideAnimations(),
        provideNzI18n(en_US),
        provideNzIcons(icons),
        importProvidersFrom(),
        provideIndexedDb(dbConfig),
        provideZoneChangeDetection({ eventCoalescing: true }),
        provideRouter(routes)
    ]
};
