// A $( document ).ready() block. - all code must go into bock

// The range of "normal business" hours in 24-hour format
var hoursInWorkday = 10;  // number of "working" hours to show in the planner (don't forget lunch)
var startHour = 9;       // first "working" hour of the day

// Use this date to set the colors of the time slots on the planner.
var rightNow = moment();  // Only want the hour.  Set every smaller segment to zero.
rightNow.minutes(0);
rightNow.seconds(0);
rightNow.milliseconds(0);

// Use this date to compare to the date the data was last saved.  If the date has changed,
// start over with a clean slate.
var today = rightNow.clone();  // Only interested in the day!   
today.hours(0);

const localStorageKey = 'plannerData';
const dataEnvelopeDateFormat = "YYYY-MM-DD";  // (TBD - if the date has changed, treat is as "no data".

// The data structure for storage is:
//   [ the-date-this-data-was-saved, { "9AM":"This is my 9am task", "12PM":"Lunch appointment" } ]

var arrDataEnvelope = JSON.parse(localStorage.getItem(localStorageKey)) || [];
if (arrDataEnvelope.length === 0 || today.diff(moment(arrDataEnvelope[0], dataEnvelopeDateFormat))) {
   console.log("Creating an empty data envelope.");
   arrDataEnvelope[0] = rightNow.format(dataEnvelopeDateFormat);
   arrDataEnvelope[1] = {};
}
var plannerDate = arrDataEnvelope[0];
var objPlannerEntries = arrDataEnvelope[1];


// Create all of the planner's timeslots for the working hours and fill in the text for
// the timeslots that the user filled in previously.
function drawPlanner() {

   console.log("Entering drawPlanner");

   // Clear out the planner display
   $('.container').empty();

   var hourIncr = rightNow.clone();
   hourIncr.hours(startHour);

   // And load it up again
   for (var i = 0; i < hoursInWorkday; i++) {
      var plannerRow = $('<div>');
      plannerRow.addClass('row');
      plannerRow.addClass('no-gutters');

      var plannerTimeSlot = $('<p>');
      plannerTimeSlot.addClass('time-block');
      plannerTimeSlot.addClass('col-sm-2');

      var plannerTime = hourIncr.format('hA');
      plannerTimeSlot.text(plannerTime);

      var plannerDesc = $('<textarea>');
      plannerDesc.addClass('description');
      if (rightNow.diff(hourIncr) > 0) {
         plannerDesc.addClass('past');
         plannerDesc.attr('disabled', true);  // Can't change the past.
      } else if (rightNow.diff(hourIncr) === 0) {
         plannerDesc.addClass('present');
      } else {
         plannerDesc.addClass('future');
      }
      plannerDesc.addClass('col-sm-6');
      plannerDesc.attr('id', 'planner-desc' + plannerTime);
      plannerDesc.text(objPlannerEntries[plannerTime]);

      var plannerSaveBtn = $('<button>');
      plannerSaveBtn.addClass('saveBtn');
      plannerSaveBtn.addClass('btn-info');
      plannerSaveBtn.addClass('col-sm-2');
      plannerSaveBtn.attr('data-time', plannerTime);
      plannerSaveBtn.text('Save');

      plannerRow.append(plannerTimeSlot);
      plannerRow.append(plannerDesc);
      plannerRow.append(plannerSaveBtn);

      $('.container').append(plannerRow);

      hourIncr.add(1, 'hour');
   }
}


$(document).on('click', '.saveBtn', function() {
   // Figure out which Save button was clicked.
   var saveTimeSlot = $(this).attr('data-time');
   console.log("Request to save plannerTime: " + saveTimeSlot);

   // Use the time above, construct the ID of the description for
   // that time slot, retrieve it and trim the extraneous spaces.
   var saveText = $('#planner-desc' + saveTimeSlot).val().trim();
   console.log("Request to save text:        " + saveText);

   if (saveText === '') {
      console.log("Deleting timeslot: " + saveTimeSlot);
      delete objPlannerEntries[saveTimeSlot];
   } else {
      console.log("Adding or updating timeslot: " + saveTimeSlot + " with: " + saveText);
      objPlannerEntries[saveTimeSlot] = saveText;
   }

   // Refresh the planner contents after making the update.
   drawPlanner();

   // Save it to localStorage
   arrDataEnvelope[1] = objPlannerEntries;
   localStorage.setItem(localStorageKey, JSON.stringify(arrDataEnvelope));  
});


$(document).ready(function() {
    var today = moment().format('LLLL');
    $('#currentDay').html(today)

    drawPlanner();   
});