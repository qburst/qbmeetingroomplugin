  $.noConflict();     //  to avoid jQuery 
  // Code that uses other library's $ can follow here.
  var meeting_day = '';
  var end_time_clone = '';
  var event;
  jQuery(document).ready(function($) {
    if (!window.console) console = {log: function() {}}; //work around for errors in IE if the console is not open
    end_time_clone = $('#end_time option').clone();
    /*
      Author: shiju@qburst.com
      Description: get events in json format
    */
    getEventsJSON = function(){
      meeting_room = $('#meeting_rooms').val();   //  selected meeting room
      $.ajax({
        url: '/issues.json',
        dataType: 'json',
        data: 'project_id='+project_id+'&cf_5='+meeting_room+'&limit='+50,
        beforeSend: function ( xhr ) {
          showSpinner();
        },
        success: function ( data ) {
          console.log('Get JSON success');
          if(buildEventsJSON(data)){
          $('#calendar').fullCalendar('removeEvents');
          $('#calendar').fullCalendar('addEventSource', eventsJSON);
          $('#calendar').fullCalendar('rerenderEvents');
          hideSpinner();
        }
        }
      });
      return true;
    }

    /*
      Author: shiju@qburst.com
      Description: build events json for fullcalendar
    */
    var buildEventsJSON = function(eventsRawJSON){
      window.console.log('Building Meetings JSON');
      count = eventsRawJSON.issues.length;
      event = eventsRawJSON.issues;
      eventsJSON = [];    //  events to be rendered on fullcalendar
      // building events json for fullcalendar
      for(var i=0; i<count; i++) {
        var eventClassName = '';
        if (isCurrentUser(event[i].author.id)){
          eventClassName ='myEvents';
        }
        var event_id      =event[i].id;
        author_name   =event[i].author.name;
        start_time_arr=event[i].custom_fields[0].value.split(':');
        end_time_arr  =event[i].custom_fields[1].value.split(':');
        meeting_room  =event[i].custom_fields[2].value;
        meeting_day_arr=event[i].custom_fields[3].value.split('-');
        var start_time    = new Date(meeting_day_arr[0],meeting_day_arr[1]-1, meeting_day_arr[2] ,start_time_arr[0], start_time_arr[1]);
        var end_time      = new Date(meeting_day_arr[0],meeting_day_arr[1]-1,meeting_day_arr[2] ,end_time_arr[0],end_time_arr[1]);
        var eventsub ='';
        var repl
        var limit
        if(event[i].subject.length>='36'){
          event[i].subject=stripSubject(event[i].subject,36)+" ...";
        }
        eventsJSON.push({title: event[i].subject,author:author_name, start: start_time,end: end_time,priority:event[i].priority.id, status:event[i].status.id, subject:event[i].subject, starttime: +start_time_arr[0]+':'+start_time_arr[1],endtime: +end_time_arr[0]+':'+end_time_arr[1],event_id:event_id,meeting_day:event[i].custom_fields[3].value,event_author_id: event[i].author.id,className: eventClassName, cache: true, allDay: false});
      }
      return true;
    }

  /*
    Author: shiju@qburst.com
    Description: checking whether event overlaps with exisiting events
  */
    var isOverlapping = function(eventStart, eventEnd) {  
      var event_id = $("#event_id") .val();
      var events = $('#calendar').fullCalendar('clientEvents');
      if(events.length == 0){
        return false;
      }
      if ($("#recurCheckbox").is(':checked')){
          var recur = $("input:radio[name=Week]:checked").val();
          if(recur == 5){
            recur_days = parseInt(recur)+2; // adding 2 to accomodate Saturday N Sunday of a week
          }else{
            recur_days = parseInt(recur)+4;  // adding 4 to accomodate Saturday N Sunday of 2 weeks
          }
      
      }else{
        var recur_days =1;
      }
         for(i in events){
          var temp_meeting_day=meeting_day.split("-")
          if(temp_meeting_day[1].count=1){
            temp_meeting_day[1]="0"+temp_meeting_day[1]
          }
          meeting_book_day  = new Date(temp_meeting_day[0],temp_meeting_day[1]-1,temp_meeting_day[2]);
          if (events[i].meeting_day != undefined){
            var temp_events_meeting_day=events[i].meeting_day.split('-');
            if(temp_events_meeting_day[1].count=1){
              temp_events_meeting_day[1]="0"+temp_events_meeting_day[1];
            }
            event_meeting_day = new Date(temp_events_meeting_day[0],temp_events_meeting_day[1]-1,temp_events_meeting_day[2]);
          }
          if(event_meeting_day != undefined || meeting_book_day != undefined){
            var difference =Math.abs(event_meeting_day - meeting_book_day);
          }
            if (difference != undefined){
            var days =Math.round(difference/(1000*60*60*24))
          }
            if(days >= 0 && days<recur_days){
              eventStartDay =  new Date(eventStart.getTime() + (24 * 60 * 60 * 1000*(days)));
              eventEndDay = new Date(eventEnd.getTime() + (24 * 60 * 60 * 1000*(days)));
              if(event_id == 0){
                console.log('Create')
                // start-time in between any of the events
                if(eventStartDay > events[i].start && eventStartDay < events[i].end){
                  return true;
                }
                //end-time in between any of the events
                if(eventEndDay > events[i].start && eventEndDay < events[i].end){
                  return true;
                }
                //any of the events in between/on the start-time and end-time
                if(eventStartDay <= events[i].start && eventEndDay >= events[i].end){
                  return true;
                }
              }
              else if(event_id != 0 && events[i].event_id != event_id){
                console.log('Update')
                // start-time in between any of the events
                if(eventStartDay > events[i].start && eventStartDay < events[i].end){
                  return true;
                }
                //end-time in between any of the events
                if(eventEndDay > events[i].start && eventEndDay < events[i].end){
                  return true;
                }
                //any of the events in between/on the start-time and end-time
                if(eventStartDay <= events[i].start && eventEndDay >= events[i].end){
                  return true;
                }
              }
            }
      }
      return false;
    }

    /*
      Author: shiju@qburst.com
      Description: stripping the subject text to fit into the calendar event and tooltip
    */
    var stripSubject = function (eventsub,limit){
      var strlen = eventsub.length
      if(strlen > limit)
      {
        return eventsub.substr(0,limit)   //.repl;
      }
      else
      {
        return eventsub;
      }
    }
     
    /*
      Author: shiju@qburst.com
      Description: checking whether the current user is same as the author of event
    */
    var isCurrentUser = function(event_author_id ){
      var current_user_id = $('#author_id').val();
      if((event_author_id==current_user_id)){
        return true;
      }
      else{
        return false;
      }
    }

    /*
      Author: shiju@qburst.com
      Description: checking whether the event start date is past today
    */
    var isPastDay = function(calDate){
      var current_date = new Date();
      if (calDate <= current_date){
        return true;
      }
      else{
        return false;
      }
    }

    /*
      Author: shiju@qburst.com
      Description: intialising fullcalendar to render events
    */
    var loadCalendar = function() {
      if(getEventsJSON()){
        console.log('Loading Meeting Calendar')
        $('#calendar').fullCalendar({
          allDaySlot: false,
          header: {
            left: 'today prev next',
            center: 'title',
            right: 'agendaWeek,agendaDay'
          },
          axisFormat: 'HH:mm',
          timeFormat: {agenda: 'HH:mm{ - HH:mm}'},
          defaultView: 'agendaWeek',
          editable: false,
          minTime: '8:30am',
          maxTime: '10:00pm',
          weekends: false,
          eventRender: function(event, element) {
              element.qtip({
                content: {
                  // Set the text and title fot the tooltip
                text: '<p>'+'Booked By: '+event.author+'<br />Start Time: '+event.starttime+'<br/>End Time: '+event.endtime+'</p>',
                title: {
                   text:  event.subject, // Give the tooltip a title using each elements text
                  }
                },
                position: {
                  corner: {
                     target: 'bottomMiddle', // Position the tooltip above the link
                     tooltip: 'topMiddle'
                  },
                  adjust: {
                     screen: true // Keep the tooltip on-screen at all times
                  }
                },
                show: { 
                  when: 'mouseover', 
                  solo: true // Only show one tooltip at a time
                },
                hide: { 
                  when: 'mouseout', 
                  solo: true // Hide tooltip
                },
                style: {
                  tip: true, // Apply a speech bubble tip to the tooltip at the designated tooltip corner
                  border: {
                     width: 0,
                     radius: 4
                  },
                  name: 'cream', // Use the default light style
                  width: 330 // Set the tooltip width
                }
            });
          },
          eventClick: function(calEvent, jsEvent, view) {
            var event_author_id = calEvent.event_author_id;
            isCurrentUser(event_author_id);
            $('input:checkbox').removeAttr('checked');
            meeting_day = calEvent.meeting_day;
            if (isPastDay(calEvent.start)){
              jAlert('You cannot edit past meetings','Info');
              return false;
            }
            else if(!(isCurrentUser(event_author_id))){
              console.log('It is an event created by another user');
              return false;
            }
            else{
              $('#subject').val(calEvent.subject);
              $('#issue_status_id').val(calEvent.status);
              $('#issue_priority_id').val(calEvent.priority);
              $('#event_id').val(calEvent.event_id);
              var x = calEvent.starttime.split(':');
              if(x[0].length== '1'){
              x[0]='0'+x[0];
              calEvent.starttime=x[0]+':'+x[1];
              }
              var y = calEvent.endtime.split(':')
              if(y[0].length=='1'){
              y[0]='0'+y[0];
              calEvent.endtime=y[0]+':'+y[1];
              }
              $('#start_time').val(calEvent.starttime);
              $('#end_time').val(calEvent.endtime);
              $('.saveMeetingModal').dialog({ title: 'Update an Event', modal: true, resizable: false, draggable: false, width: 400, show: 'blind', hide: 'explode'});
              $('.saveMeetingModal').dialog('open');
              $('.recurfield').hide();
              $('#recur_div').hide();
            }
          },
          dayClick: function(date, jsEvent, calEvent) {
            
              meeting_day = $.fullCalendar.formatDate( date, 'yyyy-MM-dd');
              if (isPastDay(date)){
                jAlert('You cannot book a meeting in past','Info');
                return false;
              }
              else
              {
                // clear field values
                $('#event_id').val(0);
                $('#subject').val('');
                $('#start_time').val('');
                $('#end_time').val('');
                $('input:checkbox').removeAttr('checked');
                // new meeting start time
                var start_time=$.fullCalendar.formatDate( date, 'HH:mm');    
                // new meeting end time 
                var end_time=$.fullCalendar.formatDate( new Date(date.setHours(date.getHours()+1)), 'HH:mm');
                $('#issue_status_id').val(1);   // Hard coded the status 'New' as default value
                $('#issue_priority_id').val(4); // Hard coded the priority 'Normal' as default value
                $('#start_time').val(start_time);
                $('#end_time').val(end_time);
                $('.saveMeetingModal').dialog({ title: 'Create an Event', modal: true, resizable: false, draggable: false, width: 400, show: 'blind', hide: 'explode'});
                $('.saveMeetingModal').dialog('open');
                $('.recurfield').show();
                $('#Week_5').attr( 'checked', true )
                $('#recur_div').hide();
                setEndTime();
              }   
          }
        }); 
      }
    }
    $('#recurCheckbox').click(function() {
      showHiderecurdiv();
    });

     /*
      Author: shiju@qburst.com
      Description: toggle show and hide of reccur checkbox
    */
    var showHiderecurdiv =function(){
      if ($('#recurCheckbox').is(':checked')){
        $('#recur_div').show('blind', {}, 500);
         var checked_value= $('input:radio[name=Week]:checked').val();
      }else{
        $('#recur_div').hide('blind', {}, 500);
        var checked_value= $('input:radio[name=Week]:checked').val();
        checked_value='';
      }
      return checked_value;
    }

    /*
      Author: shiju@qburst.com
      Description: show spinner
    */
   var  showSpinner = function(){
      $('#loading').show();
    }

    /*
      Author: shiju@qburst.com
      Description: hide spinner
    */
    var hideSpinner = function(){
      $('#loading').hide();
    }

    /*
      Author: shiju@qburst.com
      Description: reload calendar
    */
    var reloadCalendar = function(){
      if(getEventsJSON()){
        console.log('Reload Calender');
      }
    }

    $('#meeting_rooms').change(function() {
      reloadCalendar();
    });

    $('#start_time').change (function() {
      setEndTime();
    });

    /*
      Author: shiju@qburst.com
      Description: set end-time wrt the selected start-time
    */
    var setEndTime = function(){
      $('#end_time').empty().append(end_time_clone);
      var start_time_sel_index = '';
      start_time_sel_index = $('#start_time').prop('selectedIndex')-1;
      for(var j=start_time_sel_index; j>=0; j--){
        $('#end_time option:eq('+j+')').remove();
      }
      $('#end_time option:eq(1)').prop('selected', true);
      return true;
    }

    /*
      Author: shiju@qburst.com
      Description: validation to avaoid special characters in subject field
    */
      var validate = function(){
        var special_char = /[0-9a-zA-Z',-]+/;
        if (special_char.test($('#subject').val())){
          return true;
        }
        return false;
      }

    /*
      Author: shiju@qburst.com
      Description: go-to datepicker
    */
    $('#datepicker').datepicker({
      inline: true,
      minDate: 0, // past days disabled
      onSelect: function(dateText, inst) {
        var goto_date = new Date(dateText);
        $('#calendar').fullCalendar('changeView', 'agendaDay');
        $('#calendar').fullCalendar('gotoDate', goto_date);
      }
    });

    /*
      Author: shiju@qburst.com
      Description: create/update event
    */
    $('#save_meeting').click(function() {

      var start_time = $('#start_time').val();
      var end_time   = $('#end_time').val()

      if ($('#subject').val()==''){
        jAlert('All fields are mandatory','Info');
      }
      else{
        if ($('#recurCheckbox').is(':checked')){
          var checked_value= $('input:radio[name=Week]:checked').val();
      
        }else{

         var checked_value =1;
        }
        temp_meeting_day = meeting_day.replace(/\-/g,'/');
        var eventStart = new Date(temp_meeting_day+ ' ' + start_time+":00");
        var eventEnd = new Date(temp_meeting_day + ' ' + end_time+":00");
        if (isPastDay(eventStart)){
          jAlert('You cannot update meetings to past','Info');
          return false;
        }
        if(!(isOverlapping(eventStart, eventEnd))){
          if (validate()){
            console.log('No overlapping');
            $('.saveMeetingModal' ).dialog( 'close' );
            //setting the variable for update or create as required
            if($('#event_id').val()==0) {
              var action = 'create';
            }
            else {
              var action ='update';
            }
            $.ajax({
              url: 'meeting_calendars/'+action,
              data: {priority_id:$('#issue_priority_id').val(),
                    author_id:$('#author_id').val(),
                    status_id:$('#issue_status_id').val(),
                    subject:$('#subject').val(),
                    custom_field_values:{'6':meeting_day,'3':start_time, '4':end_time, '5':$('#meeting_rooms').val()},
                    event_id:$('#event_id').val(),
                    recur:checked_value},
              success: function(data){
                $('#event_id').val(0);
                reloadCalendar();
              }
            });
          }
          else {
            jAlert('Please enter a valid subject','Info');
          }
        }
        else {
          jAlert('Meeting room already booked','Alert');
        }
        $('#recur_meeting').val('');
      }
    });

    /*
      Author: shiju@qburst.com
      Description: Save the meeting on stroke of ENTER button
    */
    $('.saveMeetingModal').keypress(function(e) {
      if(e.which == 13) {
        jQuery('#save_meeting').focus().click();
        e.preventDefault();
        return false;
      }
    });

    loadCalendar(); // intial load calendar

  });