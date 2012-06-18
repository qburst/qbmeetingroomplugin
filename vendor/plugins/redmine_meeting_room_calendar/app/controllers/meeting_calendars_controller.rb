class MeetingCalendarsController < ApplicationController
  unloadable
  before_filter :require_login
  
  def initialize
         @project_id = "215" #Hard Coded project_id for Book Meeting Room Project 
         @tracker_id = '9'   #Hard Coded tracker_id for Book Meeting Room Project
         @custom_field = CustomField.all    
         @start_time = @custom_field[2].possible_values #Hard Coded custom field value for start times for Book Meeting Room Project
         @end_time = @custom_field[3].possible_values  #Hard Coded custom field value for end times for Book Meeting Room Project
         @meeting_rooms=@custom_field[4].possible_values  #Hard Coded custom field value for meeting rooms for Book Meeting Room Project
  end

  def index
        @user = User.current.id
  end

  def create
   recur_meeting = params[:recur].to_i
   meeting_day   = params[:custom_field_values]["6"]
   meeting_date  = Date.parse(meeting_day)
  
   while recur_meeting > 0
     week_day = meeting_date.wday # 0->Sunday, 6-> Saturday
     if(week_day!=6 && week_day!=0)
       @calendar_issue= Issue.new
       @calendar_issue.project_id = @project_id
       @calendar_issue.tracker_id = @tracker_id
       @calendar_issue.priority_id =params[:priority_id]
       @calendar_issue.subject     =params[:subject]
       @calendar_issue.status_id   =params[:status_id]
       @calendar_issue.author_id   =params[:author_id]
       custom_fields       = params[:custom_field_values]
       custom_fields['6']  = meeting_date.strftime("%Y-%m-%d")
       @calendar_issue.custom_field_values=custom_fields
       @calendar_issue.save!
     else
       recur_meeting +=1
     end
     meeting_date += 1
     recur_meeting -=1
   end
  end

  def update
    @calendar_issue= Issue.new
    @calendar_issue.project_id = @project_id
    @calendar_issue.tracker_id = @tracker_id
    @calendar_issue= Issue.find(params[:event_id])
    @calendar_issue.priority_id=params[:priority_id]
    @calendar_issue.subject=params[:subject]
    @calendar_issue.status_id=params[:status_id]
    @calendar_issue.author_id=params[:author_id]
    @calendar_issue.custom_field_values=params[:custom_field_values]
    @calendar_issue.save!
  end

end
