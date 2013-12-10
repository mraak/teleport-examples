errorState = new State("error");

errorState.skip = function()
{
	return true;
}

Template.error.events =
{ "click button": tryAgain
};

function tryAgain()
{
	applicationView.back();
}