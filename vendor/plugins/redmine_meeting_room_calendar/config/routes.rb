ActionController::Routing::Routes.draw do |map|

 map.connect '/meeting_calendars', :controller => 'meeting_calendars', :action => 'index'
 map.connect '/meeting_calendars/create', :controller => 'meeting_calendars', :action => 'create'
 map.connect '/meeting_calendars/update', :controller => 'meeting_calendars', :action => 'update'
end
