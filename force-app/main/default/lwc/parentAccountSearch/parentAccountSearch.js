import { LightningElement } from "lwc";
import { debounce } from "c/utils";

export default class ParentAccountSearch extends LightningElement {
  // input value
  inputValue = "";
  // debounce value
  accName = "";
  selectedAccountId = ""; // Child -> Parent communication

  debounceUpdate = debounce(function (value) {
    this.accName = value.trim();
  }, 300);

  handleInputChange(event) {
    this.inputValue = event.target.value;
    this.debounceUpdate(this.inputValue);
  }

  // Handle event from child (Account selected)
  handleAccountSelected(event) {
    this.selectedAccountId = event.detail; // detail = Account Id
  }
}
