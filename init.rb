require 'redmine'

Redmine::Plugin.register :redmine_meeting_room_calendar do
  name 'Redmine Meeting Room Calendar plugin'
  author 'QBurst, Tobias Droste'
  description 'This is a plugin for Redmine to see meeting rooms on a particular day on the calendar'
  version '1.9.9'
  url 'http://www.qburst.com'
  author_url 'http://www.qburst.com/company/about'

  
  permission :meeting_room_calendar, { :meeting_calendars => [:index] }, :public => true
  menu :top_menu, :meeting_room_calendar, { :controller => 'meeting_room_calendar', :action => 'index' }, :caption => 'Book Meeting Room', :after => :help
end




