trigger OpportunityTrigger on Opportunity (after update) {
    if(Trigger.isAfter){
        if(Trigger.isUpdate){
            OpportunityHandler.afterStageUpdate(Trigger.new,Trigger.oldMap);
        }
    }
}