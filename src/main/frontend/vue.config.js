const webpack = require("webpack");
const path = require("path");
const CompressionWebpackPlugin = require("compression-webpack-plugin");
const productionGzipExtensions = ["js", "css"];
const zlib = require("zlib");
const isProduction = process.env.VUE_APP_ENV === "production";
const Timestamp = new Date().getTime();

const {CKEditorTranslationsPlugin} = require("@ckeditor/ckeditor5-dev-translations");
const {styles} = require("@ckeditor/ckeditor5-dev-utils");

function resolve(dir) {
    return path.join(__dirname, ".", dir);
}

let translationPlugin = new CKEditorTranslationsPlugin({
    language: "en",
    // Append translations to the file matching the `app` name.
    translationsOutputFile: "./js/ckeditor.js",
});

module.exports = {
    runtimeCompiler: true,
    chainWebpack: config => {
        if (isProduction) {
            // 给js和css配置版本号
            config.output.filename(`js/[name].${Timestamp}.js`).end();
            config.output.chunkFilename(`js/[name].${Timestamp}.js`).end();
        }

        const svgRule = config.module.rule("svg");

        svgRule.exclude.add(path.join(__dirname, "node_modules", "@ckeditor"));

        config.module
            .rule("cke-svg")
            .test(/ckeditor5-[^/\\]+[/\\]theme[/\\]icons[/\\][^/\\]+\.svg$/)
            .use("raw-loader")
            .loader("raw-loader");

        config.module
            .rule("bpmnlintrc")
            .test(/\.bpmnlintrc$/)
            .use("bpmnlint-loader")
            .loader("bpmnlint-loader");

        // (2.) Transpile the .css files imported by the editor using PostCSS.
        // Make sure only the CSS belonging to ckeditor5-* packages is processed this way.
        config.module
            .rule("cke-css")
            .test(/ckeditor5-[^/\\]+[/\\].+\.css$/)
            .use("postcss-loader")
            .loader("postcss-loader")
            .tap(() => {
                return {
                    postcssOptions: styles.getPostCssConfig({
                        themeImporter: {
                            themePath: require.resolve("@ckeditor/ckeditor5-theme-lark")
                        },
                        minify: true
                    })
                };
            });
    },
    transpileDependencies: ["vuetify", /ckeditor5-[^/\\]+[/\\]src[/\\].+\.js$/, "luxon", "lezer-feel"],
    configureWebpack: {
        resolve: {
            alias: {
                "@": path.resolve(__dirname, "./src"), "@i": path.resolve(__dirname, "./src/assets"),
            }
        }, plugins: isProduction ? [
            translationPlugin,// Ignore all locale files of moment.js
            new webpack.IgnorePlugin({resourceRegExp: /^\.\/locale$/, contextRegExp: /moment$/}),

            new webpack.ProvidePlugin({
                $: "jquery", jQuery: "jquery", "windows.jQuery": "jquery"
            }), new webpack.optimize.LimitChunkCountPlugin({
                maxChunks: 5,
            }, new webpack.optimize.MinChunkSizePlugin({
                minChunkSize: 100
            })), // 配置compression-webpack-plugin压缩
            new CompressionWebpackPlugin({
                algorithm: "gzip",
                test: new RegExp("\\.(" + productionGzipExtensions.join("|") + ")$"),
                threshold: 10240,
                minRatio: 0.8
            }), // 压缩成 .br 文件，如果 zlib 报错无法解决，可以注释这段使用代码，一般本地没问题，需要注意线上服务器会可能发生找不到 zlib 的情况。
            new CompressionWebpackPlugin({
                filename: "[path][base].br",
                algorithm: "brotliCompress",
                test: /\.(js|css|html|svg)$/,
                compressionOptions: {
                    params: {
                        [zlib.constants.BROTLI_PARAM_QUALITY]: 11
                    }
                },
                threshold: 10240,
                minRatio: 0.8
            })] : [
            translationPlugin,
            // Ignore all locale files of moment.js
            new webpack.IgnorePlugin({
                resourceRegExp: /^\.\/locale$/, contextRegExp: /moment$/
            }), new webpack.ProvidePlugin({
                $: "jquery", jQuery: "jquery", "windows.jQuery": "jquery"
            }), new webpack.optimize.LimitChunkCountPlugin({
                maxChunks: 5,
            }), new webpack.optimize.MinChunkSizePlugin({
                minChunkSize: 100
            })], // 开启分离 js
        optimization: {
            runtimeChunk: "single", splitChunks: {
                chunks: "all", maxInitialRequests: Infinity, minSize: 20000, cacheGroups: {
                    vendor: {
                        test: /[\\/]node_modules[\\/]/, name(module) {
                            // get the name. E.g. node_modules/packageName/not/this/part.js
                            // or node_modules/packageName
                            const match = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/);
                            const packageName = match && match[1] || "";
                            // npm package names are URL-safe, but some servers don't like @ symbols
                            return `npm.${packageName.replace("@", "")}`;
                        }
                    }
                }
            }
        }
    },
    pages: {
        index: {
            entry: "src/main.js", title: "orion automation", template: "public/index.html", filename: "index.html", // chunks: "all"
        }, mobile: {
            entry: "src/main.mobile.js", title: "orion automation", template: "public/index.html", filename: "mobile.html",
        }, viewer: {
            entry: "src/main.viewer.js", title: "orion automation", template: "public/index.html", filename: "viewer.html",
        }
    },
    publicPath: process.env.VUE_APP_ROUTER_BASE,
};
