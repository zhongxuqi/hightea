import gulp from 'gulp'
import webpack from 'webpack-stream'
import browserSync from 'browser-sync'
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
    browserSyncInstance.init({
        host: 'localhost',
        port: 7777,
        proxy: 'localhost:7070',
        files: "./dist/*",
    })
    let watcher = gulp.watch("./src/**/*", ['build:dev'])
    watcher.on("change", (done)=>{
        console.log("test")
        browserSyncInstance.reload()
    })
})

gulp.task('default', ["build"])
