// Exponential Moving Average
Averager = function(alpha)
{
	this.alpha = alpha || alpha === 0 ? alpha : .5; // 0 <=> 1
	this.current = NaN;
	this.roundCurrent = NaN;
}

Averager.prototype.average = function(value)
{
	if(this.current != this.current)
		return this.current = value;
	
	return this.current += this.alpha * (value - this.current);
}

Averager.prototype.roundAverage = function(value)
{
	return this.roundCurrent = Math.round(this.average(value));
}

Averager.prototype.reset = function()
{
	this.current = NaN;
	this.roundCurrent = NaN;
}