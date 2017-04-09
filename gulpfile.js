var gulp = require('gulp');
var pug = require('gulp-pug');
var less = require('gulp-less');
var postcss = require('gulp-postcss');
var myth = require('gulp-myth');
var sourcemaps = require('gulp-sourcemaps');


function wrapPipe(taskFn) {
  return function(done) {
    var onSuccess = function() {
      done();
    };
    var onError = function(err) {
      done(err);
    }
    var outStream = taskFn(onSuccess, onError);
    if(outStream && typeof outStream.on === 'function') {
      outStream.on('end', onSuccess);
    }
  }
}

var path = {
	build:{
		html:'public/',
		css:'public/css/',
		js:'public/js/',
		lib:'public/libs',
		assets:'public/assets',
	},
	src:{
		pug:'src/pug/**/*.pug',
		exceptpug:'!src/pug/**/_*.pug',
		less:'src/less/*.less',
		js:'src/js/**/*.js',
		lib:'src/libs/**/*.*',
		assets:'src/assets/**/*.*'
	},
	watch:{
		pug:'src/pug/**/*.pug',
		less:'src/less/**/*.less',
		js:'src/js/**/*.js',
	}
};

gulp.task('lib', function(){
	return gulp.src(path.src.lib)
			.pipe(gulp.dest(path.build.lib));
});

gulp.task('watch', function(){
	gulp.run('css');
	gulp.run('pug');
	gulp.run('js');
	gulp.run('lib');
	gulp.run('assets');

	gulp.watch(path.watch.pug, function(){
		gulp.run('pug');
	});

	gulp.watch(path.watch.js, function(){
		gulp.run('js');
	});

	gulp.watch(path.watch.less, function(){
		gulp.run('css');
	});


	gulp.watch(path.watch.lessAdmin, function(){
		gulp.run('css-admin');
	});
});

gulp.task('css', wrapPipe(function(success, error){
	return gulp.src(path.src.less)
			.pipe(sourcemaps.init().on('error', error))
			.pipe(less().on('error', error))
			.pipe(myth().on('error', error))
			// .pipe(cssminify().on('error', error))
			.pipe(sourcemaps.write('.').on('error', error))
			.pipe(gulp.dest(path.build.css));
}));

gulp.task('js', wrapPipe(function(success, error){
	return gulp.src(path.src.js)
			.pipe(sourcemaps.init().on('error', error))
			// .pipe(uglify().on('error', error))
			.pipe(sourcemaps.write('.').on('error', error))
			.pipe(gulp.dest(path.build.js));
}));

gulp.task('pug', wrapPipe(function(success, error){
	return gulp.src([path.src.pug, path.src.exceptpug])
			.pipe(sourcemaps.init().on('error', error))
			.pipe(pug({
				pretty:true
			}).on('error', error))
			// .pipe(htmlmin({collapseWhitespace:true}).on('error', error))
			.pipe(sourcemaps.write('.').on('error', error))
			.pipe(gulp.dest(path.build.html));
}));

gulp.task('assets', function(){
	return gulp.src(path.src.assets)
			.pipe(gulp.dest(path.build.assets));
});

gulp.task('build', function(){
	gulp.run('js-build');
	gulp.run('css-build');
	gulp.run('pug-build');
	gulp.run('build-lib');
});
