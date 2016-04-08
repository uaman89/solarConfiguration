var gulp = require('gulp'),
    gp_concat     = require('gulp-concat'),
    gp_rename     = require('gulp-rename'),
    gp_uglify     = require('gulp-uglify'),
    gp_sourcemaps = require('gulp-sourcemaps'),
    minifyCSS     = require('gulp-minify-css'),
    browserSync = require('browser-sync').create()
    //gulpFilter    = require('gulp-filter'),
    //mainBowerFiles   = require('main-bower-files')
    ;

/*
gulp.task('bower-js-files', function(){

    var jsFilter = gulpFilter('**!/!*.js');  //отбираем только  javascript файлы

    return gulp.src(mainBowerFiles({
        includeDev: true //в настройках модуля mainBowerFiles указываем, что в файле bower.json список наших библиотек храниться в блоке с префиксом dev (devDependencies) . Если Вы сохраняете свои библиотеки без префикска dev, то данная настройка не нужна.
    }))
        // собираем js файлы , склеиваем и отправляем в нужную папку (в моем случае это www/js)
        .pipe(jsFilter)
        .pipe(gp_sourcemaps.init())
        .pipe(gp_concat('vendor.concat.js'))
        .pipe(gp_rename('vendor.min.js'))
        .pipe(gp_uglify())
        .pipe(gp_sourcemaps.write('./'))
        .pipe(gulp.dest('js'))
    ;
});

gulp.task('bower-style-files', function(){

    var cssFilter = gulpFilter('**!/!*.css');  //отбираем только css файлы

    return gulp.src(mainBowerFiles({ includeDev: true })) //в настройках модуля mainBowerFiles указываем, что в файле bower.json список наших библиотек храниться в блоке с префиксом dev (devDependencies) . Если Вы сохраняете свои библиотеки без префикска dev, то данная настройка не нужна.
        .pipe(cssFilter)
        .pipe(gp_sourcemaps.init())
        .pipe(gp_concat('vendor.concat.css'))
        .pipe(gp_rename('vendor.min.css'))
        .pipe(minifyCSS())
        .pipe(gp_sourcemaps.write('./'))
        .pipe(gulp.dest('styles'))
    ;
});

*/

// JS-HEADER
gulp.task('js-to-header', function(){
    return gulp.src([
        'bower_components/jquery/dist/jquery.min.js',
        'bower_components/angular/angular.min.js',
    ])
        //.pipe(gp_sourcemaps.init())
        .pipe(gp_concat('header_script.concat.js'))
        .pipe(gulp.dest('js'))
        .pipe(gp_rename('header_script.min.js'))
        //.pipe(gp_uglify())
        //.pipe(gp_sourcemaps.write('./'))
        .pipe(gulp.dest('js'));
});

// JS-BOTTOM
gulp.task('js-to-bottom', function(){
    return gulp.src([
        'bower_components/bootstrap/dist/js/bootstrap.min.js',
        'bower_components/bootstrap-select/dist/js/bootstrap-select.min.js',
        'bower_components/three.js/build/three.min.js',
        '__sources/js/models/*.js',
        '__sources/js/app.js',
        '__sources/js/directives/*.js',
        '__sources/js/controllers/*.js',
        '__sources/js/index.js',                  //my script
        ])
        //.pipe(gp_sourcemaps.init())
        .pipe(gp_concat('bottom_script.concat.js'))
        .pipe(gulp.dest('js'))
        .pipe(gp_rename('bottom_script.min.js'))
        //.pipe(gp_uglify())
        //.pipe(gp_sourcemaps.write('./'))
        .pipe(gulp.dest('js'));
});


// CSS
gulp.task('css', function(){
    gulp.src([
            'bower_components/angular/angular-csp.css',
            'bower_components/bootstrap/dist/css/bootstrap.min.css',
            'bower_components/bootstrap-select/dist/css/bootstrap-select.css',
            '__source/styles/*.css'                                            //my styles
        ])
        //.pipe(gp_sourcemaps.init())
        .pipe(gp_concat('main.concat.css'))
        .pipe(gulp.dest('styles'))
        .pipe(gp_rename('main.min.css'))
        //.pipe(minifyCSS())
        //.pipe(gp_sourcemaps.write('./'))
        .pipe(gulp.dest('styles'))
});

// BROWSER SYNC
gulp.task('browser-sync', function() {
    browserSync.init({
        //proxy: "http://localhost:63342/solar-spa/index.html"
        server: {
            baseDir: "./"
        }
    });

    gulp.watch('__sources/js/**/*.js',['js-to-header', 'js-to-bottom']).on('change', browserSync.reload);
    gulp.watch("index.html").on('change', browserSync.reload);

});

gulp.task('default', ['js-to-header', 'js-to-bottom', 'css'], function(){});

