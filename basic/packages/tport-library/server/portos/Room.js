var EventEmitter = Npm.require("events").EventEmitter;

Teleport.Clients = new Meteor.Collection("tport_clients");

Teleport.Room = function(name, userFields)
{
	this.name = name;
	this.userFields = userFields || {};
	
	this.numUsers = 0;
	this.users = {};
	
	EventEmitter.call(this);
}

Teleport.Room.prototype.__proto__ = EventEmitter.prototype;

Teleport.Room.prototype.trackUser = function(client)
{
	var user = Meteor.users.findOne(client.userId),
		service = user.services.teleport;
	
	if(!(service.id in this.users))
	{
		++this.numUsers;
		this.users[service.id] = new User(this);
	}
	
	if(!this.users[service.id].has(client))
		this.users[service.id].add(client);
}

Teleport.Room.prototype.connected = function(userId)
{
	this.emit("connected", userId);
}

Teleport.Room.prototype.disconnected = function(userId)
{
	this.emit("disconnected", userId);
}

function User(room)
{
	this.room = room;
	
	this.numClients = 0;
	this.clients = {};
}

User.prototype.has = function(client)
{
	return !!Teleport.Clients.findOne(
	{ userId: client.userId
	, clientId: client.id
	, room: this.room.name
	});
}

User.prototype.add = function(client)
{
	var userId = client.userId;
	var clientId = client.id;
	
	++this.numClients;
	this.clients[clientId] = client;
	
	Teleport.Clients.insert(_.extend({userId: userId, clientId: clientId, room: this.room.name}, this.room.userFields));
	
	console.log(userId + " with session " + clientId + " logged in - " + this.room.name);
	
	var self = this;
	
	client.socket.on("close", Meteor.bindEnvironment
	( function()
	{
		self.remove.bind(self)(clientId);
	}
	, function(error)
	{
		
	}));
	
	if(this.numClients > 1)
		return;
	
	var user = Meteor.users.findOne(userId);
	
	Teleport.OnlineUsers.insert(_.extend(user.profile, {userId: userId, room: this.room.name}));
	
	this.room.connected(userId);
}

User.prototype.remove = function(clientId)
{
	delete this.clients[clientId];
	--this.numClients;
	
	var client = Teleport.Clients.findOne({clientId: clientId});
	Teleport.Clients.remove({clientId: clientId});
	
	var userId = client.userId;
	
	console.log(userId + " with session " + clientId + " logged out - " + client.room);
	
	if(this.numClients > 0)
		return;
	
	var user = Meteor.users.findOne(userId),
		service = user.services.teleport;
	
	this.room.disconnected(userId);
	
	delete this.room.users[service.id];
	--this.room.numUsers;
	
	Teleport.OnlineUsers.remove({userId: userId, room: client.room});
	// Meteor.users.remove(userId);
}