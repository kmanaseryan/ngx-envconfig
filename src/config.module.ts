import { NgModule, ModuleWithProviders, APP_INITIALIZER, SkipSelf, Optional } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

import { ConfigService } from './config.service';
import { EnvConfig } from './env-config';


export function ConfigFactory(config: ConfigService, env: EnvConfig) {
    const res = () => config.load(env);
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
            deps: [ConfigService, EnvConfig],
            multi: true
        }
    ],
    declarations: []
})

export class ConfigModule {
    constructor(@Optional() @SkipSelf() parentModule: ConfigModule) {
        if (parentModule) {
            throw new Error(
                'ConfigModule is already loaded. Import it in the AppModule only');
        }
    }

    static forRoot(env: EnvConfig): ModuleWithProviders {
        return {
            ngModule: ConfigModule,
            providers: [
                { provide: EnvConfig, useValue: env }
            ]
        };
    }
}

