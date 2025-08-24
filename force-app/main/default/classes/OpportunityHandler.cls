public with sharing class OpportunityHandler {
  public static void afterStageUpdate(List<Opportunity> oppList,Map<Id,Opportunity> oldMap){

   List<OpportunityFollowUpTask__mdt> oppFollowedUpTaskList = [SELECT DueDaysToFollowUp__c,StageName__c,TaskSubject__c FROM OpportunityFollowUpTask__mdt];
    Map<String,OpportunityFollowUpTask__mdt> oppFollowedUpTaskMap = new Map<String,OpportunityFollowUpTask__mdt>();
    
    List<Task> taskToInsert = new List<Task>();
    for(OpportunityFollowUpTask__mdt oppFollTask : oppFollowedUpTaskList){
       
        oppFollowedUpTaskMap.put(oppFollTask.StageName__c,oppFollTask);
    }
    for(Opportunity opp:oppList){
        Opportunity oldOpp = oldMap.containsKey(opp.id)? oldMap.get(opp.id):null;

        if(oldOpp!=null && oldOpp.StageName !=opp.StageName && oppFollowedUpTaskMap.containsKey(opp.StageName)){
            OpportunityFollowUpTask__mdt mdt = oppFollowedUpTaskMap.get(opp.StageName);
            Task tk = new Task(
                OwnerId = opp.OwnerId,
                WhatId = opp.id,
                subject = mdt.TaskSubject__c,
                ActivityDate = Date.today().addDays(Integer.valueOf(mdt.DueDaysToFollowUp__c))
               );
            taskToInsert.add(tk);
        }
    }
    if(!taskToInsert.isEmpty()){
        insert taskToInsert;
    }
  } 
}