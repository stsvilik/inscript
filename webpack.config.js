module.exports = {
    entry: "./src/inscript.js",
    output: {
        path: "./dist",
        filename: "inscript.js",
        devtoolModuleFilenameTemplate: "//[absolute-resource-path]"
    },
    devtool: "#source-map",
    module: {
        loaders: [
            {
                test: /\.js?$/,
                exclude: /node_modules/,
                loader: "babel",
                query: {
                    presets: ["es2015"]
                }
            }
        ]
    }
};
