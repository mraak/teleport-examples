Meteor.startup(function()
{
	Teleport.Clients.remove({});
	Teleport.OnlineUsers.remove({});
	// Meteor.users.remove({});
});