(function() {
    const utils = window.ECSSales.utils;

    // Cached DOM bindings
    const getElmById = document.getElementById.bind(document);
    const oAddPropertyForm = getElmById("add-property-form");
    const descriptionEl = getElmById("expense-description");
    const dateEl = getElmById("expense-date");
    const oJobSplitType = getElmById("job-split-type");
    const oClaimStatusElm = getElmById("job-claim-status");
    const amountEl = getElmById("expense-amount");
    const isIncomeEl = getElmById("is-income");
    const oAddJobBttn = getElmById("add-job-bttn");
    const snackbarContainer = getElmById("toast-container");


    function addJob(event) {
        if (!oAddPropertyForm.checkValidity()) return false;

        event.preventDefault();
        utils.showLoader();

        const expenseDate = dateEl.value;
        const descriptionVal = descriptionEl.value;
        const splitType = oJobSplitType.value;
        const claimStatus = oClaimStatusElm.value;
        const amountVal = amountEl.value;
        const isIncome = isIncomeEl.checked;

        const dateObj = {
          yyyy: expenseDate.substr(0, 4),
          mm: expenseDate.substr(5, 2),
          dd: expenseDate.substr(-2)
        };
        gapi.client.sheets.spreadsheets.values
          .append(
            utils.appendRequestObj([
              [
                `=DATE(${dateObj.yyyy}, ${dateObj.mm}, ${dateObj.dd})`,
                descriptionVal,
                splitType,
                claimStatus,
                isIncome ? 0 : amountVal, // income amount
                isIncome ? amountVal : 0, // expense amount
                false // is internal transfer?
              ]
            ])
          )
          .then(
            response => {
              // reset fileds
              descriptionEl.value = "";
              amountEl.value = "";
              snackbarContainer.MaterialSnackbar.showSnackbar({
                message: "Expense added!"
              });
              utils.hideLoader();
            },
            response => {
              utils.hideLoader();
              let message = "Sorry, something went wrong";
              if (response.status === 403) {
                message = "Please copy the sheet in your drive";
              }
              console.log(response);
              snackbarContainer.MaterialSnackbar.showSnackbar({
                message,
                actionHandler: () => {
                  window.open(
                    "https://github.com/mitul45/expense-manager/blob/master/README.md#how-to-get-started",
                    "_blank"
                  );
                },
                actionText: "Details",
                timeout: 5 * 60 * 1000
              });
            }
          );
      }

    function init(sheetID, jobSplitTypes, jobClaimStatuses) {
        // set date picker's defalt value as today
        // !!!!! dateEl.value = new Date().toISOString().substr(0, 10);

        // initialize dropdowns
        oJobSplitType.innerHTML = jobSplitTypes.map(utils.wrapInOption).join();
        oClaimStatusElm.innerHTML = jobClaimStatuses.map(utils.wrapInOption).join();

        // set lister for `Save` button
        oAddJobBttn.onclick = addJob.bind(null);
    }


    window.ECSSales.AddPropertyForm = {
        init
    };
})();
