// TODO: Convert to class so it can be instantiated multiple times

getProcessSessionState = function(callback)
{
	var processSessionState = new State("processSession");
	
	processSessionState.skip = function()
	{
		return !accessKey() || !!session;
	}
	
	processSessionState.show = function()
	{
		Meteor.call("fetchSession", accessKey(), callback || function(error, result)
		{
			if(!error)
			{
				if(result)
				{
					session = result;
					
					applicationView.next();
				}
				else
					applicationView.setState(notFoundState);
			}
			else
				applicationView.setState(errorState);
		});
	}
	
	return processSessionState;
}