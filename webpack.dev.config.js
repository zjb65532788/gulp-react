var webpack = require('webpack'),
	fs=require('fs'),
	path=require('path');

var entryPath="./src/entrys";
var outputPath="./dist";

var entrys= fs.readdirSync(entryPath).reduce(function (o, filename) {
    /\.js$/g.test(filename) &&
    (o[filename.replace(/\.js$/g,'')] = entryPath+'/'+filename);
    return o;
  }, {}
);
var autoprefixer = require('autoprefixer');

//entrys['vendors']=['vue']//一些公用的vue啊 等等。
entrys['vendors']=['./src/data/domain.dev.js'];
entrys['react']=['es5-shim','es5-shim/es5-sham','console-polyfill','es6-promise','fetch-detector','fetch-ie8','react','react-dom','react-redux'];
//entrys['vue']=['vue','vue-router'];
module.exports={
	entry:entrys,
	output:{
		publicPath:"../newchunks",//相应的域名哦 如 "http://localhost"
		path: outputPath,//目标文件夹
		filename: 'oldjs/[name].js',
		chunkFilename: '/chunks/[hash].[name].chunk.js'//一些异步加载的会打包在这里哦
	},
	resolve: {
		alias: {
	        react: path.join(__dirname, 'node_modules/react/dist/react.min.js'),
	        'react-dom': path.join(__dirname, 'node_modules/react-dom/dist/react-dom.min.js'),
	        vue:path.join(__dirname,'node_modules/vue/dist/vue.min.js')
	    },
	  	extensions: ['', '.js', 'jsx','.vue'],//是可以忽略的文件后缀名，比如可以直接require('Header');而不用加.js。
	},
	module:{
		noParse:[path.join(__dirname, 'node_modules/react/dist/react.min.js'),path.join(__dirname,'node_modules/vue/dist/vue.min.js'),path.join(__dirname, 'node_modules/react-dom/dist/react-dom.min.js')],
		loaders: [//所依赖的模块解析器
			{ test: /\.vue$/, loader: 'vue' },
			{//es6咯 毕竟浏览器解析不了es6 所以需要解析器解析成es5 就先只用这个咯。
		        test: /(\.js)$/,
		        loader: 'babel',
		        query: {
					presets: ['es2015','react','stage-0']
				}
		    },
			{//解析less咯
				test: /\.less$/,
				loader: 'style-loader!css-loader!postcss-loader!less-loader'
			}, // use ! to chain loaders
			{//解析css 咯
				test: /\.css$/,
				loader: 'style-loader!css-loader!postcss-loader'
			}, 
      		{ //web字体库什么的咯
      			test: /\.(woff|svg|eot|ttf)\??.*$/, 
      			loader: 'url-loader?limit=10&name=/../images/font/[name].[ext]'},
      		{//图片哈
				test: /\.(png|jpg)$/,
				loader: 'url-loader?limit=8192&name=[path][name].[ext]'
			} // inline base64 URLs for <=8k images, direct URLs for the rest

		]
	},
	postcss:[autoprefixer()],
	plugins: [
        // kills the compilation upon an error.
        // this keeps the outputed bundle **always** valid
        new webpack.NoErrorsPlugin(),
        //这个使用uglifyJs压缩你的js代码
        new webpack.optimize.UglifyJsPlugin({minimize: true}),
        new webpack.DefinePlugin({
		  	"process.env": { 
		    	NODE_ENV: JSON.stringify("production") 
		   	}
		}),
        //new webpack.optimize.CommonsChunkPlugin('vendors', '/js/vendors.js'),
        new webpack.optimize.CommonsChunkPlugin({
            name: ["vendors",'react',"load"],
            minChunks: 2
        })
        /*new webpack.optimize.CommonsChunkPlugin({
            name: "reactbagnew",
            chunks: ["reactbag", "index",'iehacknew'],
            minChunks: 2
        })*/
    ]
}