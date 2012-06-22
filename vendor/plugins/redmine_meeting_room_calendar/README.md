Google Apps login for Redmine
=============================

This Redmine plugin allows you to book and thence display meetings on a calendar interface


Requirements
------------

* Redmine 1.3.x or 1.4.x

Install
-------

Clone the plugin source code into your Redmine's plugin directory.

    git clone git://github.com/waj/redmine_google_apps.git vendor/plugins/redmine_meeting_room_calendar

**NOTE:** Make sure the plugin directory is name `redmine_meeting_room_calendar`.


Setup
-----

Login with your administrator account, 

Create Tracker
        From Admin Menu click on Trackers.
        Click on New tracker and add a new one for our present project(say Book Meeting).
        On Admin Menu List
        Click on Custom Fields.
        There at the bottom click on New custom field, and add: Start Time, End Time, Meeting Room, Meeting Day,which are necessary for our present project.
        Mark the tracker as the one added from previous step(Book Meeting).
        Make the format as List
        Give possible values.
        Give no Default value
        Check the “Required ”, “Searchable” and “Used as a filter” boxes(Used as filter is not checked for Start Time and End Time).
        Note the custom field ids’ from the URI.
        Creating Rooms(Users)
        From the Admin Menu select Users
        Click on New User at top right corner and create as much new ones as necessary; with names as that intended for the meeting rooms (do not check the Administrator box).                    
        Now Back to the Admin Menu
        Click on Projects.
        Top right corner New Project.
        Give name of the project (say Book Meeting Room).
        Give  unique name as identifier.
        Check the trackers as the tracker we created for our project (say Book Meeting) alone.
        Check all the aforesaid custom Fields added and Save.
        Now skip to the Members tab ,add the rooms(users) created to the Meeting room project and mark their role as manager to the project .
        Save the project.

How it Works
        *The plug-in uses a Fullcalendar jQuery plug-in which uses ajax calls to fetch the events,which are the booked meeting rooms in Redmine by various employees.
        *The calendar has a toggleable Week view and Day view on the top right corner; of which the Week view is the default.
        *The Week view has the span of the week written as the title along with the year.
        *There is also a Go to date picker to take the user to a future date he/she wants to take a quick view.
        *This also helps in reducing the clicks required to book a meeting room in some far future.
        *There is also a drop down, populated with all the meeting rooms available at the time, to select whichever room a user wants to book a room.
        *There is a quick jump Today button to take the user to the present day so that the status of a particular room for such a day could be viewed.
        *Both the Week view and Day view exhibit a time line from 09:00 to 21:00 with the aid of which a meeting room can be booked at various time slots between 08:30 to 22:00, avoiding an overlap.
        *Events could be booked also on a recurring basis. The available options are for one week and two weeks, in which case the meeting room goes occupied for the specified time range for one or two weeks as specified.
        *On the event of an overlap about to occur the calendar itself alerts the scheduler about the issue and in no case will it be possible to book an event ignoring the alert.
        *The meeting rooms are booked with the currently logged in user's authorship.
        *The main feature of the suggested plug-in is that knowing the Project Id and Issue tracker Id of the Book Meeting Project, the plug-in is stand alone in that no other files need to be edited in the actual project. The plug-in file goes into the plugins folder in vendor folder.
        *For easy realization of the situation, the title bars of rooms booked by the presently logged in user is made different in color while displaying along with the others(viz cyan and blue )
        *Besides booking, a meeting room can also be edited; only by the author of the room.
        *The plug-in requires some details like project_id and tracker_id to be hard coded in meeting_calendars_controller.rb
        *The custom_field values from the database needs to be hard coded in meeting_calendars_controller.rb
        *The custom_field values from the rendered json needs to be hard coded in meeting_calendar.js
        *In meeting_calendars_controller.rb, lines 6,8,11,13,15,25 and 40 needs hard coded values.
        *In meetingcalendar.js, lines lines 52,54,56 and 58 needs hard coded values.
        *In spite some hard coding, the plug-in will be an added asset for better project management.