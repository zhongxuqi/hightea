import gulp from 'gulp'
import webpack from 'webpack-stream'
import browserSync from 'browser-sync'
import yargs from 'yargs'

let browserSyncInstance = browserSync.create()

import WebpackProdConfig from './webpack.config.js'
import WebpackDevConfig from './webpack.config.dev.js'


gulp.task("build", ()=>{
    return gulp.src('./src/js/**/*.jsx')
        .pipe(webpack(WebpackProdConfig))
        .pipe(gulp.dest("./dist/js"))
})

gulp.task("build:dev", ()=>{
    return gulp.src('./src/js/**/*.jsx')
        .pipe(webpack(WebpackDevConfig))
        .pipe(gulp.dest("./dist/js"))
})

gulp.task("serve", ["build:dev"], ()=>{
    let argv = ((ya)=>{
        ya = ya.alias('p', 'proxy')
        return ya.argv
    }
    )(yargs)

    browserSyncInstance.init({
        host: '0.0.0.0',
        proxy: argv.proxy || 'http://localhost:7070',
        files: "./dist/*",
    })
    let watcher = gulp.watch("./src/**/*", ['build:dev'])
    watcher.on("change", (done)=>{
        browserSyncInstance.reload()
    })
})

gulp.task('default', ["build"])
