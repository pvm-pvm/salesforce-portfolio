public with sharing class ContactSearchController {

    public class ContactWrapper{
       @AuraEnabled public Id id {get;set;}
       @AuraEnabled public String LastName {get;set;}
       @AuraEnabled public String FirstName {get;set;}
       @AuraEnabled public String Email {get;set;}
       @AuraEnabled public String Phone {get;set;}
       @AuraEnabled public String AccountName {get;set;}
    public ContactWrapper(Contact con){
            this.id = con.Id;
            this.LastName = con.LastName;
            this.Email = con.Email;
            this.Phone = con.Phone;
            this.AccountName = con.Account.Name;
        }
    }


    @AuraEnabled(cacheable=false)
    public static List<ContactWrapper> getContactsByAccountName(String accName, Integer limitSize){
            if(String.isBlank(accName)){
                throw new AuraHandledException('Account Name is required');
            }

            if(limitSize == null || limitSize < 0 ){
                limitSize = 50;
            }
            try{
                String searchKey = '%' + accName.trim() + '%';
                List<ContactWrapper> conWrapperResult = new List<ContactWrapper>();
                List<Contact> conList = ([SELECT Id,LastName,FirstName,Email,Phone,Account.Name 
                    FROM Contact
                    WHERE Account.Name LIKE :searchKey
                    WITH SECURITY_ENFORCED
                    ORDER BY Account.Name
                    LIMIT :limitSize
                    ]);
                for(Contact con:conList){
                    conWrapperResult.add(new ContactWrapper(con));
                }

                return conWrapperResult;

            }catch(Exception e){
             throw new AuraHandledException('Error while searching contacts by account name'+e.getMessage());
             }
    }
}