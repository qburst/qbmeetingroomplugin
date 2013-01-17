Meeting Calendar for Redmine
=============================

This Redmine plugin allows you to book and thence display meetings on a calendar interface


# Requirements
------------

* Redmine 2.x (does not work with Redmine 1.x)

# Install
-------

Clone the plugin source code into your Redmines plugin directory:

    git clone https://github.com/dro123/redmine_meeting_room_calendar.git
    (original code: git clone https://github.com/QBurst/qbmeetingroomplugin.git)

**NOTE:** Make sure the plugin directory is named `redmine_meeting_room_calendar`.

Run the following command from a command line:

    rake redmine:plugins:migrate

# Setup
-----

Login with your administrator account and go to the admin menu.

## 1. Create Project
Create new project that holds the bookings for the rooms and add all the groups and users that should be allowed to book meetings.

## 2. Create Tracker
Create a new tracker, name it something like 'Meeting' and make sure that the standard fields 'Assignee', 'Start date' and 'Due date' are selected and copy the workflow from a already existing tracker (e.g. 'Bug')
![ScreenShot](https://raw.github.com/dro123/redmine_meeting_room_calendar/master/screenshots/1_new_tracker.png)

## 3. Create CustomFields
Create 3 new custom fields: Room, Start time, End time.

### Room
Name: Something like 'Room' (the name does not matter).  
**Format:** List  
**Multiple values:** No  
**Possible values:** A list of rooms you want to be able to book meetings for  
**Default value:** none  
**Trackers:** 'Meeting' or whatever you called the tracker you created.  
**Required:** Yes  
**For all projects:** No  
**Used as a filter:** Yes  
**Searchable:** Yes  
![ScreenShot](https://raw.github.com/dro123/redmine_meeting_room_calendar/master/screenshots/2_new_customfield1.png)

### Start time
**Name:** Something like 'Start time' (the name does not matter).  
**Format:** List  
**Multiple values:** No  
**Possible values:**  
06:00  
06:15  
06:30  
06:45  
07:00  
07:15  
07:30  
07:45  
08:00  
08:15  
08:30  
08:45  
09:00  
09:15  
09:30  
09:45  
10:00  
10:15  
10:30  
10:45  
11:00  
11:15  
11:30  
11:45  
12:00  
12:15  
12:30  
12:45  
13:00  
13:15  
13:30  
13:45  
14:00  
14:15  
14:30  
14:45  
15:00  
15:15  
15:30  
15:45  
16:00  
16:15  
16:30  
16:45  
17:00  
17:15  
17:30  
17:45  
18:00  
18:15  
18:30  
18:45  
19:00  
19:15  
19:30  
19:45  
20:00  
20:15  
20:30  
20:45  
21:00  
**Default value:** none  
**Trackers:** 'Meeting' or whatever you called the tracker you created.  
**Required:** Yes  
**For all projects:** No  
**Used as a filter:** No  
**Searchable:** Yes  
![ScreenShot](https://raw.github.com/dro123/redmine_meeting_room_calendar/master/screenshots/3_new_customfield2.png)

### End time
**Name:** Something like 'End time' (the name does not matter).  
**Format:** List  
**Multiple values:** No  
**Possible values:** same as 'Start time'  
**Default value:** none  
**Trackers:** 'Meeting' or whatever you called the tracker you created.  
**Required:** Yes  
**For all projects:** No  
**Used as a filter:** No  
**Searchable:** Yes  
![ScreenShot](https://raw.github.com/dro123/redmine_meeting_room_calendar/master/screenshots/4_new_customfield3.png)

## 4. Setup project
Go to the project settings of the project you created.  
In the 'Information' panel set:  
**Trackers:** 'Meeting' (or whatever you called the tracker you created)  
**Custom fields:** 'Room', 'Start time', 'End time' (or whatever you called the custom fields you created)  
![ScreenShot](https://raw.github.com/dro123/redmine_meeting_room_calendar/master/screenshots/5_project_settings.png)

## 5. Configure Plugin
Go to the plugin settings in Admin -> Plugins and click on 'Configure' for the plugin 'Redmine Meeting Room Calendar plugin'.
* Select the project you created
* Select the tracker you created
* Select the custom fields you created
* Decide wheter the project menu should be visible in the calendar view
![ScreenShot](https://raw.github.com/dro123/redmine_meeting_room_calendar/master/screenshots/6_plugin_settings.png)

## 6. Configure Redmine
Go to the plugin settings in Admin -> Settings -> Authentication
If 'Authentication required' is activated or the project you created is not public you have to enable the REST web service authentication with 'Enable REST web service'.
![ScreenShot](https://raw.github.com/dro123/redmine_meeting_room_calendar/master/screenshots/7_redmine_settings.png)

# How it Works

* The plug-in uses a Fullcalendar jQuery plug-in which uses ajax calls to fetch the events,which are the booked meeting rooms in Redmine by various employees.
* The calendar has a toggleable Moth view, Week view and Day view on the top right corner; of which the Week view is the default.
* The Week view has the span of the week written as the title along with the year.
* There is also a Go to date picker to take the user to a future date he/she wants to take a quick view.
* This also helps in reducing the clicks required to book a meeting room in some far future.
* There is also a drop down, populated with all the meeting rooms available at the time, to select whichever room a user wants to book a room.
* There is a quick jump Today button to take the user to the present day so that the status of a particular room for such a day could be viewed.
* Both the Week view and Day view exhibit a time line from 06:00 to 21:00 with the aid of which a meeting room can be booked at various time slots between 06:00 to 20:45, avoiding an overlap.
* Events could be booked also on a recurring basis. The available options are daily, weekly and bi-weekly, in which case the meeting room goes occupied for the specified time range.
* On the event of an overlap about to occur the calendar itself alerts the scheduler about the issue and in no case will it be possible to book an event ignoring the alert.
* The meeting rooms are booked with the currently logged in users authorship but can be assigned to another user.
* The main feature of the suggested plug-in is that knowing the Project Id and Issue tracker Id of the Book Meeting Project, the plug-in is stand alone in that no other files need to be edited in the actual project.
* For easy realization of the situation, the title bars of rooms booked by the presently logged in user is made different in color while displaying along with the others and marked with a wrench.
* Besides booking, a meeting room can also be edited; only by the author or the assigned person of the booking.
* The plug-in requires some details like project_id and tracker_id to be defined in the plugin configuration.

# Screenshots

![ScreenShot](https://raw.github.com/dro123/redmine_meeting_room_calendar/master/screenshots/screenshot_index1.png)

![ScreenShot](https://raw.github.com/dro123/redmine_meeting_room_calendar/master/screenshots/screenshot_add1.png)

![ScreenShot](https://raw.github.com/dro123/redmine_meeting_room_calendar/master/screenshots/screenshot_update_delete1.png)
