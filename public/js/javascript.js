//generating table  
function displayCalendar() {
  var f = document.getElementById('start').value;
  var g = document.getElementById('end').value;
  var validF = moment(f).isValid();
  var validG = moment(g).isValid();
  console.log("f is: " , f , validF);
  console.log("g is: " , g , validG);
  
  if(validF === false || validG === false){
    window.alert("Please input both dates to create a Gantt chart.");
  }
  
  
if(validF === true && validG === true){
  
  var date1 = document.getElementById('start');
  var date2 = document.getElementById('end');
  console.log("Date 1 received: " + date1);
  console.log("Date 2 received: " + date2);
  
  var dates = date1.value + "," + date2.value;
  console.log("Dates I'm sending: " + dates);
  
  var req = new XMLHttpRequest();
  
  req.onreadystatechange = function() {
    
        if( req.readyState !== XMLHttpRequest.DONE )
          return;

        if(req.status === 200) {
          if(req.responseText == "DayConstraint"){
            alert ("Only 21 days allowed. Please try again");
          } else {
            var divCal = document.getElementById('calendar');
            divCal.innerHTML = req.responseText;
            divCal.innerHTML += "";
          }
        }
      
    }
    
    req.open('POST', '/calendar', true);
    req.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    req.send("dates=" + dates);
  }
}

//submitted form to create task
function createTask() { 
  //TO DO I AM NOT YET HANDLING THESE TWO
  var n = document.getElementById('taskNameInp').value;
  var s = document.getElementById('taskStartInp').value;
  var e = document.getElementById('taskEndInp').value;
  
  var validS = moment(s).isValid();
  var validE = moment(e).isValid();
  console.log("s is: " , s , validS);
  console.log("e is: " , e , validE);
  
  if(validS === false || validE === false){
    window.alert("Please input both dates to create a task.");
  }
  
  
if(validS === true && validE === true){
  var nameTask = document.getElementById('taskNameInp');
  var startTask = document.getElementById('taskStartInp');
  var endTask = document.getElementById('taskEndInp');
  var detailsTask = document.getElementById('taskDetailsInp');
  var membersTask = document.getElementById('taskMembersInp');

  var myTable = document.getElementById("generatedCalendar");
  // add new row at the bottom-1 position
  var row = myTable.insertRow(myTable.rows.length);
  var newCells = [];
  var numColumns = myTable.rows[0].cells.length;
  // Insert new cells
  for(var j = 0; j < numColumns; j++) {
    newCells[j] = row.insertCell(0);
  }

  //first cell is name of task
  newCells[numColumns-1].innerHTML = nameTask.value;
  newCells[numColumns-1].setAttribute("class", "taskName");
  
  //finding the dates of task and coloring those cells
  var receivedIdentifiers = "";
  var taskDates = startTask.value + "," + endTask.value;
  var req = new XMLHttpRequest();
  req.onreadystatechange = function() {
    if( req.readyState !== XMLHttpRequest.DONE )
     return;

    if(req.status === 200) {
      receivedIdentifiers = req.responseText;
      var dateIdentifiers = receivedIdentifiers.split(',');
      dateIdentifiers.pop();
      changeCellColors(dateIdentifiers);
    }
  }
 
  req.open('POST', '/getIdentifiers', true);
  req.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
  req.send("taskdates=" + taskDates);
  }
}

function changeCellColors(identifiers){
  var myTable = document.getElementById("generatedCalendar");
  var firstRowContains = [];
  var firstRowContainsTrimmed = [];
  var numOfColumns = document.getElementById("generatedCalendar").rows[0].cells.length;
  
  //trim the first row headers to match with identifiers later
  for(var k=1; k < numOfColumns; k++ ){
    firstRowContains[k] = document.getElementById("generatedCalendar").rows[0].cells[k].innerHTML; 
    //parse the first row elements to match the format of the identifiers: "8 Jan" instead of "Sat, 8 Jan"
    var res1 = firstRowContains[k].split(",");
    var res2 = res1[1].trim();
    firstRowContainsTrimmed[k] = res2;
  }
  
  //prototype method does not exist in chrome..... boo
  if (!String.prototype.contains) {
    String.prototype.contains = function(s) {
        return this.indexOf(s) > -1
    }
  }
  //generate color for task
  var newColor = generateColor();
  //check to find identifiers matching the dates on calendar
  for(var l=1; l < firstRowContainsTrimmed.length; l++ ){
    for(var p=0; p < identifiers.length; p++){
      console.log("Comparing following strings now: " + firstRowContainsTrimmed[l] + " and " + identifiers[p]);
      var doesIt = firstRowContainsTrimmed[l].contains(identifiers[p]);
      if(doesIt === true){
        console.log("omg found a date match, switching to red");
        document.getElementById("generatedCalendar").rows[myTable.rows.length-1].cells[l].style.background = newColor;
      }
    }
  }
  document.getElementById("addTaskForm").hidden = true;
}

function generateColor(){
  var colorArray = ["rgb(81, 40, 79)", 
                "rgb(81, 47, 46)",
                "rgb(31, 42, 68)",
                "rgb(69, 53, 54)", // up to here is purples
                "rgb(157, 67, 44)",
                "rgb(139, 71, 32)",
                "rgb(138, 57, 27)",
                "rgb(153, 85, 43)",
                "#F8B97A" //up to here is oranges
                ]
  var rand = colorArray[Math.floor(Math.random() * colorArray.length)];
  console.log("random color", rand);
  return rand;
}

//reveal task form when + is clicked
function createTaskInp(){
  //these are the start and end dates of the calendar
  var date1 = document.getElementById('start').value;
  var date2 = document.getElementById('end').value;
  
  //adjust the dates of task to be created to between the dates on calendar that was generated
  document.getElementById("taskStartInp").setAttribute("min", date1);
  document.getElementById("taskStartInp").setAttribute("max", date2);
  document.getElementById("taskEndInp").setAttribute("min", date1);
  document.getElementById("taskEndInp").setAttribute("max", date2);
  
  //reveal add task form
  document.getElementById("addTaskForm").hidden = false;
}