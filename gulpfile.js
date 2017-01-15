/**
 * Gulpfile create to make developing this framework easier.
 * Do not touch anything below here unless you know what you're doing.
 * 
 * Available CLI commands:
 * gulp - Run default task: shortcut of `gulp watch`
 * gulp watch - Run watch task: compiling SASS, starting BrowserSync, watching for file changes
 * gulp build - Run build task: compiling SASS, concatenates and minifies all css and javascript files, compresses images, moves everything to `dist` directory
 * gulp sass - Run sass task: compile SASS
 * gulp autoprefix:test - Run autoprefix task: autoprefix compiled css in the `css` directory and sends to the `test` directory
 * gulp concat:css - Run concat:css task: Concatenates and minifies the css files from the `tmp` directory to `dist`
 *
 * Author: Saborknight
 * Version: 1.0.1
 */
/**
 * User Variables
 * Use these instead of editing in the actual code
 */
confName = 'framework'; // Will be used in url and references

devDir = 'src';
buildDir = 'dist';
tempDir = 'tmp';

confSSL = false;

/**
 * System Variables
 * Do not touch unless you know what you're doing
 */
var fs = require('fs');
var util = require('util');
var browserSync = require('browser-sync').create(confName);
var del = require('del');
var gulp = require('gulp');
var map = require('map-stream');
var autoprefixer = require('gulp-autoprefixer');
var cache = require('gulp-cache');
var cssnano = require('gulp-cssnano');
var gulpIf = require('gulp-if');
var imagemin = require('gulp-imagemin');
var plumber = require('gulp-plumber');
var sass = require('gulp-sass');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
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
		['css', 'images'],
		callback);
});

gulp.task('watch', ['browserSync', 'sass'], function() {
	gulp.watch(globDeclaration('.scss', 'sass'), ['sass'])
	gulp.watch(globDeclaration('.html'), browserSync.reload)
	gulp.watch(globDeclaration('.js', 'js'), browserSync.reload)
});

gulp.task('sass', function() {
	var sassDir = globDeclaration('.scss', 'Setting-Elements');

	log('Compiling [sass] from: ' + sassDir, 'info');

	return gulp.src( sassDir )
		.pipe(sass()) // Using gulp-sass
		.pipe(gulp.dest(devDir + '/css'))
		.pipe(browserSync.reload({
			stream: true
		}));
});

gulp.task('css', function() {
	runSequence('sass', 'autoprefix', 'concat:css', 'clean:temp');
});

gulp.task('autoprefix', function() {
	var dir = tempDir;
	log('Autoprefixing to: ' + dir, 'info');

	return gulp.src( globDeclaration('.css', 'css') )
		// .pipe(map(streamLog))
		.pipe(autoprefixer({
			browsers: ['> 0%']
		}))
		.pipe(gulp.dest( dir === tempDir ? tempDir + '/css' : dir ));
});

gulp.task('autoprefix:test', function() {
	var dir = devDir + '/test';
	log('Autoprefixing to: ' + dir, 'info');

	return gulp.src( globDeclaration('.css', 'css') )
		// .pipe(map(streamLog))
		.pipe(autoprefixer({
			browsers: ['> 0%']
		}))
		.pipe(gulp.dest( dir === tempDir ? tempDir + '/css' : dir ));
});

gulp.task('browserSync', function() {
	browserSync.init({
		server: { baseDir: devDir },
		tunnel: confTunnel,
		reloadOnRestart: true,
		port: 8010
	});
});

gulp.task('concat:css', function(){
	var dir = globDeclaration('.css', false, tempDir);
	dir.push( '!' + devDir + '/bin/**/*.*' );

	log('Concatenating from: ' + dir, 'info');
	return gulp.src( dir )
		.pipe(concat('framework.min.css'))
		// Minifies only if it's a JavaScript file
		.pipe(gulpIf('*.js', uglify()))
		// Minifies only if it's a CSS file
		.pipe(gulpIf('*.css', cssnano()))
		.pipe(gulp.dest(buildDir))
});

gulp.task('concat:js', function(){
	var dir = globDeclaration('.js', false, tempDir);
	dir.push( '!' + devDir + '/bin/**/*.*' );

	log('Concatenating from: ' + dir, 'info');
	return gulp.src( dir )
		.pipe(concat('framework.min.js'))
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

gulp.task('clean:temp', function() {
	if( tempDir !== null /*&& fs.access( tempDir, (err) => {err ? false : true})*/ ) {
		log('Cleaning directory: ' + tempDir);
		setTimeout( function() {
			return del.sync( tempDir );
		}, 100);
		// return del.sync(tempDir);
	} else {
		log('Nothing in temp to clean', 'info');

		return;
	}
});

gulp.task('clean:test', function() {
	var dir = devDir + '/test';

	// fs.access( devDir, (err) => { log(err ? 'false' : 'true');});

	if( dir !== null /*&& fs.access( dir, (err) => {err ? return false : return true})*/ ) {
		log('Cleaning directory: ' + dir);

		return del.sync(dir);
	} else {
		log('Nothing in temp to clean', 'info');

		return;
	}
});

gulp.task('cache:clear', function (callback) {
	return cache.clearAll(callback);
});

/**
 * Utility Functions. Do not touch anything below here unless you know what you're doing
 *
 * Author: Saborknight
 */
function globDeclaration(fileType, folder = false, rootDir = devDir) {
	srcGlob = [util.format('%s/%s**/*%s', rootDir, folder ? folder +'/' : '', fileType),
		util.format('!%s/%s**/*-OLD*%s', rootDir, folder ? folder +'/' : '', fileType)];

	return srcGlob;
}

// This is purely for logs being piped with data
var streamLog = function(file, callback) {
	var message = 'Autoprefixing files: ' + file.path;
	log(message);
	callback(null, file);
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
