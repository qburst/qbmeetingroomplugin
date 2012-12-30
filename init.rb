require 'redmine'

Redmine::Plugin.register :redmine_meeting_room_calendar do
  name 'Redmine Meeting Room Calendar plugin'
  author 'QBurst'
  description 'This is a plugin for Redmine to see meeting rooms on a particular day on the calendar'
  version '0.0.1'
  url 'http://www.qburst.com'
  author_url 'http://www.qburst.com/company/about'

  
  permission :meeting_calendars, { :meeting_calendars => [:index] }, :public => true
  menu :application_menu, :meeting_calendars, { :controller => 'meeting_calendars', :action => 'index' }, :caption => 'Book Meeting Room'
  menu :top_menu, :meeting_calendars, { :controller => 'meeting_calendars', :action => 'index' }, :caption => 'Book Meeting Room', :after => :help
end




