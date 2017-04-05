//clock code modified from https://www.w3schools.com/graphics/canvas_clock_start.asp
//timer bar code (js, css, html) modified from https://www.w3schools.com/howto/howto_js_progressbar.asp

//game vars
var hours = [];
var minutes = [];
var seconds = [];
var correctChoice = 0;
var correctGuesses = 0;
var incorrectGuesses = 0;
var points = 0;

//data vars
var names = [];
var scores = [];
var corrects = [];
var incorrects = [];
var totals = [];
var accuracies = [];

function startGame(){

	//make sure the student entered a name
	name = document.getElementById("name").value;
	if(name != "" && name != "Show Scores"){		
		names.push(name);
		startTimer();
		createClocks();
		points = 0;
		document.getElementById("points").innerHTML = 0;
		document.getElementById("gameTable").hidden = false;
		document.getElementById("result").innerHTML = "";
		document.getElementById("gameStartP").hidden = true;
		document.getElementById("result").hidden = true;
	}else if(name == "Show Scores"){
		document.getElementById("gameStartP").hidden = true;
		document.getElementById("result").hidden = true;
		displayData();
	}

}

function endGame(){
	
	//save values
	scores.push(points);
	corrects.push(correctGuesses);
	incorrects.push(incorrectGuesses);
	totalGuesses = correctGuesses + incorrectGuesses;
	totals.push(totalGuesses);
	//get accuracy as percent
	if(totalGuesses == 0){
		accuracy = 0;
	}else{
		accuracy = Math.ceil((correctGuesses/totalGuesses) * 100);
	}
	accuracies.push(accuracy + "%");

	//reset values
	points = 0;
	correctGuesses = 0;
	incorrectGuesses = 0;

	//reset html
	var result = document.getElementById("result");
	result.innerHTML += "Congratulations " + names[names.length - 1] + ", you scored " + scores[scores.length - 1] + " points!";
	document.getElementById("name").value = "";
	document.getElementById("gameStartP").hidden = false;
	result.hidden = false;
	document.getElementById("gameTable").hidden = true;
	document.getElementById("feedback").innerHTML = "";

}

function createClocks(){
	hours = [];
	minutes = [];
	seconds =[];
	drawClock("clock0");
	drawClock("clock1");
	drawClock("clock2");
	chooseAnswer();
}

function drawClock(id) {
  var canvas = document.getElementById(id);
  var ctx = canvas.getContext("2d");
  //reset context to top left corner of canvas
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  var radius = canvas.height / 2;
  ctx.translate(radius, radius);
  radius = radius * 0.90
  drawFace(ctx, radius);
  drawNumbers(ctx, radius);
  drawTime(ctx, radius);
}

function drawFace(ctx, radius) {
  var grad;
  ctx.beginPath();
  ctx.arc(0, 0, radius, 0, 2*Math.PI);
  ctx.fillStyle = '#daebed';
  ctx.fill();
  grad = ctx.createRadialGradient(0,0,radius*0.95, 0,0,radius*1.05);
  grad.addColorStop(0, '#333');
  grad.addColorStop(0.5, '#AAA');
  grad.addColorStop(1, '#333');
  ctx.strokeStyle = grad;
  ctx.lineWidth = radius*0.1;
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(0, 0, radius*0.1, 0, 2*Math.PI);
  ctx.fillStyle = '#333';
  ctx.fill();
}

function drawNumbers(ctx, radius) {
  var ang;
  var num;
  ctx.textBaseline="middle";
  ctx.textAlign="center";
  for(num = 1; num <= 60; num++){

    ang = num * Math.PI / 30;

    //draw hours
    if(num%5 == 0){
      ctx.font = radius*0.12 + "px arial";
      ctx.rotate(ang);
      ctx.translate(0, -radius*0.85);
      ctx.rotate(-ang);
      ctx.fillText((num/5).toString(), 0, 0);
      ctx.rotate(ang);
      ctx.translate(0, radius*0.85);
      ctx.rotate(-ang);
    }else{
      //draw minutes
      ctx.font = radius*0.05 + "px arial";
      ctx.rotate(ang);
      ctx.translate(0, -radius*0.85);
      ctx.rotate(-ang);
      ctx.fillText(num.toString(), 0, 0);
      ctx.rotate(ang);
      ctx.translate(0, radius*0.85);
      ctx.rotate(-ang);
    }    
  }
}

function drawTime(ctx, radius){

    //get random time
    hour = Math.floor(Math.random() * 12) + 1
    minute = Math.floor(Math.random() * 60)
    second = Math.floor(Math.random() * 60)

    //store it to check answer later
    hours.push(hour)
    minutes.push(minute)
    seconds.push(second)

    //hour
    var hourAngle=(hour*Math.PI/6)+(minute*Math.PI/(6*60))+(second*Math.PI/(360*60));
    drawHand(ctx, hourAngle, radius*0.5, radius*0.07);
    //minute
    var minuteAngle=(minute*Math.PI/30)+(second*Math.PI/(30*60));
    drawHand(ctx, minuteAngle, radius*0.65, radius*0.07);
    // second
    var secondAngle=(second*Math.PI/30);
    drawHand(ctx, secondAngle, radius*0.75, radius*0.02);
}

function drawHand(ctx, pos, length, width) {
    ctx.beginPath();
    ctx.lineWidth = width;
    ctx.lineCap = "round";
    ctx.moveTo(0,0);
    ctx.rotate(pos);
    ctx.lineTo(0, -length);
    ctx.stroke();
    ctx.rotate(-pos);
}

function chooseAnswer(){

	//pick random clock
	correctChoice = Math.floor(Math.random() * 3);
	
	//display chosen time to user
	timeElem = document.getElementById("time");
	timeElem.innerHTML = "";

	if(hours[correctChoice] < 10){
		timeElem.innerHTML += "0";
	}
	timeElem.innerHTML += hours[correctChoice] + ":";
	if(minutes[correctChoice] < 10){
		timeElem.innerHTML += "0";
	}
	timeElem.innerHTML += minutes[correctChoice] + ":";
	if(seconds[correctChoice] < 10){
		timeElem.innerHTML += "0";
	}
	timeElem.innerHTML += seconds[correctChoice];

}

function evaluateResponse(choice){

	feedbackElem = document.getElementById("feedback");
	feedbackElem.innerHTML = "";

	pointsElem = document.getElementById("points");

	//check if entire answer was correct
	if(choice == correctChoice){
		correctGuesses += 1;
		points += 100;
		feedbackElem.innerHTML += "Correct! Now try another.";
		createClocks();
		pointsElem.style.color = '#27771b';
	}else{
		//was not correct
		incorrectGuesses += 1;
		if(points > 0){
			points -= 100;
		}
		feedback.innerHTML += "Incorrect. Please try again!";
		pointsElem.style.color = '#d3133c';
	}

	//update points
	pointsElem.innerHTML = (points);

}

function startTimer() {
    var elem = document.getElementById("timer"); 
    var width = 0;

    //do some calcs
    onePercentOfTimeLimit = (1000 * 90) / 100;

    var interval = setInterval(incrementTimer, onePercentOfTimeLimit);
    function incrementTimer() {
        if (width >= 100) {
            clearInterval(interval);
		endGame();
        } else {
            width++; 
            elem.style.width = width + '%'; 
        }
    }
}

function displayData(){
	//show data in popup window
	document.getElementById("gameTable").hidden = true;

	var dataTable = document.getElementById("dataTable");
	dataTable.className = "dataT";

	var head = dataTable.createTHead();
	var row = head.insertRow();
	row.className = "dataRow";
	cell = row.insertCell();
	cell.innerHTML = "<b>Name</b>";
	cell.className = "dataCell";
	cell = row.insertCell();
	cell.innerHTML = "<b>Correct</b>";
	cell.className = "dataCell";
	cell = row.insertCell();
	cell.innerHTML = "<b>Incorrect</b>";
	cell.className = "dataCell";
	cell = row.insertCell();
	cell.innerHTML = "<b>Total</b>";
	cell.className = "dataCell";
	cell = row.insertCell();
	cell.innerHTML = "<b>Score</b>";
	cell.className = "dataCell";
	cell = row.insertCell();
	cell.innerHTML = "<b>Accuracy</b>";
	cell.className = "dataCell";

	var body = dataTable.createTBody();
	for(var i =0; i < names.length; i++){
		var row = body.insertRow(-1);
		row.className = "dataRow";
		cell = row.insertCell();
		cell.innerHTML = names[i];
		cell.className = "dataCell";
		cell = row.insertCell();
		cell.innerHTML = corrects[i];
		cell.className = "dataCell";
		cell = row.insertCell();
		cell.innerHTML = incorrects[i];
		cell.className = "dataCell";
		cell = row.insertCell();
		cell.innerHTML = totals[i];
		cell.className = "dataCell";
		cell = row.insertCell();
		cell.innerHTML = scores[i];
		cell.className = "dataCell";
		cell = row.insertCell();
		cell.innerHTML = accuracies[i];
		cell.className = "dataCell";
	}

	dataTable.hidden = false;
	document.getElementById("backButton").hidden = false;
	document.getElementById("start").disabled = true;
}

function backToGame(){
	
	//delete the data table (it will be created again if this page is pulled back up)
	document.getElementById("dataTable").innerHTML = "";
	document.getElementById("name").value = "";

	//reset visibilities
	dataTable.hidden = true;
	document.getElementById("gameStartP").hidden = false;
	document.getElementById("backButton").hidden = true;
	document.getElementById("start").disabled = false;
}