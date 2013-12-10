Teleport.templateName = "app";

Teleport.readyCallback = function()
{
	
};

Teleport.appStateAddedCallback = function(item)
{
	if(item.action == "change")
	{
		$("#" + item.changed).attr("checked", item.value);	
	}
	else if (item.action == "reset")
	{
		$(".chk").attr("checked", false);
	}
	
};

Teleport.createAppSnapCallback = function()
{
   	Teleport.AppSnap.insert({room: Teleport.room(), score: 0, chkState: [false, false, false]});
};

Teleport.appSnapChangedCallback = function(snap)
{
	$("#score").html(snap.score);
};

Teleport.appSnapInitializedCallback = function(snap)
{
	$("#chk1").attr("checked", snap.chkState[0]);
	$("#chk2").attr("checked", snap.chkState[1]);
	$("#chk3").attr("checked", snap.chkState[2]);
};


/////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// UI CODE
//
/////////////////////////////////////////////////////////////////////////////////////////////////////////



// detect events on UI and send to server

Template.tool.events({

    'click .chk': function (e) {
      var id = $(e.target).attr("id");
      var val = $(e.target).attr("checked") ? true : false;
      console.log("changed", id, val);

      Teleport.AppState.insert({
      	room:Teleport.room(),
      	action: "change",
      	changed: id,
      	value: val

      });

      // set the snapshot values
      var snap = Teleport.AppSnap.findOne();
      var score = ++snap.score;
      
      chkState = [$("#chk1").attr("checked") ? true : false, $("#chk2").attr("checked") ? true : false, $("#chk3").attr("checked") ? true : false];
      Teleport.AppSnap.update({_id: snap._id}, {$set:{score: score, chkState:chkState}});


    },

    'click #btnReplay': function(e){
    	Teleport.AppState.insert({
      	room:Teleport.room(),
      	action: "reset"

      });

      var snap = Teleport.AppSnap.findOne();
      Teleport.AppSnap.update({_id: snap._id}, {$set:{
      	score: 0
      }});
    }

    
 });