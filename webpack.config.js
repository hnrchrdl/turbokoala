var path = require('path');
var webpack = require('webpack');

module.exports = {
	context: __dirname + "/client",
	entry: "./index.js",
	output: {
		path: __dirname + '/public',
		filename: "bundle.js"
	},
	resolve: {
    	root: [path.resolve('./node_modules'), path.resolve('./')],
    	extensions: ['', '.js', 'ts', 'tsx'],
    	alias: {
    		'net': 'net-browserify' // this is for using net in the browser
    	}
  	},
	module: {
		loaders: [
			{ 	
				test: /\.js$/, 
				exclude: /(node_modules|bower_components)/,
				loader: 'babel-loader',
				query: {
        			presets: ['es2015']
      			} 
			},
			{ test: /\.css$/, loader: "style!css" },
			{ test: /\.scss$/, loaders: ["style", "css", "sass"] },
			{ test: /\.less$/, loaders: ["style", "css", "less"] },
			{ test: /\.json$/, loader: 'json-loader' },
			{ test: /\.html$/, loader: "html" },
			{ test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "url-loader?limit=10000&mimetype=application/font-woff" },
      		{ test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "file-loader" },
      		{ test: /\.tsx?$/, loader: 'webpack-typescript?target=ES5&jsx=react' }
		]
	},
	node: {
    	console: 'empty',
    	fs: 'empty',
    	net: 'empty',
    	tls: 'empty'
    },
    plugins: [
    // new CommonsChunkPlugin({ name: 'vendor', filename: 'vendor.bundle.js', minChunks: Infinity }),
    // // static assets
    // new CopyWebpackPlugin([{ from: 'src/assets', to: 'assets' }]),
    // // generating html
    // new HtmlWebpackPlugin({ template: 'src/index.html', inject: false }),
    // // replace
    // new DefinePlugin({
    //     'process.env': {
    //         'ENV': JSON.stringify(metadata.ENV),
    //         'NODE_ENV': JSON.stringify(metadata.ENV)
    //     }
    // }),
    new webpack.ProvidePlugin({    // <added>
        jQuery: 'jquery',
        $: 'jquery',
        jquery: 'jquery'   // </added>
    })
],
};