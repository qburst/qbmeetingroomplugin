ActionController::Routing::Routes.draw do |map|

 map.connect '/meeting_room_calendar', :controller => 'meeting_room_calendar', :action => 'index'
 map.connect '/meeting_room_calendar/create', :controller => 'meeting_room_calendar', :action => 'create'
 map.connect '/meeting_room_calendar/update', :controller => 'meeting_room_calendar', :action => 'update'
end
