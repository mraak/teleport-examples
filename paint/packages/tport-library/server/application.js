process.env.NODE_ENV = "production";

Future = Npm.require("fibers/future");

RavenLogger.initialize({server: "http://86a64bffb4bf4a268487bcaa5f720669:de4fcc9b326b48e4a0118872a2fd1a2e@sentry.teleporthq.com/5"});

environments = {};

Teleport.http = function(service, method, path, data)
{
	if(service)
	{
		var headers = {Accept: "application/json", Authorization: "ApiKey " + service.username + ":" + service.apiKey};
		
		if(data)
			data.headers = data.headers ? _.extend(data.headers, headers) : headers;
		else
			data = {headers: headers};
	}
	
	var future = new Future;
	
	HTTP.call(method, path, data, function(error, result)
	{
		if(error)
			RavenLogger.log(error.message);
		
		future.return(!error ? result.data || true : null);
	});
	
	return future.wait();
}

Environment = function(session)
{
	this.session = session;
	
	this.room = new Teleport.Room(session.accessKey);
	this.pinger = new Pinger(session.accessKey);
	
	this.room.on("connected", this.userConnected.bind(this));
	this.room.on("disconnected", this.userDisconnected.bind(this));
}

Environment.prototype.trackUser = function(client)
{
	this.room.trackUser(client);
}

Environment.prototype.userConnected = function(userId)
{
	this.pinger.add(userId);
}

Environment.prototype.userDisconnected = function(userId)
{
	this.pinger.remove(userId);
}