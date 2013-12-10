startState = new State("start");
startState.shortLink = null;

startState.skip = function()
{
	return !!accessKey();
}

startState.show = function()
{
	Meteor.call("createSession", function(error, result)
	{
		if(!error && result)
		{
			startState.shortLink = result.shortLink;
			
			setAccessKey(result.accessKey);
			
			applicationView.next();
		}
		else
			applicationView.setState(errorState);
	});
}