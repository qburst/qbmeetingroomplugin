module RedmineMeetingRoomCalendar
  module Patches
    module ProjectPatch
      def self.included(base)
        base.class_eval do
          safe_attributes 'project_meeting_rooms'
        end
      end
    end
  end
end
