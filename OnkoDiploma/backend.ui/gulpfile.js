
const crypto = require("crypto")
const del = require("del")
const fs = require("graceful-fs")
const path = require("path")

const modules = require("postcss-modules")
const cssnext = require("postcss-cssnext")

const webpack = require("webpack")
const WebpackDevServer = require("webpack-dev-server")

const livereload = require("livereload")

const gulp = require("gulp")
const batch = require("gulp-batch")
const concat = require("gulp-concat")
const cssnano = require("gulp-cssnano")
const postcss = require("gulp-postcss")
const util = require("gulp-util")
const watch = require("gulp-watch")
const cached = require("gulp-cached")
const remember = require("gulp-remember")
const parcel = require("gulp-parcel")
const { CheckerPlugin } = require('awesome-typescript-loader')
var ts = require('gulp-typescript');  
var babel = require('gulp-babel');
var merge = require('merge-stream');

// var tsProject = ts.createProject('tsconfig.json');

const sequence = require("run-sequence") // !!! todo: this is a hack, remove on gulp 4 release


let release = false


gulp.task("clean", () => del(["app/index.css", "app/index.js", "src/**/*.css.ts"]))


let classCount = 0
let classNames = {}

gulp.task("css", () => {

    let result = gulp.src(['src/**/*.css'])
        .pipe(cached("css"))
        .pipe(postcss([
            cssnext,
            modules({
                generateScopedName: release ? (name, filename, css) => {
                 	const key = `${filename}!${name}`
                 	return classNames[key] || (classNames[key] = "_" + (++classCount).toString(36))
                 } : '[name]_[local]_[hash:base64:5]',
                getJSON: (cssFileName, json) => {
                    const keys = Object.keys(json)
                    const cased = keys.map(key => key.replace(/-([0-9|a-z])/gi, g => g[1].toUpperCase()))
                    const content = keys.map((key, i) => `export const ${cased[i]} = "${json[key] || ""}"`)
                    content.push(`export default { ${cased.join(", ")} }`)
                    writeToFileIfChanged(cssFileName + ".ts", content.join("\r\n"))
                }
            })
        ]))
        .pipe(remember("css"))
        .pipe(concat("index.css"))

		var antdCss = gulp.src('./node_modules/antd/dist/antd.min.css');

		result = merge(result, antdCss)
				.pipe(concat("index.css"));
		

    if (release)
        result = result.pipe(cssnano())

    return result.pipe(gulp.dest("app"))
})


const webpackConfig = (options = { entries: [], loaders: [], plugins: [] }) => ({

    entry: options.entries.concat(["./src/index.tsx"]),

    output: {
        path: path.resolve(__dirname, "app"),
        filename: "index.js"
    },

    resolve: {
        extensions: [".js", ".ts", ".tsx"]
    },

    module: {
        rules: [
            {
                test: /\.tsx?$/,
                exclude: /node_modules/,
                use: [
					'react-hot-loader/webpack', 'babel-loader', 'awesome-typescript-loader'
				  ],
            }
		]
    },
    plugins: options.plugins.concat([
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery"
        }),
		new CheckerPlugin(),
        new webpack.NormalModuleReplacementPlugin(/\.css$/, result => result.request = result.request + ".ts")
    ]).concat(release ? [
        new webpack.DefinePlugin({
            "process.env": {
                // This has effect on the bundle size, no matter how strange this looks
                "NODE_ENV": JSON.stringify("production")
            }
        }),
        new webpack.optimize.UglifyJsPlugin({
            comments: false
        })
    ] : [])
})
gulp.task("babel", cb=>{
	gulp.src('src/**/*.tsx')
	.pipe(tsProject())
	.pipe(babel({presets:["react"]}))
	.pipe(gulp.dest('app')) 
});

gulp.task("build", ["css"], cb => {
    webpack(webpackConfig(), (err, stats) => {
        if (err) throw new util.PluginError("webpack", err)
        util.log("[webpack]", stats.toString({ colors: true }))
        cb()
    })
	var file = __dirname+ "";
	var destPath = path.resolve(__dirname, "app");
})


gulp.task("build-release", ["clean"], cb => {
    release = true
    sequence("build", cb)
})

gulp.task("localization", cb =>{

});

gulp.task("run", ["css"], cb => {
    watch("src/**/*.css", batch((events, cb) => {
        events
            .on("data", (file) => {
                if (file.event !== "unlink") return
                delete cached.caches.scripts[file.path]
                remember.forget("css", file.path)
            })
            .on("end", () => gulp.start("css").on("task_stop", cb))
    }))

    const host = "localhost"
    const port = 3000

    const options = {
        contentBase: "app",
        hot: true,
        proxy: { "**": "http://localhost:7001" },
        clientLogLevel: "info",
        publicPath: "/",
        stats: {
            colors: true,
            cached: false,
            cachedAssets: false
        }
    }

    const protocol = options.https ? "https" : "http"

    const config = webpackConfig({
        entries: [
			'babel-polyfill',
            "react-hot-loader/patch",
            `webpack-dev-server/client?${protocol}://${options.public || (host + ":" + port)}`,
            "webpack/hot/dev-server"
        ],
        loaders: ["react-hot-loader/webpack"],
        plugins: [
            new webpack.HotModuleReplacementPlugin(),
            new webpack.NamedModulesPlugin(),
            new webpack.NoEmitOnErrorsPlugin(),
            new AppendTextPlugin("index.js", `
    document.write('<script src="${protocol}://${host}:35729/livereload.js?snipver=1"></script>');
`)
        ]
    })
    config.devtool = "eval"
    config.output.pathinfo = true

    livereload.createServer({
        https: options.https,
        exts: ["css"]
    }).watch(path.resolve(__dirname, "app"))

    new WebpackDevServer(webpack(config), options)
        .listen(port, host, (err) => {
            if (err) throw new util.PluginError("webpack-dev-server", err)
            util.log("[webpack-dev-server]", `started`)
        })
})


const writeToFileIfChanged = (filename, content) => {
    try {
        if (fs.existsSync(filename)) {
            const old = fs.readFileSync(filename, "utf-8")
            const oldHash = crypto.createHash("md5").update(old).digest("hex")
            const newHash = crypto.createHash("md5").update(content).digest("hex")
            if (oldHash === newHash)
                return false
        }
        fs.writeFileSync(filename, content)
        return true
    } catch(e) {
    }
}


class AppendTextPlugin {
    constructor(filename, text) {
        this._filename = filename
        this._text = text
    }
    apply(compiler) {
        compiler.plugin("emit", (compilation, callback) => {
            const asset = compilation.assets[this._filename]
            if (asset) {
                const source = asset.source()
                asset.source = () => source + this._text
                asset.size = () => asset.source().length
            }
            callback()
        })
    }
}
