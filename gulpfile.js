var jshint = require('gulp-jshint');
var gulp = require('gulp');

gulp.task('lint', function () {
	return gulp.src([
		'lib/**/*',
		'examples/*.js',
		'*.js'
	])
		.pipe(jshint())
		.pipe(jshint.reporter('default', { verbose: true }))
		.pipe(jshint.reporter('fail'));
});



var tsc = require('gulp-typescript-compiler');



gulp.task('buildDev', function(){
	gulp.src(['src/client/*.ts'])
		.pipe(tsc({ sourcemap: true,  module: 'amd', outDir: 'dist/client/' }))
		.pipe(gulp.dest('dist/client'));
	gulp.src(['src/server/*.ts'])
		.pipe(tsc({ sourcemap: true,  module: 'amd', outDir: 'dist/client/' }))
		.pipe(gulp.dest('dist/client'));
});