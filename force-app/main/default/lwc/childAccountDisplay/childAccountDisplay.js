import { LightningElement, api, wire, track } from "lwc";
import getAccounts from "@salesforce/apex/AccountListController.getAccounts";

export default class ChildAccountDisplay extends LightningElement {
  columns = [
    { label: "Account Name", fieldName: "Name" },
    { label: "Industry", fieldName: "Industry", type: "text" },
    { label: "Phone", fieldName: "Phone", type: "text" },
    { label: "Annual Revenue", fieldName: "AnnualRevenue", type: "currency" },
    {
      type: "button",
      typeAttributes: {
        label: "Select",
        name: "select"
      }
    }
  ];

  _accName; // internal use only
  isLoading = false;
  hasData = false;
  @track accounts = [];
  message = "Enter account name to search";
  @api
  get accName() {
    console.log(this._accName);
    return this._accName;
  }

  set accName(value) {
    this._accName = value || "";
    this.isLoading = true;
    console.log(this._accName, value);
  }

  formattedError(err) {
    if (Array.isArray(err?.body)) {
      return err.body.map((e) => e.message).join(", ");
    } else if (err.body?.message && typeof err.body.message === "string") {
      return err.body.message;
    }
    return "Unknown Error";
  }

  @wire(getAccounts, { searchKey: "$_accName", limitSize: 50 })
  wiredAccounts({ data, error }) {
    if (data) {
      this.accounts = data;
      this.message = data.length ? null : "No records found";
      this.hasData = data && data.length > 0;
      this.isLoading = false;
    } else if (error) {
      this.message = this.formattedError(error);
      this.isLoading = false;
      this.hasData = false;
      this.accounts = [];
    }
  }

  // Handle "Select" button
  handleRowAction(event) {
    console.log("onrowaction called");
    if (event.detail.action.name === "select") {
      const accountId = event.detail.row.Id;

      // Fire event to parent
      this.dispatchEvent(
        new CustomEvent("accountselected", { detail: accountId })
      );
    }
  }
}
