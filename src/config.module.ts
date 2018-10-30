import { Injectable, NgModule, ModuleWithProviders, APP_INITIALIZER, SkipSelf, Optional } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

import { ConfigService } from './config.service';
import { EnvConfig } from './env-config';

let _env: EnvConfig;

export function ConfigFactory(config: ConfigService) {
    const res = () => config.load(_env);
    return res;
}



@NgModule({
    imports: [
        CommonModule,
        HttpClientModule
    ],
    providers: [
        ConfigService,
        {
            provide: APP_INITIALIZER,
            useFactory: ConfigFactory,
            deps: [ConfigService],
            multi: true
        }
    ],
    declarations: []
})

export class ConfigModule {
    constructor( @Optional() @SkipSelf() parentModule: ConfigModule) {
        if (parentModule) {
            throw new Error(
                'ConfigModule is already loaded. Import it in the AppModule only');
        }
    }

    static forRoot(env: EnvConfig): ModuleWithProviders {
        _env = env; 
        return {
            ngModule: ConfigModule
        };
    }
}

