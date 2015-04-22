# Plugin's routes
# See: http://guides.rubyonrails.org/routing.html

get 'meeting_room_calendar/', :to => 'meeting_room_calendar#index'
get 'meeting_room_calendar/:project_id', :to => 'meeting_room_calendar#index', :project_id => /\d+/
get 'meeting_room_calendar/index', :to => 'meeting_room_calendar#index'
get 'meeting_room_calendar/index/:project_id', :to => 'meeting_room_calendar#index', :project_id => /\d+/
get 'meeting_room_calendar/missing_config', :to => 'meeting_room_calendar#missing_config'
get 'meeting_room_calendar/create', :to => 'meeting_room_calendar#create'
get 'meeting_room_calendar/update', :to => 'meeting_room_calendar#update'
get 'meeting_room_calendar/delete', :to => 'meeting_room_calendar#delete'