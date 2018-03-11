# ngx-envconfig
Configuration utility for Angular app.

## Features
- Configure the project for **staging**, **development** and **production** environments, by taking advantage of [Angular](https://angular.io/) environment variables.
- Initializ configuration, before whole application initialization process complete 
- Simplified methods for getting back-end API endpoints  

## Installation
`npm install ngx-envconfig --save`


## ConfigModule

`ConfigModule` has `forRoot()` function which accepts `{state: string}` object. Based on the provided `state` value, it will load the approprate `*.json` config file. It assumes that configuration json files are located under `./src/assets/config` folder. Angular will bootstrap the app, only after the configuration `*.json` file is loaded.


## ConfigService

- **.get(propertyName: string): any**. Returns the corresponding value of the provided property `propertyName` config file. 
- **.getEnv(): string**. Returns the current environment
- **.isDevMode(): boolean**. Returns `true` if environment is development, otherwhise `false`
- **.getApi(endpoint: string): string**. Return This function will only work if you have provided `"API_ENDPOINTS"` object in cofig file, which provides the list of available API endpoints and `"HOST_API"` which is the API's host URL.



## Getting Started   

### Setting up configuration files

- Create `/config` folder under `/assets` directory
- Create the following  config files for the appropriate environment under `/assets/config` folder.

```json
// src/assets/config/development.json
{
  "HOST_API": "http://development.server.com",
  "API_ENDPOINTS": {
    "USER": "/api/v1/user"
  }
}
```


```json
// src/assets/config/staging.json
{
  "HOST_API": "http://staging.server.com",
  "API_ENDPOINTS": {
    "USER": "/api/v1/user"
  }
}
```


```json
// src/assets/config/production.json
{
  "HOST_API": "http://production.server.com",
  "API_ENDPOINTS": {
    "USER": "/api/v1/user"
  }
}
```

### Usage without Angular environment variables

```javascript 
// src/app/app.module.ts
import { NgModule } from '@angular/core';
import { ConfigModule, ConfigService } from './config/config.service';

@NgModule({
    imports: [
        ConfigModule.forRoot({state: 'development'})
        ...
    ],
    providers: [
        ...
        Your Providers
        ...
    ]
})

export class AppModule { }
```

```javascript 
// src/app/app.component.ts
import { Component } from '@angular/core';

import { ConfigService } from 'ngx-envconfig';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(private configService: ConfigService){
      console.log(configService.get('HOST_API'))
      // prints: http://development.server.com
  }
}

```

### Usage with Angular environment variables

- Add the following snippet to `.angular-cli.json` file.
    ```json
    "environmentSource": "environments/environment.ts",
      "environments": {
        "dev": "environments/environment.ts",
        "prod": "environments/environment.prod.ts",
        "staging": "environments/environment.staging.ts"
      }
    ```
- Create the following files under `/environments` folder.

    ```javascript
    // ./environments/environment.prod.ts
    export const environment = {
        state: 'production'
    };
    ```
    ```javascript
    // ./environments/environment.staging.ts
    export const environment = {
        state: 'staging'
    };
    ```
    ```javascript
    // ./environments/environment.development.ts
    export const environment = {
        state: 'development'
    };
    ```
- Then you can add environment value to `ConfigModule` like this:

    ```javascript 
        // src/app/app.module.ts
        import { NgModule } from '@angular/core';
        import { ConfigModule, ConfigService } from './config/config.service';

        import { environment } from '../src/environments/environment'; // <-- add this line

        @NgModule({
            imports: [
                ConfigModule.forRoot(environment) // <-- pass environment variable
                ...
            ],
            providers: [
                ...
                Your Providers
                ...
            ]
        })

        export class AppModule { }
    ```


### Build Environments

- `ng build --env=dev` builds for development environment. This is the default if you don't specify env value.
- `ng build --env=staging` builds for staging environment. 
- `ng build --env=prod` builds for production environment.

