authenticationState = new State("authentication");
authenticationState.timeoutId = 0;

authenticationState.show = function()
{
	addEventListener("message", messageHandler, false);
	
	this.timeoutId = setTimeout(timeoutHandler, 1000);
}

authenticationState.hide = function()
{
	clearTimeout(this.timeoutId);
	
	removeEventListener("message", messageHandler);
}

// Event handler
function messageHandler(e)
{
	var data = e.data;
	
	if("authToken" in data)
	{
		authToken = data.authToken;
		
		applicationView.next();
	}
	else
		applicationView.setState(errorState);
}

function timeoutHandler()
{
	applicationView.next();
}