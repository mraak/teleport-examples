Template.users.helpers(
{ listUsers: function(context, options)
{
	return context.map(function(item)
	{
		return options.fn(item);
	}).join(", ");
}});

Template.users.rendered = function()
{
	
}

Template.users.users = function()
{
	return Teleport.OnlineUsers.find();
}