export default {
    input: 'dist/index.js',
    output: {
        file: 'dist/bundles/ngxenvconfig.umd.js',
        sourceMap: false,
        format: 'umd',
        globals: {
            '@angular/common': 'ng.common',
            '@angular/common/http': 'ng.common.http',
            '@angular/core': 'ng.core',
            'rxjs/Observable': 'Rx',
            'rxjs/ReplaySubject': 'Rx',
            'rxjs/add/operator/map': 'Rx.Observable.prototype',
            'rxjs/add/operator/mergeMap': 'Rx.Observable.prototype',
            'rxjs/add/observable/fromEvent': 'Rx.Observable',
            'rxjs/add/observable/of': 'Rx.Observable'
        },
        name: 'ng.ngxenvconfig'
    },
}