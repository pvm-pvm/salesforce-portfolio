import { LightningElement, track} from 'lwc';
import getContactsByAccountName from '@salesforce/apex/ContactSearchController.getContactsByAccountName';
const DEFAULT_LIMIT = 50;
export default class ContactSearch extends LightningElement {
    columns = [
        {label:'Last Name', fieldName:'LastName' ,type:'text'},
        {label:'Email' , fieldName:'Email', type:'email'},
        {label:'Phone',fieldName:'Phone',type:'phone'},
        {label:'Account Name',fieldName:'AccountName',type:'text'}
    ]
    defaultLimit = DEFAULT_LIMIT;
    isSearching = false;
    
    accountName = '';
    @track contacts = [];
    message=null;

    handleInputChange(event){
        this.accountName = event.target.value;
    }

    formattedError(error){
        if(Array.isArray(error?.body)){
            return error.body.map(e=>e.message).join(', ');
        } else if(error?.body && typeof error.body.message ==='string') {
            return error.body.message;
        }else{
            return 'Unknown error';
        } 
    }
    async handleSearch(){
        console.log("handle search called");
        this.isSearching = true;
        try{
            const result = await getContactsByAccountName({accName:this.accountName,limitSize:this.defaultLimit});
            if(result && result.length > 0){
                this.contacts = result;
                this.hasData = true;
            }
            else{
                this.message ='Records not found';
                this.hasData = false;
            }
        }
        catch(error){
            this.message = this.formattedError(error);
        }finally{
            this.isSearching = false;
        }
    }

    get hasData(){
        return this.contacts && this.contacts.length>0;
    }
}