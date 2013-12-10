Meteor.publish("users", function(room)
{
	return Teleport.OnlineUsers.find({room: room});
});

Meteor.publish("app_state", function(room)
{
	return Teleport.AppState.find({room: room});
});

Meteor.publish("app_snap", function(room)
{
	return Teleport.AppSnap.find({room: room});
});

Meteor.publish(null, function()
{
	if(this.userId)
		return Meteor.users.find({_id: this.userId}, {fields: {profile: 1, "services.teleport": 1}});
	
	return null;
}, {is_auto: true});