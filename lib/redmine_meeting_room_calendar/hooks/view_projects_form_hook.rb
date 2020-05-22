module RedmineMeetingRoomCalendar
  module Hooks
    class ViewProjectsFormHook < Redmine::Hook::ViewListener
      render_on(:view_projects_form, :partial => 'projects/project_meeting_rooms', :layout => false)
    end
  end
end
