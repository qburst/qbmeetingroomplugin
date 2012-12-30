class MeetingRoomCalendarController < ApplicationController
  unloadable

  def initialize
    super()

    @project_id = "215" #Hard Coded project_id for Book Meeting Room Project 
    @tracker_id = '9'   #Hard Coded tracker_id for Book Meeting Room Project
    @custom_field_id_room = 0 #Hard Coded
    @custom_field_id_start = 0 #Hard Coded
    @custom_field_id_end = 0 #Hard Coded

    if check_settings()
      @start_time = CustomField.find_by_id(@custom_field_id_start).possible_values
      @end_time =  CustomField.find_by_id(@custom_field_id_end).possible_values
      @meeting_rooms = CustomField.find_by_id(@custom_field_id_room).possible_values
    end
  end

  def index
    if !check_settings()
      return
    end

    @project = Project.find_by_id(@project_id);
    @user = User.current.id
    @user_name = User.current.name
    @user_last_name = User.current.name(:lastname_coma_firstname)
    @assignable_users = @project.assignable_users.map { |user| [user.name, user.id] }
  end

  def create
    recur_meeting = params[:recur]
    recur_type = params[:periodtype].to_i
    recur_period = params[:period].to_i
    meeting_day = params[:start_date]
    meeting_date = Date.parse(meeting_day)

    if (recur_meeting != "true")
      recur_type = 1
      recur_period = 1
    end

    while recur_period > 0
      week_day = meeting_date.wday # 0->Sunday, 6-> Saturday
      if(week_day!=6 && week_day!=0)
        @calendar_issue= Issue.new
        @calendar_issue.project_id = @project_id
        @calendar_issue.tracker_id = @tracker_id
        @calendar_issue.subject = params[:subject]
        @calendar_issue.author_id = params[:author_id]
        @calendar_issue.assigned_to_id = params[:assigned_to_id]
        @calendar_issue.start_date = meeting_date
        @calendar_issue.due_date = @calendar_issue.start_date
        @calendar_issue.custom_field_values = params[:custom_field_values]
        @calendar_issue.save!
      else
      recur_period +=1
      end
      meeting_date += recur_type
      recur_period -=1
    end
  end

  def update
    meeting_day   = params[:start_date]
    meeting_date  = Date.parse(meeting_day)

    @calendar_issue = Issue.new
    @calendar_issue.project_id = @project_id
    @calendar_issue.tracker_id = @tracker_id
    @calendar_issue = Issue.find(params[:event_id])
    @calendar_issue.subject = params[:subject]
    @calendar_issue.assigned_to_id = params[:assigned_to_id]
    @calendar_issue.start_date = meeting_date
    @calendar_issue.due_date = @calendar_issue.start_date
    @calendar_issue.custom_field_values = params[:custom_field_values]
    @calendar_issue.save!
  end

  def delete
    @calendar_issue = Issue.find(params[:event_id])
    begin
      @calendar_issue.reload.destroy
    rescue ::ActiveRecord::RecordNotFound # raised by #reload if issue no longer exists
      # nothing to do, issue was already deleted (eg. by a parent)
    end
  end

  def check_settings()
    if @project_id == nil || @project_id.to_s == "0" || @project_id.to_s == ""
      return false
    end
    if @tracker_id == nil || @tracker_id.to_s == "0" || @project_id.to_s == ""
      return false
    end
    if @custom_field_id_room == nil || @custom_field_id_room.to_s == "0" || @custom_field_id_room.to_s == ""
      return false
    end
    if @custom_field_id_start == nil || @custom_field_id_start.to_s == "0" || @custom_field_id_start.to_s == ""
      return false
    end
    if @custom_field_id_end == nil || @custom_field_id_end.to_s == "0" || @custom_field_id_end.to_s == ""
      return false
    end

    return true
  end
end
