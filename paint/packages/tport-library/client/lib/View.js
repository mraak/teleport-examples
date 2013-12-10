View = function(template, states, events)
{
	this.template = template;
	this.id = template + "State";
	this.states = states;
	
	this.state = null;
	this.stack = [];
	
	if(events)
		Template[template].events = events;
	
	var helpers = {},
		s = null;
	
	for(var i = 0, n = states.length; i < n; ++i)
	{
		s = states[i];
		s.index = i;
		
		helpers[s.name] = _.bind(function()
		{
			return Session.equals(this.id, this.state.name)
		}, {id: this.id, state: s});
	}
	
	Template[template].helpers(helpers);
	
	Template[template].created = _.bind(function()
	{
		this.first();
		
		// console.log(this.template, this.state.name, "created");
	}, this);
	
	Template[template].rendered = _.bind(function()
	{
		if(this.state.visible)
			return;
		
		this.state.visible = true;
		
		this.state.show && this.state.show();
		
		// console.log(this.template, this.state.name, "rendered");
	}, this);
	
	Template[template].destroyed = _.bind(function()
	{
		// console.log(this.template, this.state ? this.state.name : null, "destroyed");
		
		this.setState(null);
	}, this);
}

View.prototype.setState = function(value, back)
{
	if(value === this.state)
		return;
	
	if(this.state)
	{
		this.state.hide && this.state.hide();
		
		this.state.visible = false;
		
		if(!back)
			this.stack.push(this.state);
	}
	
	this.state = value;
	
	Session.set(this.id, value ? value.name : null);
}

View.prototype.first = function()
{
	var i = 0,
		s = null;
	
	while(s = this.states[i++])
		if(!s.skip || !s.skip())
			break;
	
	this.setState(s);
}

View.prototype.next = function()
{
	if(!this.state)
		return;
	
	var i = this.state.index,
		s = null;
	
	while(s = this.states[++i])
		if(!s.skip || !s.skip())
			break;
	
	this.setState(s);
}

View.prototype.back = function()
{
	var value = this.stack.pop();
	
	if(value)
		this.setState(value, true);
	else
		this.first();
}

View.prototype.retry = function()
{
	this.state.hide && this.state.hide();
	this.state.show && this.state.show();
}

State = function(name)
{
	this.name = name;
	
	this.skip = null;
	this.show = null;
	this.hide = null;
	this.index = 0;
}