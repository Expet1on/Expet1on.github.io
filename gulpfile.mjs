import gulp from "gulp";
import del from "del";
import formatHtml from "gulp-format-html";
import autoprefixer from "autoprefixer";
import terser from "gulp-terser";
import imagemin from "gulp-imagemin";

const resources = {
    html: "src/html/**/*.html",
    jsVendor: "src/scripts/vendor/*.js",
    less: "src/styles/**/*.less",
    static: [
        "src/assets/icons/**/*.*",
        "src/assets/fonts/**/*.{woff, woff2}"
    ],
    images: "src/assets/images/**/*.{png,jpeg,jpg,webp,gif,svg}"
};

function clean() {
    return del("dist");
}

function includeHtml() {
    return gulp
        .src("src/html/*.html")
        .pipe(plumber())
        .pipe(
            include({
                prefix: "@@",
                basepath: "@file"
            })
        )
        .pipe(formatHtml())
        .pipe(gulp.dest("dist"));
}

function style() {
    return gulp
        .src("src/styles/styles.less")
        .pipe(plumber())
        .pipe(less())
        .pipe(
            postcss([
                autoprefixer({ overrideBrowserslist: ["last 4 version"] }),
                sortMediaQueries({
                    sort: "desktop-first"
                })
            ])
        )
        .pipe(gulp.dest("dist/styles"))
        .pipe(minfy())
        .pipe(rename("styles.min.css"))
        .pipe(gulp.dest("dist/styles"));
}


function js() {
    return gulp
        .src("src/scripts/dev/*.js")
        .pipe(plumber())
        .pipe(
            include({
                prefix: "//@@",
                basepath: "@file"
            })
        )
        .pipe(gulp.dest("dist/scripts"))
        .pipe(terser())
        .pipe(
            rename(function (path) {
                path.basename += ".min";
            })
        )
        .pipe(gulp.dest("dist/scripts"));
}

function jsCopy() {
    return gulp
        .src(resources.jsVendor)
        .pipe(plumber())
        .pipe(gulp.dest("dist/scripts"));
}

function copy() {
    return gulp
        .src(resources.static, {
            base: "src"
        })
        .pipe(gulp.dest("dist/"));
}

function images() {
    return gulp
        .src(resources.images)
        .pipe(
            imagemin([
                imagemin_gifsicle({ interlaced: true }),
                imagemin_mozjpeg({ quality: 100, progressive: true}),
                imagemin_optipng({ optimizationlevel: 3})
            ])
        )
        .pipe(gulp.dest("dist/assets/images"));
}