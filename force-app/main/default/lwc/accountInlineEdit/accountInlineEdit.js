import { LightningElement, api, wire, track } from "lwc";
import { getRecord, updateRecord } from "lightning/uiRecordApi";
import { ShowToastEvent } from "lightning/platformShowToastEvent";
import NAME_FIELD from "@salesforce/schema/Account.Name";
import PHONE_FIELD from "@salesforce/schema/Account.Phone";
import ANNUALREVENUE_FIELD from "@salesforce/schema/Account.AnnualRevenue";

export default class AccountInlineEdit extends LightningElement {
  @api recordId;
  @track account = {};

  toast(title, message, variant) {
    this.dispatchEvent(new ShowToastEvent({ title, message, variant }));
  }
  @wire(getRecord, {
    recordId: "$recordId",
    fields: [NAME_FIELD, PHONE_FIELD, ANNUALREVENUE_FIELD]
  })
  wiredAccount({ data, error }) {
    if (data) {
      this.account = data;
    } else if (error) {
      this.toast("Error", "Error while fetching record", "error");
    }
  }

  get hasData() {
    return this.account && this.account.fields ? true : false;
  }
  handleChange(event) {
    const fieldName = event.target.dataset.field;
    this.account = {
      ...this.account,
      fields: {
        ...(this.account.fields || {}),
        [fieldName]: { value: event.target.value }
      }
    };
  }

  handleSave() {
    const fields = {};
    fields.Id = this.recordId;
    fields[NAME_FIELD.fieldApiName] = this.account.fields.Name.value;
    fields[PHONE_FIELD.fieldApiName] = this.account.fields.Phone.value;
    fields[ANNUALREVENUE_FIELD.fieldApiName] =
      this.account.fields.AnnualRevenue.value;

    const inputFields = { fields };
    updateRecord(inputFields)
      .then(() => {
        this.toast("Success", "Record Updated Successfully", "Success");
      })
      .catch((error) => {
        this.toast("Error", error.body.message, "Error");
      });
  }
}
