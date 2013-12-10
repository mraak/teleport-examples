Teleport.templateName = "app";

////////////////////////////////////////////////////////////////////////////////////////////////////
//
//  TELEPORT CALLBACKS
//
////////////////////////////////////////////////////////////////////////////////////////////////////

Teleport.readyCallback = function()
{
	/*if (window.top != window) {
      document.getElementById("header").style.display = "none";
  }*/
  canvas = document.getElementById("drawCanvas");
  index = 0;
  colors = ["#828b20", "#b0ac31", "#cbc53d", "#fad779", "#f9e4ad", "#faf2db", "#563512", "#9b4a0b", "#d36600", "#fe8a00", "#f9a71f"];

  //check to see if we are running in a browser with touch support
  stage = new createjs.Stage(canvas);
  stage.autoClear = false;
  stage.enableDOMEvents(true);

  createjs.Touch.enable(stage);
  createjs.Ticker.setFPS(24);

  drawingCanvas = new createjs.Shape();

  stage.addEventListener("stagemousedown", handleMouseDown);
  stage.addEventListener("stagemouseup", handleMouseUp);

  title = new createjs.Text("Click and Drag to draw", "36px Arial", "#777777");
  title.x = 300;
  title.y = 200;
  //stage.addChild(title);

  stage.addChild(drawingCanvas);

  
  stage.update();
};

Teleport.appStateAddedCallback = function(item)
{
	if (item.action == "draw")
	{
		console.log("draw", item);
		drawingCanvas.graphics.clear().setStrokeStyle(stroke, 'round', 'round').beginStroke(color).moveTo(item.midPtX, item.midPtY).curveTo(item.oldPtX, item.oldPtY, item.oldMidPtX, item.oldMidPtY);
		stage.update();
	}
};

Teleport.createAppSnapCallback = function()
{
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



////////////////////////////////////////////////////////////////////////////////////////////////////
//
//  CANVAS LOGIC
//
////////////////////////////////////////////////////////////////////////////////////////////////////

var canvas, stage;
var drawingCanvas;
var oldPt;
var oldMidPt;
var title;
var color = "#ffffff";
var stroke = 5;
var colors;
var index;

function stop() {}

function handleMouseDown(event) {
  if (stage.contains(title)) { stage.clear(); stage.removeChild(title); }
  oldPt = new createjs.Point(stage.mouseX, stage.mouseY);
  oldMidPt = oldPt;
  stage.addEventListener("stagemousemove" , handleMouseMove);
}

function handleMouseMove(event) {
  var midPt = new createjs.Point(oldPt.x + stage.mouseX>>1, oldPt.y+stage.mouseY>>1);

  drawingCanvas.graphics.clear().setStrokeStyle(stroke, 'round', 'round').beginStroke(color).moveTo(midPt.x, midPt.y).curveTo(oldPt.x, oldPt.y, oldMidPt.x, oldMidPt.y);
  
  Teleport.AppState.insert({
      	room:Teleport.room(),
      	action: "draw",
      	midPtX: midPt.x,
      	midPtY: midPt.y,
      	oldPtX: oldPt.x, 
      	oldPtY: oldPt.y, 
      	oldMidPtX: oldMidPt.x, 
      	oldMidPtY: oldMidPt.y

  });

  oldPt.x = stage.mouseX;
  oldPt.y = stage.mouseY;

  oldMidPt.x = midPt.x;
  oldMidPt.y = midPt.y;

  stage.update();
}

function handleMouseUp(event) {
  stage.removeEventListener("stagemousemove" , handleMouseMove);
}
