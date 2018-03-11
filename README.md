# ngx-envconfig
Configuration utility for Angular based on the environment variables 


## Installation
`npm install ngx-envconfig --save`


## Getting Started   

You can configure your project for staging, development and production environments, by taking advantage of Angular environment variables. To do so follow the following instructions.

### Setting up configuration files

- Create `/config` folder under `/assets` directory
- Create the following  config files for the appropriate environment under `/assets/config` folder.

```json
// src/assets/config/development.json
{
  "HOST_API": "http://development.server.com', <-- suppose this is your development server  
  "API_ENDPOINTS": {
    "USER": "api/v1/user",
    ...
  }
}
```


```json
// src/assets/config/staging.json
{
  "HOST_API": "http://staging.server.com', <-- suppose this is your staging server  
  "API_ENDPOINTS": {
    "USER": "api/v1/user",
    ...
  }
}
```


```json
// src/assets/config/production.json
{
  "BASE_API": "http://producton.server.com', <-- suppose this is your production server  
  "API_ENDPOINTS": {
    "USER": "api/v1/user",
    ...
  }
}
```

Based on the provided `state` value in `environment.*.ts` file `ConfigModule` will load the approprate `*.json` config file. Once the configuration `*.json` file is loaded, the Angular will bootstrap the app.

### Usage

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

## Using with Angular environment variables

- Add the following snippet to `.angular-cli.json` file.
    ```json
    "environmentSource": "environments/environment.ts",
      "environments": {
        "dev": "environments/environment.ts",
        "prod": "environments/environment.prod.ts"
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

### Build Environments (if you use env variables option)

- `ng build --env=dev` builds for development environment. This is default if you don't specify.
- `ng build --env=staging` builds for staging environment. 
- `ng build --env=prod` builds for production environment.


## ConfigService

- `get(propertyName: string): any`. Where `propertyName` is the first level property in the corresponding config file. 
- `getEnv(): string`. Returns the current environment
- `isDevMode(): boolean`. Return `true` if environment is development, otherwhise `false`
- `getApi(endpoint: string): string`. This function will only work if you have `API_ENDPOINTS` object in cofig file, which provides the list of available API endpoints. Also it assumes that the there is `CORS` boolean property in config file which tells whether the HTTP requests will be done through cross origin, if it is set to `true` then will concatenate value of `HOST_API` property to the current API endpoint from `API_ENDPOINTS` object, e.g. if `"CORS": true`, then returns `http://development.server.com/api/v1/user`, otherwhise will returns  `/api/v1/user`

 


