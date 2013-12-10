var fs = Npm.require("fs"),
	path = Npm.require("path");

// We set PATH so that Meteor's node.js binary is used when compiling dependencies and not system's
//process.env.PATH = path.dirname(process.argv[0]) + ':' + process.env.PATH;

// PKG_CONFIG_PATH for Mac OS X
//process.env.PKG_CONFIG_PATH = (process.env.PKG_CONFIG_PATH ? process.env.PKG_CONFIG_PATH + ':' : '') + '/opt/X11/lib/pkgconfig';

function iterate(currentPath)
{
	var folders = [],
		files = [],
		main = null;
	
	currentPath = path.resolve(currentPath);
	
	fs.readdirSync(currentPath).forEach(function(file)
	{
		var item = path.normalize(path.join(currentPath, file));
		
		if(file == "lib")
			Array.prototype.unshift.apply(folders, iterate(item));
		else if(file == "main.js")
			main = item;
		else if(fs.lstatSync(item).isDirectory())
			Array.prototype.push.apply(folders, iterate(item));
		else
			files.push(item);
	});
	
	if(main)
		files.push(main);
	
	Array.prototype.push.apply(folders, files);
	
	return folders;
}

Package.describe(
{ summary: "Teleport Library"
});

Package.on_use(function(api)
{
	api.use(["templating", "jquery", "handlebars", "less"], "client");
	api.use(["underscore", "accounts-base", "deps", "router", "streams", "raven"], ["client", "server"]);
	api.use(["http"], "server");
	
	api.add_files(iterate("packages/tport-library/lib"), ["client", "server"]);
	
	api.add_files(iterate("packages/tport-library/client"), "client");
	
	api.add_files(iterate("packages/tport-library/server"), "server");
	
	api.export("Teleport");
});