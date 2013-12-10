toolState = new State("tool");

toolState.show = function()
{
	toolView.first();
}

toolState.hide = function()
{
	toolView.setState(null);
}

var initialized = false;

// Subscriptions
var usersSubscription = null;
var appStateSubscription = null;
var appSnapSubscription = null;

// States
var mainState = new State("main");

mainState.show = function()
{
	usersSubscription = Meteor.subscribe("users", accessKey());
	appStateSubscription = Meteor.subscribe("app_state", accessKey());
	appSnapSubscription = Meteor.subscribe("app_snap", accessKey(), appSnapSubscribed);
	
	Teleport.AppState.find().observe({added: function(item)
	{
		if(initialized)
		{
			console.log("added", item.action);
			
			Teleport.appStateAddedCallback && Teleport.appStateAddedCallback(item);
		}
	}});
	
	Teleport.readyCallback && Teleport.readyCallback();
}

mainState.hide = function()
{
	usersSubscription.stop();
	usersSubscription = null;
	
	appStateSubscription.stop();
	appStateSubscription = null;
	
	appSnapSubscription.stop();
	appSnapSubscription = null;
}

toolView = new View("tool", [mainState]);

Template.tool.helpers({view: function()
{
	if(Teleport.templateName && Template[Teleport.templateName])
		return new Handlebars.SafeString(Template[Teleport.templateName](this));
}});

Teleport.readyCallback = null;
Teleport.appStateAddedCallback = null;
Teleport.createAppSnapCallback = null;
Teleport.appSnapChangedCallback = null;
Teleport.appSnapInitializedCallback = null;

var appSnapSubscribed = function()
{
	var snap = Teleport.AppSnap.findOne();
	console.log('appSnapSubscribed',snap);

	if(!snap)
	{
		// i am the first to open the app right now
		console.log("CREATING SNAP");
		
		Teleport.createAppSnapCallback && Teleport.createAppSnapCallback();
		
		initialized = true;
	}
}
  
// initial setup and creation of snapshot
Deps.autorun(function()
{
	console.log("AUTORUN");
	
	var snap = Teleport.AppSnap.findOne();
	Teleport.AppState.findOne();
	
	if(!appSnapSubscription)
		return;
	
	Teleport.appSnapChangedCallback && Teleport.appSnapChangedCallback(snap);
	
	if(!initialized)
	{
		Teleport.appSnapInitializedCallback && Teleport.appSnapInitializedCallback(snap);
		
		initialized = true;
	}
});