/*
This Google Script builds CSbyUs Lesson Plans
by opening up a Google Form-connected Sheets doc,
iterating through rows (which represent lesson plans
that have been input via the Form). For each row, the 
script generates a new lesson plan Google Doc by copying
the 'Template' Doc, and outputs each Doc to the active 
directory. 

Author: Tanner Johnson, CSbyUs
Date: 04/07/2019
*/

// global map for all critical indices for values
var map = {
  timestampIndex: 0,
  emailIndex: 1,
  authorNameIndex: 2,
  subjectsIndex: 3,
  lessonOverviewIndex: 4,
  totalHoursIndex: 5,
  activitiesCountIndex: 6,
  closingIndex: 31,
  reflectionIndex: 32,
  materialsIndex: 33,
  outcomesIndex: 34,
  titleIndex: 35,
  ageGroupIndex: 36,
};
  
function prettifyTimestamp(timestamp) {
  var sliceIndex = timestamp.indexOf(' ');
  var date = timestamp.slice(0, sliceIndex);
  return date;
}

// function adjusts activity indices based on activitiesCount
function generateActivitiesObject(activitiesCount, lessonObject) {
  Logger.log("Activity count: " + activitiesCount);
  var number = parseInt(activitiesCount);
  var activitiesObject = {};
  
  // 1 activity
  if (number === 1){
    map.introIndex = 7;
    activitiesObject.intro = lessonObject[map.introIndex];
    map.activityOneIndex = 8;
    activitiesObject.activityOne = lessonObject[map.activityOneIndex];
    map.activityOneTimeIndex = 9;
    activitiesObject.activityOneTime = lessonObject[map.activityOneTimeIndex];
  }
  
  // 2 activities
  else if (number === 2){
    map.introIndex = 10;
    activitiesObject.intro = lessonObject[map.introIndex];
    map.activityOneIndex = 11;
    activitiesObject.activityOne = lessonObject[map.activityOneIndex];
    map.activityOneTimeIndex = 12;
    activitiesObject.activityOneTime = lessonObject[map.activityOneTimeIndex];
    map.activityTwoIndex = 13;
    activitiesObject.activityTwo = lessonObject[map.activityTwoIndex];
    map.activityTwoTimeIndex = 14;
    activitiesObject.activityTwoTime = lessonObject[map.activityTwoTimeIndex];
  }
  
  // 3 activities
  else if (number === 3){
    map.introIndex = 15;
    activitiesObject.intro = lessonObject[map.introIndex];
    map.activityOneIndex = 16;
    activitiesObject.activityOne = lessonObject[map.activityOneIndex];
    map.activityOneTimeIndex = 17;
    activitiesObject.activityOneTime = lessonObject[map.activityOneTimeIndex];
    map.activityTwoIndex = 18;
    activitiesObject.activityTwo = lessonObject[map.activityTwoIndex];
    map.activityTwoTimeIndex = 19;
    activitiesObject.activityTwoTime = lessonObject[map.activityTwoTimeIndex];
    map.activityThreeIndex = 20;
    activitiesObject.activityThree = lessonObject[map.activityThreeIndex];
    map.activityThreeTimeIndex = 21;
    activitiesObject.activityThreeTime = lessonObject[map.activityThreeTimeIndex];
  }
  
  // 4 activities
  else {
    map.introIndex = 22;
    activitiesObject.intro = lessonObject[map.introIndex];
    map.activityOneIndex = 23;
    activitiesObject.activityOne = lessonObject[map.activityOneIndex];
    map.activityOneTimeIndex = 24;
    activitiesObject.activityOneTime = lessonObject[map.activityOneTimeIndex];
    map.activityTwoIndex = 25;
    activitiesObject.activityTwo = lessonObject[map.activityTwoIndex];
    map.activityTwoTimeIndex = 26;
    activitiesObject.activityTwoTime = lessonObject[map.activityTwoTimeIndex];
    map.activityThreeIndex = 27;
    activitiesObject.activityThree = lessonObject[map.activityThreeIndex];
    map.activityThreeTimeIndex = 28;
    activitiesObject.activityThreeTime = lessonObject[map.activityThreeTimeIndex];
    map.activityFourIndex = 29;
    activitiesObject.activityFour = lessonObject[map.activityFourIndex];
    map.activityFourTimeIndex = 30;
    activitiesObject.activityFourTime = lessonObject[map.activityFourTimeIndex];
  }
  
  return activitiesObject;
}

function hitLastRow(lessonObject) {
  var dateCheck = lessonObject[map.timestampIndex];
  if (dateCheck === null || dateCheck === '')
    return true;
  return false;
}

function createDocument() {
  var lessonsSheetId = '1XJHMGaVF72LEJNz3wyxYPktOooI-9B__hvfY4LdT6sc';
  var headers = Sheets.Spreadsheets.Values.get(lessonsSheetId, 'A1:AK1');
  // note that we only loop through max 100 rows currently
  var lessons = Sheets.Spreadsheets.Values.get(lessonsSheetId, 'A2:AK100');
  var templateId = '1nruCbCCaRBryKNUbM3bqn_Mr466S1Eowu_qo1hFiT3I';
  
  // loop over all lesson plans (rows)
  for( i = 0; i < lessons.values.length; i++ ) {
    
    // check if we've reached the last row
    if (hitLastRow(lessons.values[i])) {
      return;
    }
    
    // first update map to set activity indices and generate lesson activities object
    var activitiesCount = lessons.values[i][map.activitiesCountIndex];
    var lessonObject = lessons.values[i];
    var activitiesObject = generateActivitiesObject(activitiesCount, lessonObject);
    
    // collect date and title info to use to name file
    var timestamp = lessonObject[map.timestampIndex];
    var prettyDate = prettifyTimestamp(timestamp);
    var title = lessonObject[map.titleIndex];
    
    // copy Docs lesson plan template
    var newLessonDocumentId = DriveApp.getFileById(templateId).makeCopy().getId();
    
    // set doc name
    DriveApp.getFileById(newLessonDocumentId).setName(prettyDate + ' Lesson Plan: ' + title);
    
    // access the body of the new document
    var body = DocumentApp.openById(newLessonDocumentId).getBody();
    
    // set values in body
    body.replaceText('##Lesson Title##', title);
    body.replaceText('##Age Group##', lessonObject[map.ageGroupIndex]);
    body.replaceText('##Your Name##', lessonObject[map.authorNameIndex]);
    body.replaceText('##Timestamp##', prettyDate);
    body.replaceText('##Subjects##', lessonObject[map.subjectsIndex]);
    body.replaceText('##Amount of Time##', lessonObject[map.totalHoursIndex]);
    body.replaceText('##Materials##', lessonObject[map.materialsIndex]);
    body.replaceText('##Learning Outcomes##', lessonObject[map.outcomesIndex]);
    body.replaceText('##Lesson Overview##', lessonObject[map.lessonOverviewIndex]);
    body.replaceText('##Closing##', lessonObject[map.closingIndex]);
    body.replaceText('##Reflection##', lessonObject[map.reflectionIndex]);
    body.replaceText('##Introduction##', activitiesObject.intro);
    body.replaceText('##Activity 1##', activitiesObject.activityOne);
    body.replaceText('##Time for Activity 1##', activitiesObject.activityOneTime);
    var number = parseInt(activitiesCount);
    if (number > 1) {
      body.replaceText('##Activity 2##', activitiesObject.activityTwo);
      body.replaceText('##Time for Activity 2##', activitiesObject.activityTwoTime);
    }
    if (number > 2) {
      body.replaceText('##Activity 3##', activitiesObject.activityThree);
      body.replaceText('##Time for Activity 3##', activitiesObject.activityThreeTime);
    }
    if (number > 3) {
      body.replaceText('##Activity 4##', activitiesObject.activityFour);
      body.replaceText('##Time for Activity 4##', activitiesObject.activityFourTime);
    }
  }
}
