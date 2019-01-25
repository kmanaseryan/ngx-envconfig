import { Injectable} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, AsyncSubject } from 'rxjs';

import { EnvConfig } from './env-config';


@Injectable()
export class ConfigService {
    
    private _config: any;
    private _env: string;
    private _fallbackConfig: any;
    private _fallbackDev: boolean;

    readonly onLoad: AsyncSubject<boolean> = new AsyncSubject();
    
    constructor(private _http: HttpClient) { }

    load(env: EnvConfig) {
        return new Promise((resolve, reject) => {
            this._env = env.state;
            this._fallbackDev = env.fallbackDev || false;

            let requestDevConfig: Observable<any>;
            if(this._env != 'development' && env.fallbackDev){
                requestDevConfig = this._http.get('./assets/config/development.json')
            }
            this._http.get('./assets/config/' + this._env + '.json')
                .subscribe((data: any) => {
                    this._config = data;
                    if(requestDevConfig){
                        return requestDevConfig.subscribe((res)=>{
                            this._fallbackConfig = res;
                            this.onLoad.next(true);
                            this.onLoad.complete();
                            resolve(true);        
                        })
                    }
                    this.onLoad.next(true);
                    this.onLoad.complete();
                    resolve(true);
                },
                (error: any) => {
                    console.error(error);
                    return Observable.throw(error.json().error || 'Server error');
                });
        });
    }
    // Is app in the development mode?
    isDevMode() {
        return this._env === 'development';
    }
    // Gets current env
    getEnv() {
        return this._env;
    }
    // Gets API route based on the provided key
    getApi(key: string): string {
        let ENDPOINT = this.get('API_ENDPOINTS')[key];
        if(ENDPOINT === undefined && this._fallbackDev)
            ENDPOINT = this._fallbackConfig['API_ENDPOINTS'][key];
        return this.get('HOST_API') + ENDPOINT;
    }
    // Gets a value of specified property in the configuration file
    get(key: any) {
        if(this._config[key] === undefined && this._fallbackDev)
            return this._fallbackConfig[key];
        return this._config[key];
    }
}
