Accounts.registerLoginHandler(function(options)
{
	var authToken = options.authToken,
		guestName = options.guestName;
	
	var data = guestName ? createUser(guestName) : fetchUser(authToken);
	
	if(!data)
		return null;
	
	if(!authToken)
		authToken = data.username;
	
	var serviceName = "teleport";
	var serviceData = {id: data.id, username: data.username, apiKey: data.api_key};
	var userData = {profile: {name: data.name, avatar: data.avatar, anonymous: data.is_anonymous}};
	
	var selector = {};
	var serviceIdKey = "services." + serviceName + ".id";
	
	selector[serviceIdKey] = serviceData.id;
	
	var user = Meteor.users.findOne(selector);
	
	var token = {token: authToken, when: new Date().getTime()};
	
	if(user)
	{
		var setAttrs = {};
		_.each(serviceData, function(value, key)
		{
			setAttrs["services." + serviceName + "." + key] = value;
		});
		
		Meteor.users.update(user._id,
		{ $set: setAttrs
		, $push: {"services.resume.loginTokens": token}
		});
		
		return {id: user._id, token: authToken};
	}
	
	user = {services: {resume: {loginTokens: [token]}}};
	user.services[serviceName] = serviceData;
	
	return _.extend(Accounts.insertUserDoc(userData, user), {token: authToken});
});

function fetchUser(authToken)
{
	return Teleport.http
	( null
	, "GET"
	, Teleport.paths.link("auth/session", "?sessionid=" + authToken)
	);
}

function createUser(guestName)
{
	var data = Teleport.http
	( null
	, "POST"
	, Teleport.paths.link("api/v1/auth/anonymous")
	, {data: {first_name: guestName}}
	);
	
	if(!data)
		return null;
	
	return _.extend(data, {name: guestName, avatar: "/default-avatar.png", is_anonymous: true});
}