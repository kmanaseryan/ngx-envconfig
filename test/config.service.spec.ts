import { TestBed } from '@angular/core/testing';

import { ConfigService, ConfigModule } from '../index';
import { Observable } from 'rxjs';

// TestBed.configureTestingModule({
//     imports: [
//       HttpClientTestingModule,
//     ],
//     providers: [
//       Platform,
//       FileTransfer,
//       File,
//       FileSyncService,
//       { provide: CustomStorage, useFactory: () => new StorageMock() },
//       { provide: ConfigService, useValue: mockConfigService },
//       ApiService,
//       ReportService,
//     ]
//   })

const devConfig = {
    HOST_API: 'DEV HOST API',
    API_ENDPOINTS: {
        USER: '/api/v1/user',
        GROUP: '/api/v1/group'
    },
    SOME_KEY_WHICH_NOT_EXIST_IN_PROD: 'SOME_KEY_WHICH_NOT_EXIST_IN_PROD',
    TOKEN: Math.random()
}

const prodConfig = {
    HOST_API: 'PROD HOST API',
    API_ENDPOINTS: {
      GROUP:  '/api/v1/prod/group'
    },
    TOKEN: Math.random()

}

describe('ConfigService', () => {

    describe('Develoment Env', () => {
        let configUrl: string;
        beforeEach(async () => {
            TestBed.configureTestingModule({
                imports: [

                ],
                providers: [
                    {
                        provide: ConfigService, useFactory: () => {
                            let mockHttp: any = {
                                get: (url: string) => {
                                    configUrl = url;
                                    return new Observable((observer) => {
                                        observer.next(devConfig);
                                        observer.complete();
                                    })
                                }
                            }
                            let service = new ConfigService(mockHttp);
                            service.load({ state: 'development' });
                            return service;
                        }
                    }
                ]

            })
        });

        it('should be created', () => {
            const service: ConfigService = TestBed.get(ConfigService);
            expect(service).toBeTruthy();
        });

        it('should make http request to: ./assets/config/development.json', () => {
            const service: ConfigService = TestBed.get(ConfigService);
            expect(configUrl).toBe('./assets/config/development.json');
        });

        it('should be in develoment env', () => {
            const service: ConfigService = TestBed.get(ConfigService);
            expect(service.getEnv()).toBe('development')
        });
        it(`get('HOST_API')`, () => {
            const service: ConfigService = TestBed.get(ConfigService);
            expect(service.get('HOST_API')).toBe(devConfig.HOST_API);
        });
        it(`get('TOKEN')`, () => {
            const service: ConfigService = TestBed.get(ConfigService);
            expect(service.get('TOKEN')).toBe(devConfig.TOKEN);
        });

        it(`getApi('USER')`, () => {
            const service: ConfigService = TestBed.get(ConfigService);
            expect(service.getApi('USER')).toBe(devConfig.HOST_API + devConfig.API_ENDPOINTS.USER);
        });
    })

    describe('Production Env', () => {
        let configUrl: string;
        beforeEach(async () => {
            TestBed.configureTestingModule({
                imports: [

                ],
                providers: [
                    {
                        provide: ConfigService, useFactory: () => {
                            let mockHttp: any = {
                                get: (url: string) => {
                                    configUrl = url;
                                    return new Observable((observer) => {
                                        if(url.indexOf('development.json') > -1)
                                            observer.next(devConfig);
                                        else 
                                            observer.next(prodConfig);
                                        observer.complete();
                                    })
                                }
                            }
                            let service = new ConfigService(mockHttp);
                            service.load({ state: 'production', fallbackDev: true });
                            return service;
                        }
                    }
                ]

            })
        });

        it('should be created', () => {
            const service: ConfigService = TestBed.get(ConfigService);
            expect(service).toBeTruthy();
        });

        it('should make http request to: ./assets/config/production.json', () => {
            const service: ConfigService = TestBed.get(ConfigService);
            expect(configUrl).toBe('./assets/config/production.json');
        });

        it('should be in production env', () => {
            const service: ConfigService = TestBed.get(ConfigService);
            expect(service.getEnv()).toBe('production')
        });
        it(`get('HOST_API')`, () => {
            const service: ConfigService = TestBed.get(ConfigService);
            expect(service.get('HOST_API')).toBe(prodConfig.HOST_API);
        });
        it(`get('TOKEN')`, () => {
            const service: ConfigService = TestBed.get(ConfigService);
            expect(service.get('TOKEN')).toBe(prodConfig.TOKEN);
        });

        it(`getApi('GROUP')`, () => {
            const service: ConfigService = TestBed.get(ConfigService);
            expect(service.getApi('GROUP')).toBe(prodConfig.HOST_API + prodConfig.API_ENDPOINTS.GROUP);
        });

        it(`getApi('USER') should fallback to dev API endpoint`, () => {
            const service: ConfigService = TestBed.get(ConfigService);
            expect(service.getApi('USER')).toBe(prodConfig.HOST_API + devConfig.API_ENDPOINTS.USER);
        });

        it(`get('SOME_KEY_WHICH_NOT_EXIST_IN_PROD')`, () => {
            const service: ConfigService = TestBed.get(ConfigService);
            expect(service.get('SOME_KEY_WHICH_NOT_EXIST_IN_PROD')).toBe(devConfig.SOME_KEY_WHICH_NOT_EXIST_IN_PROD);
        });
    })

});
