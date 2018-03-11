import { Injectable} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { EnvConfig } from './env-config.service';

@Injectable()
export class ConfigService {

    private _config: any;
    private _env: string;

    constructor(private _http: HttpClient, private envConfig: EnvConfig) { }
    load() {
        return new Promise((resolve, reject) => {
            this._env = this.envConfig.state;
            console.log(this._env)
            this._http.get('./assets/config/' + this._env + '.json')
                .subscribe((data: any) => {
                    this._config = data;
                    resolve(true);
                },
                (error: any) => {
                    console.error(error);
                    return Observable.throw(error.json().error || 'Server error');
                });
        });
    }
    // Is app in the development mode?
    isDevmode() {
        return this._env === 'development';
    }
    // Gets current env
    getEnv(key: any) {
        return this._env;
    }
    // Gets API route based on the provided key
    getApi(key: string): string {
        const ENDPOINT = this._config['API_ENDPOINTS'][key];
        if (this._config['CORS'])
            return this._config['HOST_API'] + ENDPOINT;
        return this._config['PREFIX'] + ENDPOINT;


    }
    // Gets a value of specified property in the configuration file
    get(key: any) {
        return this._config[key];
    }
}
