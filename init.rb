require 'redmine'

Redmine::Plugin.register :redmine_meeting_room_calendar do
  name 'Redmine Meeting Room Calendar plugin'
  author 'QBurst, Tobias Droste'
  description 'This is a plugin for Redmine to see meeting rooms on a particular day on the calendar'
  version '2.1.3'
  requires_redmine :version_or_higher => '2.0.0'

  permission :meeting_room_calendar, { :meeting_room_calendar => [:index] }, :public => true
  menu :top_menu, :meeting_room_calendar, { :controller => 'meeting_room_calendar', :action => 'index' }, :caption => :label_name, :after => :help

  settings :default => {'project_id' => '0',
                        'project_ids' => [],
                        'tracker_id' => '0',
                        'custom_field_id_room' => '0',
                        'custom_field_id_start' => '0',
                        'custom_field_id_end' => '0',
                        'show_project_menu' => '1',
                        'show_categories' => '0',
                        'hide_projects' => '1',
                        'hide_rooms' => '0',
                        'allow_changing_old_meetings' => '0',
                        'allow_drag_and_drop' => '0',
                        'allow_resize' => '0'},
           :partial => 'meeting_room_calendar/meeting_room_calendar_settings'
end

ActionDispatch::Callbacks.to_prepare do
  require_dependency 'project'
  Project.send(:include, RedmineMeetingRoomCalendar::Patches::ProjectPatch)
end

require 'redmine_meeting_room_calendar/hooks/view_projects_form_hook'