  $.noConflict();     //  to avoid jQuery
  // Code that uses other library's $ can follow here.
  var meeting_day = '';
  var end_time_clone = '';
  var event;
  var draggedEventIsPastDay = false;

  jQuery(document).ready(function($) {
      if (!window.console)
          console = {
              log : function() {
              }
          };
      //work around for errors in IE if the console is not open
      end_time_clone = $('#end_time option').clone();
      /*
      Author: shiju@qburst.com
      Description: get events in json format
      */
      getEventsJSON = function(offset) {
          meeting_room = $('#meeting_rooms').val();
          project_id = $('#project_id').val();
          var current_date = new Date();
          current_date.setDate(current_date.getDate() - 14);
          var today = $.datepicker.formatDate("yy-mm-dd", current_date);
          //  selected meeting room
          $.ajax({
              url : baseUrl + '/issues.json',
              dataType : 'json',
              data : 'key=' + api_key + '&project_id=' + project_id + '&cf_' + fieldIdRoom + '=' + encodeURIComponent(meeting_room) + '&start_date=' + encodeURIComponent('>=') + today + '&status_id=' + encodeURIComponent('*') + '&limit=' + 100 + '&offset=' + offset,
              beforeSend : function(xhr) {
                  showSpinner();
              },
              success : function(data, textStatus, jqXHR) {
                  console.log('Get JSON success');
                  if (buildEventsJSON(data, data.offset == 0)) {
                      if (data.offset == 0) {
                          $('#calendar').fullCalendar('removeEvents');
                          $('#calendar').fullCalendar('addEventSource', eventsJSON);
                      }

                      $('#calendar').fullCalendar('refetchEvents');
                      $('#calendar').fullCalendar('rerenderEvents');

                      hideSpinner();

                      if (data.total_count > (data.offset + data.limit)) {
                          getEventsJSON(data.offset + data.limit);
                      }
                  }
              },
              error : function(jqXHR, textStatus, errorThrown) {
                  hideSpinner();
                  alert(textStatus + ": " + errorThrown);
              }
          });
          return true;
      }
      /*
      Author: shiju@qburst.com
      Description: build events json for fullcalendar
      */
      var buildEventsJSON = function(eventsRawJSON, clear) {
          window.console.log('Building Meetings JSON');
          count = eventsRawJSON.issues.length;
          event = eventsRawJSON.issues;
          if (clear) {
              eventsJSON = [];
          }
          //  events to be rendered on fullcalendar
          // building events json for fullcalendar
          for (var i = 0; i < count; i++) {
              var eventIndexRoom = 0;
              var eventIndexStart = 1;
              var eventIndexEnd = 5;
              for (var j = 0; j < event[i].custom_fields.length; j++)
              {
                  if (event[i].custom_fields[j]["id"] == fieldIdRoom)
                      eventIndexRoom = j;
                  if (event[i].custom_fields[j]["id"] == fieldIdStart)
                      eventIndexStart = j;
                  if (event[i].custom_fields[j]["id"] == fieldIdEnd)
                      eventIndexEnd = j;
              }

              var eventClassName = '';
              var event_id = event[i].id;
              author_name = event[i].author.name;
              start_time_arr = event[i].custom_fields[eventIndexStart].value.split(':');
              end_time_arr = event[i].custom_fields[eventIndexEnd].value.split(':');
              meeting_room = event[i].custom_fields[eventIndexRoom].value;
              meeting_day_arr = event[i].start_date.split('-');
              var start_time = new Date(meeting_day_arr[0], meeting_day_arr[1] - 1, meeting_day_arr[2], start_time_arr[0], start_time_arr[1]);
              var end_time = new Date(meeting_day_arr[0], meeting_day_arr[1] - 1, meeting_day_arr[2], end_time_arr[0], end_time_arr[1]);
              var assigned_to_id = event[i].author.id;
              if (event[i].assigned_to)
                  assigned_to_id = event[i].assigned_to.id;
              var assigned_to_name = event[i].author.name;
              if (event[i].assigned_to)
                  assigned_to_name = event[i].assigned_to.name;
              var category_id = 0;
              var category_name = '';
              if (event[i].category) {
                  category_id = event[i].category.id;
                  category_name = event[i].category.name;
              }
              var eventsub = '';
              var repl
              var limit
              var title = event[i].subject;
              if (title.length >= '36') {
                 title = stripSubject(title, 36) + " ...";
              }
              eventClassName = 'category_' + category_id;
              eventClassName = eventClassName + ' tracker_status_' + event[i].status.id;
              if (isCurrentUser(event[i].author.id, assigned_to_id)) {
                  eventClassName = 'myEvents ' + eventClassName;
              }
              eventsJSON.push({
                  title : title,
                  author : author_name,
                  start : start_time,
                  end : end_time,
                  subject : event[i].subject,
                  start_date : event[i].start_date,
                  due_date : event[i].due_date,
                  starttime : +start_time_arr[0] + ':' + start_time_arr[1],
                  endtime : +end_time_arr[0] + ':' + end_time_arr[1],
                  event_id : event_id,
                  event_author_id : event[i].author.id,
                  assigned_to_id : assigned_to_id,
                  assigned_to_name : assigned_to_name,
                  category_id: category_id,
                  category_name: category_name,
                  className : eventClassName,
                  cache : true,
                  allDay : false
              });
          }
          return true;
      }
      /*
      Author: shiju@qburst.com
      Description: checking whether event overlaps with exisiting events
      */
      var isOverlapping = function(eventStart, eventEnd) {
          var event_id = $("#event_id").val();
          var events = $('#calendar').fullCalendar('clientEvents');
          var periodtype = parseInt($("#periodtype").val());
          var recur_days = 1;
          if (events.length == 0) {
              return false;
          }
          if ($("#recurCheckbox").is(':checked')) {
              var recur = parseInt($("#period").val()) * periodtype;
              if (recur > 5 && periodtype == 1) {
                  recur_days = recur + (recur % 5);
                  // adding 2 to accomodate Saturday N Sunday of a week
              } else {
                  recur_days = recur;
              }
          }
          var overlapping = false;
          for (i in events) {
              if (events[i].start_date == undefined)
                  continue;

              var temp_meeting_day = meeting_day.split("-")
              if (temp_meeting_day[1].count = 1) {
                  temp_meeting_day[1] = "0" + temp_meeting_day[1]
              }
              meeting_book_day = new Date(temp_meeting_day[0], temp_meeting_day[1] - 1, temp_meeting_day[2]);
              if (events[i].start_date != undefined) {
                  var temp_events_meeting_day = events[i].start_date.split('-');
                  if (temp_events_meeting_day[1].count = 1) {
                      temp_events_meeting_day[1] = "0" + temp_events_meeting_day[1];
                  }
                  event_meeting_day = new Date(temp_events_meeting_day[0], temp_events_meeting_day[1] - 1, temp_events_meeting_day[2]);
              }
              if (event_meeting_day != undefined || meeting_book_day != undefined) {
                  var difference = Math.abs(event_meeting_day - meeting_book_day);
              }
              if (difference != undefined) {
                  var days = Math.round(difference / (1000 * 60 * 60 * 24))
              }
              if (days > 0 && periodtype > 1 && (days % periodtype) != 0) {
                  continue;
              }
              if (days >= 0 && days < recur_days) {
                  eventStartDay = new Date(eventStart.getTime() + (24 * 60 * 60 * 1000 * (days)));
                  eventEndDay = new Date(eventEnd.getTime() + (24 * 60 * 60 * 1000 * (days)));
                  if (event_id == 0) {
                      console.log('Create')
                      // start-time in between any of the events
                      if (eventStartDay > events[i].start && eventStartDay < events[i].end) {
                          overlapping = true;
                          break;
                      }
                      //end-time in between any of the events
                      if (eventEndDay > events[i].start && eventEndDay < events[i].end) {
                          overlapping = true;
                          break;
                      }
                      //any of the events in between/on the start-time and end-time
                      if (eventStartDay <= events[i].start && eventEndDay >= events[i].end) {
                          overlapping = true;
                          break;
                      }
                  } else if (event_id != 0 && events[i].event_id != event_id) {
                      console.log('Update')
                      // start-time in between any of the events
                      if (eventStartDay > events[i].start && eventStartDay < events[i].end) {
                          overlapping = true;
                          break;
                      }
                      //end-time in between any of the events
                      if (eventEndDay > events[i].start && eventEndDay < events[i].end) {
                          overlapping = true;
                          break;
                      }
                      //any of the events in between/on the start-time and end-time
                      if (eventStartDay <= events[i].start && eventEndDay >= events[i].end) {
                          overlapping = true;
                          break;
                      }
                  }
              }
          }
          return overlapping;
      }
      /*
      Author: shiju@qburst.com
      Description: stripping the subject text to fit into the calendar event and tooltip
      */
      var stripSubject = function(eventsub, limit) {
          var strlen = eventsub.length
          if (strlen > limit) {
              return eventsub.substr(0, limit) //.repl;
          } else {
              return eventsub;
          }
      }
      /*
      Author: shiju@qburst.com
      Description: checking whether the current user is same as the author of event
      */
      var isCurrentUser = function(event_author_id, event_assigned_to_id) {
          var current_user_id = $('#author_id').val();
          if ((event_author_id == current_user_id) || (event_assigned_to_id == current_user_id) || (user_is_manager == 1)) {
              return true;
          } else {
              return false;
          }
      }
      /*
      Author: shiju@qburst.com
      Description: checking whether the event start date is past today
      */
      var isPastDay = function(calDate) {
          var current_date = new Date();
          if (calDate <= current_date) {
              if (allow_changing_old_meetings == 1)
                return false;
              return true;
          } else {
              return false;
          }
      }
      /*
      Author: shiju@qburst.com
      Description: intialising fullcalendar to render events
      */
      var loadCalendar = function() {
          var disableDragAndDrop = true;
          if (allow_drag_and_drop == 1)
              disableDragAndDrop = false;
          var disableResize = true;
          if (allow_resize == 1)
              disableResize = false;
          if (getEventsJSON(0)) {
              console.log('Loading Meeting Calendar')
              $('#calendar').fullCalendar({
                  allDaySlot : false,
                  header : {
                      left : 'today prev next',
                      center : 'title',
                      right : 'month,agendaWeek,agendaDay'
                  },
                  axisFormat : langDateTimeTimeFormat,
                  timeFormat : {
                      agenda : langDateTimeTimeFormat + '{ - ' + langDateTimeTimeFormat + '}'
                  },
                  defaultView : 'agendaWeek',
                  editable : true,
                  disableDragging: disableDragAndDrop,
                  disableResizing: disableResize,
                  minTime : langDateTimeMin,
                  maxTime : langDateTimeMax,
                  weekends : false,
                  eventRender : function(event, element) {
                      var full_text = '<p>' + langAssignedTo + ': ' + event.assigned_to_name + '<br />' + langBookedBy + ': ' + event.author + '<br />' + langStartTime + ': ' + event.starttime + '<br/>' + langEndTime + ': ' + event.endtime;
                      if (show_categories=='1')
                        full_text = full_text + '<br/>' + langCategory + ': ' + event.category_name;
                      full_text = full_text + '</p>';
                      element.qtip({
                          content : {
                              // Set the text and title fot the tooltip
                              text : full_text,
                              title : {
                                  text : event.subject // Give the tooltip a title using each elements text
                              }
                          },
                          position : {
                              corner : {
                                  target : 'bottomMiddle', // Position the tooltip above the link
                                  tooltip : 'topMiddle'
                              },
                              adjust : {
                                  screen : true // Keep the tooltip on-screen at all times
                              }
                          },
                          show : {
                              when : 'mouseover',
                              solo : true // Only show one tooltip at a time
                          },
                          hide : {
                              when : 'mouseout',
                              solo : true // Hide tooltip
                          },
                          style : {
                              tip : true, // Apply a speech bubble tip to the tooltip at the designated tooltip corner
                              border : {
                                  width : 0,
                                  radius : 4
                              },
                              name : 'cream', // Use the default light style
                              width : 330 // Set the tooltip width
                          }
                      });
                  },
                  eventClick : function(calEvent, jsEvent, view) {
                      if ("Anonymous" == $('#user_name').val() || "Anonym" == $('#user_name').val()) {
                          console.log('User not logged in');
                          return false;
                      }
                      var event_author_id = calEvent.event_author_id;
                      isCurrentUser(event_author_id, calEvent.assigned_to_id);
                      $('input:checkbox').removeAttr('checked');
                      meeting_day = calEvent.start_date;
                      if (isPastDay(calEvent.start)) {
                          jAlert(langWarningEditPast, langInfo);
                          return false;
                      } else if (!(isCurrentUser(event_author_id, calEvent.assigned_to_id))) {
                          console.log('It is an event created by another user');
                          return false;
                      } else {
                          $('#meeting_date').val($.datepicker.formatDate(langDateFormat, calEvent.start, $('#meeting_date').datepicker.settings))
                          $('#subject').val(calEvent.subject);
                          $('#event_id').val(calEvent.event_id);
                          var x = calEvent.starttime.split(':');
                          if (x[0].length == '1') {
                              x[0] = '0' + x[0];
                              calEvent.starttime = x[0] + ':' + x[1];
                          }
                          var y = calEvent.endtime.split(':')
                          if (y[0].length == '1') {
                              y[0] = '0' + y[0];
                              calEvent.endtime = y[0] + ':' + y[1];
                          }
                          $('#start_time').val(calEvent.starttime);
                          $('#end_time').val(calEvent.endtime);
                          $('#assigned_to_id').val(calEvent.assigned_to_id);
                          $('#category_id').val(calEvent.category_id);
                          $('.saveMeetingModal').dialog({
                              title : langUpdateEvent,
                              modal : true,
                              resizable : false,
                              draggable : false,
                              width : 400,
                              show : 'blind',
                              hide : 'explode'
                          });
                          $('.saveMeetingModal').dialog('open');
                          $('.recurfield').hide();
                          $('#recur_div').hide();
                          $('#delete_meeting').show();
                      }
                  },
                  dayClick : function(date, jsEvent, calEvent) {
                      if ("Anonymous" == $('#user_name').val() || "Anonym" == $('#user_name').val()) {
                          console.log('User not logged in');
                          return false;
                      }
                      meeting_day = $.fullCalendar.formatDate(date, 'yyyy-MM-dd');
                      if (isPastDay(date)) {
                          jAlert(langWarningCreatePast, langInfo);
                          return false;
                      } else {
                          // clear field values
                          $('#event_id').val(0);
                          $('#meeting_date').val($.datepicker.formatDate(langDateFormat, date, $('#meeting_date').datepicker.settings))
                          $('#subject').val(user_last_name);
                          $('#start_time').val('');
                          $('#end_time').val('');
                          $('input:checkbox').removeAttr('checked');
                          // new meeting start time
                          var start_time = $.fullCalendar.formatDate(date, langDateTimeTimeFormat);
                          // new meeting end time
                          var end_time = $.fullCalendar.formatDate(new Date(date.setHours(date.getHours() + 1)), langDateTimeTimeFormat);
                          $('#start_time').val(start_time);
                          $('#end_time').val(end_time);
                          $('#assigned_to_id').val($('#author_id').val());                          
                          $('#category_id').val(0);
                          $('.saveMeetingModal').dialog({
                              title : langCreateEvent,
                              modal : true,
                              resizable : false,
                              draggable : false,
                              width : 400,
                              show : 'blind',
                              hide : 'explode'
                          });
                          $('.saveMeetingModal').dialog('open');
                          $('.recurfield').show();
                          $('#recur_div').hide();
                          $('#delete_meeting').hide();
                          setEndTime();
                      }
                  },
                  eventDragStart: function( event, jsEvent, ui, view ) { return true; },
                  eventDragStop: function( event, jsEvent, ui, view )
                  {
                      if (isPastDay(event.start)) {
                          draggedEventIsPastDay = true;
                          return false;
                      }
                      draggedEventIsPastDay = false;
                      return true;
                  },
                  eventDrop: quickEditEvent,
                  eventResizeStart: function( event, jsEvent, ui, view ) { return true; },
                  eventResizeStop: function( event, jsEvent, ui, view )
                  {
                      if (isPastDay(event.start)) {
                          draggedEventIsPastDay = true;
                          return false;
                      }
                      draggedEventIsPastDay = false;
                      return true;
                  },
                  eventResize: function( event, dayDelta, minuteDelta, revertFunc, jsEvent, ui, view ) {
                      quickEditEvent(event, dayDelta, minuteDelta, false, revertFunc, jsEvent, ui, view);
                  }
              });
          }
      }
      $('#recurCheckbox').click(function() {
          showHiderecurdiv();
      });

      var quickEditEvent = function( event, dayDelta, minuteDelta, allDay, revertFunc, jsEvent, ui, view )
      {
          if (allDay) {
              revertFunc();
              return false;
          }
          if ("Anonymous" == $('#user_name').val() || "Anonym" == $('#user_name').val()) {
              console.log('User not logged in');
              revertFunc();
              return false;
          }
          var event_author_id = event.event_author_id;
          meeting_day = $.fullCalendar.formatDate(event.start, 'yyyy-MM-dd');
          $('input:checkbox').removeAttr('checked');
          $('#event_id').val(event.event_id);
          if (isPastDay(event.start) || draggedEventIsPastDay) {
              jAlert(langWarningEditPast, langInfo);
              revertFunc();
              return false;
          } else if (!(isCurrentUser(event_author_id, event.assigned_to_id))) {
              console.log('It is an event created by another user');
              revertFunc();
              return false;
          } else {
              if (!(isOverlapping(event.start, event.end))) {
                  console.log('No overlapping');

                  event.starttime = $.fullCalendar.formatDate(event.start, langDateTimeTimeFormat);
                  event.endtime = $.fullCalendar.formatDate(event.end, langDateTimeTimeFormat);
                  var x = event.starttime.split(':');
                  if (x[0].length == '1') {
                      x[0] = '0' + x[0];
                      event.starttime = x[0] + ':' + x[1];
                  }
                  var y = event.endtime.split(':')
                  if (y[0].length == '1') {
                      y[0] = '0' + y[0];
                      event.endtime = y[0] + ':' + y[1];
                  }
                  var customData = {};
                  customData[fieldIdStart] = event.starttime;
                  customData[fieldIdEnd] = event.endtime;
                  customData[fieldIdRoom] = $('#meeting_rooms').val();
                  var category_id = 0;
                  if (show_categories == '1')
                      category_id = event.category_id;
                  var ajaxData = {
                      key: api_key,
                      project_id: $('#project_id').val(),
                      author_id: event.event_author_id,
                      assigned_to_id: event.assigned_to_id,
                      category_id: category_id,
                      subject: event.subject,
                      start_date: meeting_day,
                      due_date: meeting_day,
                      custom_field_values: customData,
                      event_id: event.event_id,
                      recur: false,
                      periodtype: 0,
                      period: 0
                  };
                  $('#event_id').val(0);
                  $.ajax({
                      url: baseUrl + '/' + pluginName + '/update',
                      data: ajaxData,
                      success: function (data) {
                          reloadCalendar();
                      },
                      error: function (jqXHR, textStatus, errorThrown) {
                          revertFunc();
                      }
                  });
                  return true;
              } else {
                  revertFunc();
                  return false;
              }
          }
      }

      /*
      Author: shiju@qburst.com
      Description: toggle show and hide of reccur checkbox
      */
      var showHiderecurdiv = function() {
          if ($('#recurCheckbox').is(':checked')) {
              $('#recur_div').show('blind', {}, 500);
              var checked_value = $('input:radio[name=Week]:checked').val();
          } else {
              $('#recur_div').hide('blind', {}, 500);
              var checked_value = $('input:radio[name=Week]:checked').val();
              checked_value = '';
          }
          return checked_value;
      }
      /*
      Author: shiju@qburst.com
      Description: show spinner
      */
      var showSpinner = function() {
          $('#loading').show();
      }
      /*
      Author: shiju@qburst.com
      Description: hide spinner
      */
      var hideSpinner = function() {
          $('#loading').hide();
      }
      /*
      Author: shiju@qburst.com
      Description: reload calendar
      */
      var reloadCalendar = function() {
          if (getEventsJSON(0)) {
              console.log('Reload Calender');
          }
      }

      $('#meeting_rooms').change(function() {
          reloadCalendar();
      });

      $('#project_id').change(function() {
          location.assign(baseUrl + '/' + pluginName + '/' + $('#project_id').val());
      });

      $('#start_time').change(function() {
          setEndTime();
      });

      /*
      Author: shiju@qburst.com
      Description: set end-time wrt the selected start-time
      */
      var setEndTime = function() {
          $('#end_time').empty().append(end_time_clone);
          var start_time_sel_index = '';
          start_time_sel_index = $('#start_time').prop('selectedIndex') - 1;
          for (var j = start_time_sel_index; j >= 0; j--) {
              $('#end_time option:eq(' + j + ')').remove();
          }
          $('#end_time option:eq(1)').prop('selected', true);
          return true;
      }
      /*
      Author: shiju@qburst.com
      Description: validation to avaoid special characters in subject field
      */
      var validate = function() {
          var special_char = /[0-9a-zA-Z',-]+/;
          if (special_char.test($('#subject').val())) {
              return true;
          }
          return false;
      }
      /*
      Author: shiju@qburst.com
      Description: go-to datepicker
      */
      $('#datepicker').datepicker({
          inline : true,
          firstDay : langFirstDay,
          dateFormat : langDateFormat,
          minDate : 0, // past days disabled
          monthNames : langMonthNames,
          dayNamesMin : langAbbrDayNames,
          onSelect : function(dateText, inst) {
              $('#calendar').fullCalendar('changeView', 'agendaDay');
              $('#calendar').fullCalendar('gotoDate', $('#datepicker').datepicker("getDate"));
          }
      });
      $('#meeting_date').datepicker({
          inline : true,
          firstDay : langFirstDay,
          dateFormat : langDateFormat,
          minDate : 0, // past days disabled
          monthNames : langMonthNames,
          dayNamesMin : langAbbrDayNames
      });

      /*
      Author: shiju@qburst.com
      Description: create/update event
      */
      $('#delete_meeting').click(function() {
          if ($('#event_id').val() <= 0)
              return false;

          var ajaxData = {
              key: api_key,
              event_id: $('#event_id').val()
          };
          console.log('Deleting');
          $.ajax({
              url : baseUrl + '/' + pluginName + '/delete',
              data : ajaxData,
              success : function(data) {
                  reloadCalendar();
              }
          });
          $('.saveMeetingModal').dialog('close');
      });

      /*
      Author: shiju@qburst.com
      Description: create/update event
      */
      $('#save_meeting').click(function() {
          var date = $('#meeting_date').datepicker("getDate");
          if (date.getDay() == 0 || date.getDay() == 6) {
              jAlert(langWarningWeekend, langInfo);
              return false;
          }
          meeting_day = $.datepicker.formatDate("yy-mm-dd", date, $('#meeting_date').settings);
          var start_time = $('#start_time').val();
          var end_time = $('#end_time').val();

          if ($('#subject').val() == '') {
              jAlert(langWarningFieldsMandatory, langInfo);
          } else {
              temp_meeting_day = meeting_day.replace(/\-/g, '/');
              var eventStart = new Date(temp_meeting_day + ' ' + start_time + ":00");
              var eventEnd = new Date(temp_meeting_day + ' ' + end_time + ":00");
              if (isPastDay(eventStart)) {
                  jAlert(langWarningUpdatePast, langInfo);
                  return false;
              }
              if (!(isOverlapping(eventStart, eventEnd))) {
                  if (validate()) {
                      console.log('No overlapping');
                      $('.saveMeetingModal').dialog('close');
                      //setting the variable for update or create as required
                      if ($('#event_id').val() == 0) {
                          var action = 'create';
                      } else {
                          var action = 'update';
                      }
                      var customData = {};
                      customData[fieldIdStart] = start_time;
                      customData[fieldIdEnd] = end_time;
                      customData[fieldIdRoom] = $('#meeting_rooms').val();
                      var category_id = 0;
                      if (show_categories == '1')
                        category_id = $('#category_id').val();
                      var ajaxData = {
                          key: api_key,
                          project_id: $('#project_id').val(),
                          author_id : $('#author_id').val(),
                          assigned_to_id : $('#assigned_to_id').val(),
                          category_id: category_id,
                          subject : $('#subject').val(),
                          start_date : meeting_day,
                          due_date : meeting_day,
                          custom_field_values : customData,
                          event_id : $('#event_id').val(),
                          recur : $('#recurCheckbox').is(':checked'),
                          periodtype : $('#periodtype').val(),
                          period : $('#period').val()
                      };
                      $.ajax({
                          url : baseUrl + '/' + pluginName + '/' + action,
                          data : ajaxData,
                          success : function(data) {
                              $('#event_id').val(0);
                              reloadCalendar();
                          }
                      });
                  } else {
                      jAlert(langInvalidSubject, langInfo);
                  }
              } else {
                  jAlert(langRoomAlreadyBooked, langAlert);
              }
              $('#recur_meeting').val('');
          }
      });

      /*
      Author: shiju@qburst.com
      Description: Save the meeting on stroke of ENTER button
      */
      $('.saveMeetingModal').keypress(function(e) {
          if (e.which == 13) {
              jQuery('#save_meeting').focus().click();
              e.preventDefault();
              return false;
          }
      });

      loadCalendar();
      // intial load calendar

  }); 