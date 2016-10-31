var gulp = require('gulp'),
	webpack = require('webpack'),
	md5 = require('gulp-md5-plus'),
	gutil = require('gulp-util'),
  del=require('del'),
    clean = require('gulp-clean');//清理文件


var webpack_config=require('./webpack.config.js');//得到webpack的配置
var webpack_config_dev=require('./webpack.dev.config.js');//得到webpack的配置
var webpack_config_pro=require('./webpack.pro.config.js');

var devCompiler = webpack(webpack_config);
var devCompiler_dev=webpack(webpack_config_dev);
var devCompiler_pro=webpack(webpack_config_pro);

gulp.task('imginclude', function (done) {
   gulp.src('src/images/**/*')
       .pipe(gulp.dest('dist/images'))
       .on('end', done);
});

gulp.task('cssinclude', function (done) {
   gulp.src('src/outcss/**/*')
       .pipe(gulp.dest('dist/css'))
       .on('end', done);
});

gulp.task('jsinclude', function (done) {
   gulp.src('src/js/**/*')
       .pipe(gulp.dest('dist/oldjs'))
       .on('end', done);
});

//执行打包流
gulp.task('build',function(callback){
	devCompiler.run(function(err, stats){
		gutil.log("[webpack:build-js]", stats.toString({
            colors: true
        }));
        callback();//执行完后执行下一个流
	});
});

gulp.task('builddev',function(callback){
  devCompiler_dev.run(function(err, stats){
    gutil.log("[webpack:build-js]", stats.toString({
            colors: true
        }));
        callback();//执行完后执行下一个流
  });
});

gulp.task('buildpro',function(callback){
  devCompiler_pro.run(function(err, stats){
    gutil.log("[webpack:build-js]", stats.toString({
            colors: true
        }));
        callback();//执行完后执行下一个流
  });
});

//将js加上10位md5,并修改html中的引用路径，该动作依赖build-js
gulp.task('md5:js',  function (done) {
  gulp.src('dist/oldjs/**/*.js')
       .pipe(md5(10, 'dist/html/**/*.html'))
       .pipe(gulp.dest('dist/js'))
       .on('end', done);
});

gulp.task('changechunks',function(done){//将生成的 chunks 移到
    gulp.src('dist/chunks/*.js').pipe(gulp.dest('dist/newchunks/chunks')).on('end',done);
});

gulp.task('clean',['dev1'],function (done) {
    return del(['dist/chunks']);
});

gulp.task('clean1',function (done) {
    return del(['dist/chunks']);
});

gulp.task('clean2',function (done) {
    return del(['dist']);
});

/*gulp.task('clean', ['md5:js'], function (done) {
	gulp.src(['dist/js'])
        .pipe(clean())
        .on('end', done);
});*/

//将html 文件放到dist中
gulp.task('fileinclude', function (done) {
   gulp.src('src/html/**/*.html')
       .pipe(gulp.dest('dist/html'))
       .on('end', done);
});



gulp.task('watch', function (done) {
    gulp.watch('src/**/*',['clean'])
        .on('end', done);
});

//gulp.task('dev', ['imginclude','jsinclude','builddev','watch','fileinclude','md5:js','changechunks','clean']);

//gulp.task('default', ['imginclude','jsinclude','build','fileinclude','md5:js','changechunks','clean']);//生产环境 还要替换md5 等等就不搞啦~~;


gulp.task('dev',['watch','clean','dev1']);
var runSequence = require('run-sequence');

gulp.task('dev1' ,function(callback) {
    runSequence('imginclude',
        'cssinclude',
        'jsinclude',
        'builddev',
        'fileinclude',
        'md5:js',
        'changechunks',
        callback
      );
});

gulp.task('devwatch', function(callback) {
    runSequence('imginclude',
        'cssinclude',
        'jsinclude',
        'builddev',
        'fileinclude',
        'md5:js',
        'changechunks',
        callback);
});

gulp.task('default', function(callback) {
    runSequence('clean2','imginclude',
        'cssinclude',
        'jsinclude',
        'build',
        'fileinclude',
        'md5:js',
        'changechunks',
        'clean1',
        callback);
});

gulp.task('pro', function(callback) {
    runSequence('clean2','imginclude',
        'cssinclude',
        'jsinclude',
        'buildpro',
        'fileinclude',
        'md5:js',
        'changechunks',
        'clean1',
        callback);
});