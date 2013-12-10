// IE...
if(!location.origin)
	location.origin = location.protocol + "//" + location.hostname;

Meteor.Router.add(
{ "/:accessKey": "application"
, "/": "application"
, "*": "notFound"
});

var _accessKey = null;

// Globals
dateUtils = new DateUtils;
session = null;
authToken = null;

Teleport.room = accessKey = function()
{
	return location.pathname.replace(/\//g, "");
}

setAccessKey = function(value)
{
	if(!value)
		session = null;
	
	history.replaceState({}, document.title, location.origin + "/" + (value || ""));
}

profile = function()
{
	var user = Meteor.user();
	
	if(!user)
		return null;
	
	return user.profile;
}

anonymous = function()
{
	var user = profile();
	
	if(!user)
		return false;
	
	return user.anonymous;
}

leave = function()
{
	if(anonymous() || instantSession())
		return Teleport.paths.home();
	
	return Teleport.paths.sessionDetails(session.id);
}

owner = function()
{
	var user = Meteor.user();
	
	if(!session || !user)
		return false;
	
	return user.services.teleport.id == session.owner.id;
}

instantSession = function()
{
	if(!session)
		return false;
	
	return session.instantSession;
}

shortLink = function()
{
	if(!session)
		return startState.shortLink;
	
	return session.shortLink;
}

// Links
Handlebars.registerHelper("link", Teleport.paths.link);
Handlebars.registerHelper("domain", Teleport.paths.domain);
Handlebars.registerHelper("home", Teleport.paths.home);
Handlebars.registerHelper("sessionDetails", Teleport.paths.sessionDetails);
Handlebars.registerHelper("login", Teleport.paths.login);
Handlebars.registerHelper("logout", Teleport.paths.logout);
Handlebars.registerHelper("register", Teleport.paths.register);
Handlebars.registerHelper("leave", leave);

// Data
Handlebars.registerHelper("owner", owner);
Handlebars.registerHelper("accessKey", accessKey);
Handlebars.registerHelper("shortLink", shortLink);
Handlebars.registerHelper("session", function() { return session; });
Handlebars.registerHelper("instantSession", instantSession);
Handlebars.registerHelper("profile", profile);
Handlebars.registerHelper("anonymous", anonymous);

Handlebars.registerHelper("maxParticipants", function()
{
	return session ? session.maxParticipants : 3;
});

Handlebars.registerHelper("instantSessionDuration", function()
{
	return session ? session.duration / 60 : 60;
});