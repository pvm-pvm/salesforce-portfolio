import { LightningElement,track,wire} from 'lwc';
import addExpense from '@salesforce/apex/ExpenseTrackerController.addExpense';
import getExpenses from '@salesforce/apex/ExpenseTrackerController.getExpenses';
import {refreshApex} from '@salesforce/apex';
import {ShowToastEvent} from 'lightning/platformShowToastEvent';

export default class ExpenseTracker extends LightningElement {
    @track expenses;
    expenseName = '';
    expenseAmount= 0;
    expenseDate= null;
    wiredExpenseResult; // this to hold full wired result to refeshApex
    isSaving = false;

         columns = [
    { label: 'Name', fieldName: 'Name' },
    { label: 'Amount', fieldName: 'Amount__c', type: 'Currency' },
    { label: 'Date', fieldName: 'Date__c', type: 'Date' },
   
];

     
@wire(getExpenses)
wiredExpenses(result){
    this.wiredExpenseResult = result;
    const {data,error} = result;
    if(data){
        console.log('result got from wire',data);
        this.expenses = data;
    }
    else if(error){
        console.log(error);
    }
    }




handleNameChange(event){
    this.expenseName = event.target.value;
}
handleAmountChange(event){
    this.expenseAmount = parseFloat(event.target.value);
}

handleDateChange(event){
    this.expenseDate = event.target.value;
}

normalizeError(err){
    if(Array.isArray(err?.body)) return err.body.map(e=>e.message).join(', ');
    return err?.body?.message || err?.message || 'Unknown Error';

}

get isDisabled(){
       return ( this.isSaving || 
       !(this.expenseName && this.expenseName.trim().length>0) ||
       !(this.expenseAmount > 0) ||
       !(this.expenseDate ));
}

showToast(title,message,variant){
    this.dispatchEvent(new ShowToastEvent({title,message,variant}));
}



async handleAddExpense(){
    if(this.isDisabled) return;
    this.isSaving = true;
    try{

        await addExpense({name:this.expenseName,
            amount:this.expenseAmount,expDate:this.expenseDate});
        this.showToast('Success','Expense Added','success');
        await refreshApex(this.wiredExpenseResult);
       
    }catch(error){
        this.showToast('Error',this.normalizeError(error),'error');
    }
    finally{    
         this.expenseName='';
        this.expenseAmount=0;
        this.expenseDate=null;
        this.isSaving = false;
    }
}




/*
handleAddExpense2(event){
    // if (event && typeof event.preventDefault === 'function') {
    //     event.preventDefault();
    // }
    
    if(this.isDisabled) return;
    this.isSaving = true;
    console.log(this.isDisabled,this.expenseName, this.expenseAmount , this.expenseDate);
    addExpense({name:this.expenseName, amount:this.expenseAmount , expDate:this.expenseDate})
    .then(() =>{
        // mode : dismissible ,sticky, pester - optional (dismissilbe is default) 
        // variant : success ,error, info, warning
        this.dispatchEvent(new ShowToastEvent({
            title:'Success',
            message:'Expense Added',
            variant:'success'
        }))
       return refreshApex(this.wiredExpenseResult);
        }
    )
    .catch((error)=>{
        this.dispatchEvent(new ShowToastEvent ({
            title:'Error',
            message: this.normalizeError(error),
            variant:'error'
        }))
    }).finally(()=>{
        this.expenseName='';
        this.expenseAmount = 0;
        this.expenseDate =null;
        this.isSaving = false;
    });
}   
*/

}   