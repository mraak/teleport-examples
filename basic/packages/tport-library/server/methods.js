Meteor.methods(
{ createSession: createSession
, fetchSession: fetchSession
, trackUser: trackUser
});

function createSession(startDate)
{
	var data = Teleport.http
	( Meteor.user().services.teleport
	, "POST"
	, Teleport.paths.link("now/api/v1/instant_session")
	, {data: {start_date: startDate}}
	);
	
	if(!data)
		return null;
	
	return {accessKey: data.access_key, shortLink: data.short_link};
}

function fetchSession(key)
{
	var data = Teleport.http
	( null
	, "GET"
	, Teleport.paths.link("sessions/api/v1/session_info", key)
	);
	
	if(!data)
		return null;
	
	var session = new Teleport.Session(data),
		environment = environments[key];
	
	if(!environment)
		environments[key] = environment = new Environment(_.extend
		( session
		, {accessKey: key}
		));
	else
		environment.session = _.extend(environment.session, session);
	
	return environment.session;
}

function trackUser(clientId, accessKey)
{
	var environment = environments[accessKey],
		user = Meteor.server.sessions[clientId];
	
	if(!environment || !user)
		return false;
	
	environment.trackUser(user);
	
	return true;
}