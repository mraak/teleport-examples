DateUtils = function()
{
    this.numPeriods = 4;
    this.periods =
    [ new DatePeriod(24 * 60 * 60 * 1000, "d", " day")
    , new DatePeriod(60 * 60 * 1000, "h", " hour")
    , new DatePeriod(60 * 1000, "m", " minute")
    , new DatePeriod(1000, "s", " second")
    ];
}

DateUtils.prototype.until = function(date, future, long, seconds)
{
    var difference = future - date;
    if(difference <= 0)
        return "";
    
    var period = null, count = 0, parts = [];
    
    for(var i = 0, n = seconds ? this.numPeriods : this.numPeriods - 1; i < n; ++i)
    {
        period = this.periods[i];
        
        if((count = Math.floor(difference / period.timestamp)) != 0)
        {
            difference -= period.timestamp * count;
            parts.push(
            [ count
            , long ? period.long + (count > 1 ? "s" : "") : period.short
            ].join(""));
        }
    }
    
    return parts.join(", ");
}

DatePeriod = function(timestamp, short, long)
{
    this.timestamp = timestamp;
    this.short = short;
    this.long = long;
}