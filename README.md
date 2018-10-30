# ngx-envconfig
Configuration utility for Angular app. [![Tweet](https://img.shields.io/twitter/url/http/shields.io.svg?style=social)](https://twitter.com/intent/tweet?text=Configuration%20utility%20for%20Angular%20apps&url=https://github.com/kmanaseryan/ngx-envconfig&hashtags=Angular,config,JavaScript,developers)


> If you like the idea, please leave a Github star. 

## Table of contents:
1. [ Features ](#features)
2. [ Installation ](#isntall)
3. [ Build Environments ](#build)
4. [ API Reference ](#api)
    
    4.1 [ ConfigModule ](#module)
    
    4.2 [ ConfigService ](#service)
5. [ Getting Started ](#started)

    5.1 [ Setting up configuration files ](#configfiles)

    5.2 [ Usage without Angular environment variables ](#without)

    5.3 [ Usage with Angular environment variables ](#with)


## Features
- Configure the project for **staging**, **development** and **production** environments, by taking advantage of [Angular](https://angular.io/) environment variables.
- Fallback to default (development.json) configuration if there is no match in production/staging configuration.
- Initializ configuration, before whole application initialization process complete 
- Simplified methods for getting back-end API endpoints  

<a name="isntall"></a>
## Installation
`npm install ngx-envconfig --save`

<a name="build"></a>
## Build Environments

- `ng build --configuration=staging` builds for staging environment. For older versions `ng build --env=staging` 
- `ng build --configuration=production` builds for production environment. For older versions `ng build --env=prod`

<a name="api"></a>
# API Reference

<a name="module"></a>
### ConfigModule

- *.forRoot(envConfig: EnvConfig)* Based on the provided `envConfig.state` value, it will load the approprate `*.json` config file. It assumes that configuration json files are located under `./src/assets/config` folder. Angular will bootstrap the app, only after the configuration `*.json` file is loaded.

### EnvConfig

- *.state: string* Specifies the environment. For instane if it's equalt to `'development'` then will load `development.json` file from `./src/assets/config` folder
- *.fallbackDev: boolean = false* Indicates whether to get the value from `development.json` configuration if there is no match in the specified environment. For instance if `"SOME_KEY"` does not exist in `production.json` then it will return the value of `"SOME_KEY"` from `development.json`, if `"SOME_KEY"` value does exist `development.json` file. 

<a name="service"></a>
### ConfigService

- *.get(propertyName: string): any*. Returns the corresponding value of the provided property `propertyName` config file. 
    ```javascript
    constructor(private config: ConfigService){
      console.log(this.config.get('HOST_API'))
      // prints: 'http://development.server.com' in development mode  
    }
    ```
- *.getEnv(): string*. Returns the current environment
    ```javascript
    constructor(private config: ConfigService){
      console.log(this.config.getEnv())
      // prints: 'development' in development mode
    }
    ```
- *.isDevMode(): boolean*. Returns `true` if environment is development, otherwhise `false`
    ```javascript
    constructor(private config: ConfigService){
      console.log(this.config.isDevMode())
      // prints: true in development mode
    }
    ```
- *.getApi(endpoint: string): string*. This function will only work if you have provided `"API_ENDPOINTS"` object in cofig file, which provides the list of available API endpoints and `"HOST_API"` which is the API's host URL. Returns API endpoint from  `"API_ENDPOINTS"` by concatenating it with `"HOST_API"`.
    ```javascript
    constructor(private config: ConfigService){
      console.log(this.config.getApi('USER'))
      // prints: 'http://development.server.com/api/v1/user' in development mode  
    }
    ```
- *.onLoad: AsyncSubject<boolean> boolean*. Async subject to be subscribed. Emits when the config file is already loaded.
    ```javascript
    constructor(private config: ConfigService){
      this.config.onLoad.subscribe(()=>{
          console.log('Config file is loaded');
      })
    }
    ```

<a name="started"></a>
# Getting Started   

<a name="configfiles"></a>
### Setting up configuration files

- Create `/config` folder under `/assets` directory
- Create the following  config files for the appropriate environment under `/assets/config` folder.

```json
// src/assets/config/development.json
{
  "HOST_API": "http://development.server.com",
  "API_ENDPOINTS": {
    "USER": "/api/v1/user"
  },
  "TOKEN": "development token"  
}
```


```json
// src/assets/config/staging.json
{
  "HOST_API": "http://staging.server.com",
  "TOKEN": "staging token"
}
```


```json
// src/assets/config/production.json
{
  "HOST_API": "http://production.server.com",
  "TOKEN": "production token"
}
```
<a name="without"></a>
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
      console.log(configService.getApi('USERS'))
      // prints: http://development.server.com/api/v1/users
      // prints: http://production.server.com/api/v1/users if the state is production
  }
}

```
<a name="with"></a>
### Usage with Angular environment variables

- Add *staging* configurations in `angular.json` file. Make sure *production* configuration is added. 
Default one we assume is the *development* configuration, which is points to `environment.ts` file.
    ```json
    ...
    "projects": {
        "YOUR APP NAME": {
        "root": "",
        ...
            "architect": {
                "build": {
                ...
                "configurations": {
                    "production": {
                        "fileReplacements": [
                            {
                            "replace": "src/environments/environment.ts",
                            "with": "src/environments/environment.prod.ts"
                            }
                        ],
                        ...
                    },
                    "staging": {
                        "fileReplacements": [
                            {
                            "replace": "src/environments/environment.ts",
                            "with": "src/environments/environment.staging.ts"
                            }
                        ]
                    }
    ...
    }
    ```
- If you have older version of Anuglar then make the updates in `.angular-cli.json` file as follows:
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
    // ./environments/environment.ts
    export const environment = {
        state: 'development'
    };
    ```
- Then you can add environment value to `ConfigModule` like this:

    ```javascript 
        // src/app/app.module.ts
        import { NgModule } from '@angular/core';
        import { ConfigModule, ConfigService } from 'ngx-envconfig';

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
            // prints: http://production.server.com if the state is production

            console.log(configService.getApi('USERS'))
            // prints: http://development.server.com/api/v1/users
            // prints: http://production.server.com/api/v1/users if the state is production
        }
    }

    ```

