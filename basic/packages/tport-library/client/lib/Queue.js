Queue = function(queue)
{
	this.queue = queue;
	this.i = 0;
}

Queue.prototype.hasNext = function()
{
	return this.i < this.queue.length;
}

Queue.prototype.next = function()
{
	this.queue[this.i++].apply(this, arguments);
}

Queue.prototype.start = function()
{
	this.next.apply(this, arguments);
}