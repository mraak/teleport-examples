trackUserState = new State("trackUser");

trackUserState.show = function()
{
	track(Meteor.connection._lastSessionId, trackUserStateCallback);
	
	var stream = Meteor.connection._stream;
	/*stream.CONNECT_TIMEOUT = 5000;
	stream.RETRY_EXPONENT = 1;
	stream.RETRY_MAX_TIMEOUT = 30000;*/
	
	stream.on("message", function(message)
	{
		message = JSON.parse(message);
		
		if(message.msg == "connected")
			track(message.session);
	});
	
	pingStream.on("ping", function(data)
	{
		pingStream.emit("pong", data);
	});
}

function track(sessionId, callback)
{
	Meteor.call("trackUser", sessionId, accessKey(), callback);
}

function trackUserStateCallback(error, result)
{
	if(!error && result)
		applicationView.next();
	else
		applicationView.setState(errorState);
}