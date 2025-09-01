public with sharing class AccountListController {
  private Static integer DEFAULT_LIMIT = 50;
    @AuraEnabled(cacheable=true)
   public static List<Account> getAccounts(String searchKey,Integer limitSize){
       if(limitSize == null || limitSize < 0 ) {
        limitSize = DEFAULT_LIMIT;
       }
        
        searchKey = searchKey.trim();
        String searchKeyExp = '%'+searchKey+'%';
        return ([SELECT id,Name,Industry,Phone,AnnualRevenue
        FROM Account 
        WHERE Name like :searchKeyExp
        WITH SECURITY_ENFORCED
        LIMIT :limitSize]);
   }

}