/**
 * Gulpfile create to make developing this framework easier.
 * Do not touch anything below here unless you know what you're doing.
 *
 * Author: Saborknight
 * Version: 1.0
 */
/**
 * User Variables
 * Use these instead of editing in the actual code
 */
confName = 'framework'; // Will be used in url and references

devDir = 'src';
buildDir = 'dist';

confSSL = false;

/**
 * System Variables
 * Do not touch unless you know what you're doing
 */
var util = require('util');
var browserSync = require('browser-sync').create(confName);
var del = require('del');
var gulp = require('gulp');
var autoprefixer = require('gulp-autoprefixer');
var cache = require('gulp-cache');
var cssnano = require('gulp-cssnano');
var gulpIf = require('gulp-if');
var imagemin = require('gulp-imagemin');
var plumber = require('gulp-plumber');
var sass = require('gulp-sass');
var uglify = require('gulp-uglify');
var useref = require('gulp-useref');
var gutil = require('gulp-util');
var runSequence = require('run-sequence');

confProxy = util.format('http%s://%s.dev', confSSL ? 's' : '', confName);

error = gutil.colors.red;
warning = gutil.colors.yellow;
info = gutil.colors.blue;
success = gutil.colors.green;

confTunnel = gutil.env.tunnel ? confName : false;

gulp.task('default', function(callback) {
	runSequence(['sass', 'browserSync', 'watch'],
		callback);
});

gulp.task('build', function(callback) {
	log('Building!', 'info');

	runSequence('clean:dist',
		['css', 'useref', 'images'],
		callback);
});

gulp.task('watch', ['browserSync', 'sass'], function() {
	gulp.watch(globDeclaration('.scss', 'sass'), ['sass'])
	gulp.watch(globDeclaration('.html'), browserSync.reload)
	gulp.watch(globDeclaration('.js', 'js'), browserSync.reload)
	gulp.watch(globDeclaration('.php'), browserSync.reload)
});

gulp.task('sass', function() {
	sassProcess();
});

gulp.task('css', function() {
	sassProcess();
	autoprefix();
});

gulp.task('browserSync', function() {
	browserSync.init({
		server: { baseDir: devDir },
		tunnel: confTunnel,
		reloadOnRestart: true,
		port: 8010
	});
});

gulp.task('useref', function(){
		return gulp.src( globDeclaration('.html') )
			.pipe(useref())
			// Minifies only if it's a JavaScript file
			.pipe(gulpIf('*.js', uglify()))
			// Minifies only if it's a CSS file
			.pipe(gulpIf('*.css', cssnano()))
			.pipe(gulp.dest(buildDir))
});

gulp.task('images', function(){
	return gulp.src( globDeclaration('.+(png|jpg|jpeg|gif|svg)') )
		.pipe(cache(imagemin({
			// Setting interlaced to true
			interlaced: true
		})))
		.pipe(gulp.dest(buildDir + '/img'))
});

gulp.task('clean:dist', function() {
	return del.sync(buildDir);
});

gulp.task('cache:clear', function (callback) {
	return cache.clearAll(callback);
});

function sassProcess() {
	var sassDir = globDeclaration('.scss', 'sass');

	log('Compiling [sass] from: ' + sassDir, 'info');

	return gulp.src( sassDir )
		.pipe(sass()) // Using gulp-sass
		.pipe(gulp.dest(devDir + '/css'))
		.pipe(browserSync.reload({
			stream: true
	}));
}

function autoprefix() {
	log('Autoprefixing', 'info');

	return gulp.src( globDeclaration('.css', 'css') )
		.pipe(autoprefixer({
			browsers: ['> 0%']
		}))
		.pipe(gulp.dest(buildDir + '/css'));
}

/**
 * Utility Functions. Do not touch anything below here unless you know what you're doing
 *
 * Author: Saborknight
 * Version: 1.0
 */
function globDeclaration(fileType, folder = false) {
	srcGlob = [util.format('%s/%s**/*%s', devDir, folder ? folder +'/' : '', fileType),
		util.format('!%s/%s**/*-OLD*%s', devDir, folder ? folder +'/' : '', fileType)];

	return srcGlob;
}

function log(message, state = 'info') {
	switch(state) {
		case 'error':
			var preText = error.dim('xxxxxxx>');
			var postText = error.dim('<xxxxxxx');
			var message = message;
			break;

		case 'warning':
			var preText = warning.dim('-------------->');
			var message = warning(message);
			break;

		case 'success':
			var preText = success.dim('------->');
			var message = success(message);
			break;

		default:
			var preText = info.dim('------->');
			var message = info(message);
			break;

	}

	return gutil.log( util.format('Logging %s %s %s'), preText, message, postText ? postText : '' );
}

var gulp_src = gulp.src;
gulp.src = function() {
	return gulp_src.apply(gulp, arguments)
		.pipe(plumber(function(error) {
			// Output an error message
			log('Error (' + info(error.plugin) + '): ' + error.message, 'error');
			// emit the end event, to properly end the task (if not SASS! (for watch task))
			if( error.plugin !== 'gulp-sass' ) {
				this.emit('end');
			}
		})
	);
};
