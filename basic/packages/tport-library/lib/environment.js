Teleport = {};

Teleport.version = "0.2.0";

Teleport.server = Meteor.settings.public.server;

Teleport.OnlineUsers = new Meteor.Collection("tport_users");
Teleport.AppState = new Meteor.Collection("app_state");
Teleport.AppSnap = new Meteor.Collection("app_snap");

Teleport.paths =
{ link: link
, domain: function() { return Teleport.server; }
, home: function() { return Teleport.server + "/"; }
, sessionDetails: function(key) { return Teleport.paths.link("sessions", key); }
, meet: function(key) { return Teleport.paths.link("meet", _.isString(key) ? key : accessKey()); }
, login: function() { return Teleport.paths.link("accounts/login", "?next=" + encodeURIComponent(location)); }
, logout: function() { return Teleport.paths.link("accounts/logout", "?next=" + encodeURIComponent(location)); }
, register: function()
{
	var user = Meteor.user();
	
	if(!user)
		return Teleport.paths.link("accounts/register", "?next=" + encodeURIComponent(location));
	
	return Teleport.paths.link("accounts/register", "?next=" + encodeURIComponent(location) + "&anonymous=" + user.services.teleport.username);
}
};

pingStream = new Meteor.Stream("ping");

function link()
{
	var args = _.toArray(arguments),
		last = args.pop(),
		result = ([Teleport.server].concat(args).join("/") + "/").replace(/\/\/$/, "/");
	
	if(last)
	{
		last = last.toString();
		
		if(last.indexOf("?") < 0)
			result += last + "/";
		else
			result += last;
	}
	
	return result;
}

Teleport.Session = function(data)
{
	if(!data)
		return;
	
	var participants = [];
	for(var i = 0, n = data.participants.length; i < n; ++i)
		participants.push(data.participants[i].id);
	
    this.id = data.id;
    this.name = data.name;
    this.owner = data.owner;
    this.status = data.status_name;
    this.type = data.type;
	this.instantSession = data.type == "instant session";
    this.statusCode = data.status;
    this.createdAt = new Date(data.created_at);
    this.startDate = new Date(data.start_date);
    this.endDate = new Date(data.end_date);
    this.duration = data.duration;
    this.accessNumber = data.access_number;
    this.participants = participants;
    this.guests = data.guests;
	this.shortLink = data.short_link;
	this.mode = data.mode;
	this.maxParticipants = data.max_participants;
}