public with sharing class ExpenseTrackerController {

@AuraEnabled(cacheable=true)
public static List<Expense__c> getExpenses(){
    return [SELECT ID,Name,Amount__C,Date__c from Expense__c WITH SECURITY_ENFORCED ORDER BY Date__c DESC ];
}

@AuraEnabled
 public static Expense__c addExpense(String name,Decimal amount,Date expDate ){
    
       Expense__c exp = new Expense__c(
        Name=name,
        Amount__c = amount,
        Date__c = expDate
    );
   

    if (Schema.SObjectType.Expense__c.isCreateable()
    && Schema.SObjectType.Expense__c.fields.Name.isCreateable()
    && Schema.SObjectType.Expense__C.fields.Amount__c.isCreateable()
    && Schema.SObjectType.Expense__C.fields.Date__c.isCreateable()
    ) {
        // User has create access to the object
        insert exp;
    } else {
        // Handle insufficient permissions
        System.debug('User does not have create permission for Expense__c');
    }

    return exp;
 }
}