loginState = new State("login");

loginState.skip = function()
{
	if(!Meteor.user())
		return false;
	
	if(accessKey() && !instantSession() && anonymous())
		return false;
	
	if(authToken)
		return authToken == localStorage.getItem("Meteor.loginToken");
	
	return anonymous();
}

loginState.show = function()
{
	loginView.first();
}

loginState.hide = function()
{
	guestState.guestName = null;
	
	loginView.setState(null);
}

var events =
{ "submit form": submitHandler
};

// States
var guestState = new State("guest");
guestState.guestName = null;

guestState.skip = function()
{
	if(accessKey() && !instantSession())
		return true;
	
	return !!authToken || anonymous();
}

var waitingState = new State("waiting");

waitingState.show = function()
{
	if(Meteor.user())
		Meteor.logout(function(error)
		{
			if(!error)
				loginUser();
			else
				applicationView.setState(errorState);
		});
	else
		loginUser();
}

function loginUser()
{
	Accounts.callLoginMethod(
	{ methodArguments: [{authToken: authToken, guestName: guestState.guestName}]
	, userCallback: function(error)
	{
		if(!error)
			applicationView.next();
		else if(error.message == "No result from call to login")
		{
			if(accessKey() && !instantSession())
				loginView.next();
			else
				loginView.setState(guestState);
		}
		else
			applicationView.setState(errorState);
	}});
}

var loginRequired = new State("loginRequired");

var loginView = new View("login", [guestState, waitingState, loginRequired], events);

// Event handlers
function submitHandler(e)
{
	e.preventDefault();
	
	var name = $("#guestName").val();
	
	if(!name)
		return;
	
	guestState.guestName = name;
	loginView.next();
}