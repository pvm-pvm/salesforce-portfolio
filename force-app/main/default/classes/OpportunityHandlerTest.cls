/**
 * This class contains unit tests for validating the behavior of Apex classes
 * and triggers.
 *
 * Unit tests are class methods that verify whether a particular piece
 * of code is working properly. Unit test methods take no arguments,
 * commit no data to the database, and are flagged with the testMethod
 * keyword in the method definition.
 *
 * All test methods in an org are executed whenever Apex code is deployed
 * to a production org to confirm correctness, ensure code
 * coverage, and prevent regressions. All Apex classes are
 * required to have at least 75% code coverage in order to be deployed
 * to a production org. In addition, all triggers must have some code coverage.
 * 
 * The @isTest class annotation indicates this class only contains test
 * methods. Classes defined with the @isTest annotation do not count against
 * the org size limit for all Apex scripts.
 *
 * See the Apex Language Reference for more information about Testing and Code Coverage.
 */
@isTest
private class OpportunityHandlerTest {

    @isTest
    static void afterStageUpdateTest() {

        OpportunityFollowUpTask__mdt mdt = [SELECT  
        DueDaysToFollowUp__c,StageName__c,TaskSubject__c 
        FROM OpportunityFollowUpTask__mdt LIMIT 1 ];

       //Create opp record

       Opportunity opp = new Opportunity(Name='Test Opp Update',StageName='Prospecting',CloseDate=System.Today()+5,
       OwnerId=UserInfo.getUserId());
       insert opp;
       
       Opportunity oppToUpdate = [select id,Name,StageName,OwnerId from Opportunity where id=:opp.id limit 1];

       // Update opp to trigger after update
       Test.startTest();
       oppToUpdate.StageName = mdt.StageName__c;
       update oppToUpdate;
       Test.stopTest();
 
        Task task = [
            SELECT OwnerId,Subject, ActivityDate, WhatId 
            FROM Task 
            WHERE WhatId = :oppToUpdate.Id
            Limit 1
        ];

        system.assertEquals(oppToUpdate.OwnerId,task.OwnerId,'Task OwnerId should be same as Opportunity OwnerId');
        system.assertEquals(oppToUpdate.id,task.WhatId,'Task WhatId should be same as Opportunity Id');
        system.assertEquals(Date.today().addDays(Integer.valueOf(mdt.DueDaysToFollowUp__c)),task.ActivityDate,
        'Task ActivityDate should be calculated based on DueDaysToFollowUp__c');


    }
}