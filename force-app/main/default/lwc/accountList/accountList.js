import { LightningElement,track,wire} from 'lwc';
import getAccounts from '@salesforce/apex/AccountListController.getAccounts';
import {refreshApex} from '@salesforce/apex';
import {ShowToastEvent} from 'lightning/platformShowToastEvent';


const DEFAULT_LIMIT = 100;
export default class AccountList extends LightningElement {
    @track accounts=[];
    wiredAccounts=[];
    searchKey='';
    limitSize = DEFAULT_LIMIT;
    hasData = false;
    isLoading = true;
    
    columns = [
            {label:'Name' , type:'text' , fieldName:'Name' , sortable:true},
            {label:'Industry',type:'text',fieldName:'Industry', sortable:true},
            {label:'Phone',type:'phone',fieldName:'Phone',sortable:true},
            {label:'Annual Revenue', type:'currency',fieldName :'AnnualRevenue',sortable:true}
        ];

    
  showToast(title,message,variant,mode){
        this.dispatchEvent(new ShowToastEvent({title,message,variant,mode}));
        
    }


    @wire(getAccounts,{searchKey:'$searchKey',limitSize:'$limitSize'})
    accountsList(result){
        this.wiredAccounts = result;
        
        const {data,error} = result;
        if(data){
            console.log(data);
            
            if(data.length>0){
                this.accounts = data;
                this.hasData = true;
            }
            else{
                this.accounts=[];
                this.hasData =false;
                
            }
            this.isLoading = false;
    
        }else if(error){
             this.accounts = [];
             this.isLoading = false;
            this.hasData = false;
            this.showToast('Error',this.getErrorMessage(error),'error','sticky');
        }
    }
    

    

    handleChange(event){
        this.searchKey = event.target.value;
        console.log(this.searchKey);
    }

 

    getErrorMessage(err){
        if(Array.isArray(err?.body)){
            return err.body.map(e=>e.message).join(', ');
        }
        else{
            return err?.body?.message || err?.message || 'Unknown Error';
        }
    }
    async handleRefreshClick(){
        try{
            console.log('handle search called');
            this.isLoading = true;
            await refreshApex(this.wiredAccounts);
            this.isLoading = false;
            console.log(this.accounts );

        }
        catch(error){
             this.isLoading = false;
             this.hasData = false;
             this.showToast('Error',this.getErrorMessage(error),'error','sticky');
        }


    }
}