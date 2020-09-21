(function() {
    const utils = window.ECSSales.utils;

    // Cached DOM bindings
    const getElmById = document.getElementById.bind(document);
    const AddPropertyForm = getElmById("add-property-form");
    const oCustLastName = getElmById("cust-last-name");
    const oCustFirstName = getElmById("cust-first-name");
    const oCustAddr = getElmById("cust-addr");
    const oCustCity = getElmById("cust-city");
    const oCustPhone = getElmById("cust-phone");
    const oCustEmail = getElmById("cust-email");
    const oCustClaimNum = getElmById("job-claim-num");
    const oJobSplitType = getElmById("job-split-type");
    const oJobScope = getElmById("job-scope");
    const oJobNotes = getElmById("job-notes");
    const oClaimStatus = getElmById("job-claim-status");

    const oAddJobBttn = getElmById("add-job-bttn");
    const oSnackbar = getElmById("toast-container");


    function addJob(event) {
        if (!oCustLastName.checkValidity()) return false;

        event.preventDefault();
        utils.showLoader();

        var now = new Date();

        gapi.client.sheets.spreadsheets.values
            .append(
                utils.appendRequestObj([
                    [
                        //`=DATE(${now.getFullYear()}, ${now.getMonth() + 1}, ${now.getDate()}, ${now.getHours()}, ${now.getMinutes()}, ${now.getSeconds()}, $)`,
                        now.toString("MM/DD/YYYY hh:mm:ss",
                        oCustLastName.value,
                        oCustFirstName.value,
                        oCustAddr.value,
                        oCustCity.value,
                        oCustPhone.value,
                        oCustEmail.value,
                        oCustClaimNum.value,
                        oJobSplitType.value,
                        oJobScope.value,
                        oJobNotes.value,
                        oClaimStatus.value,
                    ]
                ])
            )
            .then(
                response => {
                    // reset fileds
                    oCustLastName.value = "";
                    oCustFirstName.value = "";
                    oCustAddr.value = "";
                    oCustCity.value = "";
                    oCustPhone.value = "";
                    oCustEmail.value = "";
                    oCustClaimNum.value = "";
                    oJobSplitType.value = "";
                    oJobScope.value = "";
                    oJobNotes.value = "";
                    oClaimStatus.value = "";

                    oSnackbar.MaterialSnackbar.showSnackbar({
                        message: "Property added!"
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
                    oSnackbar.MaterialSnackbar.showSnackbar({
                        message,
                        actionHandler: () => {
                            window.open(
                                "https://www.estateclaimservices.com/contact.html",
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
        // initialize dropdowns
        oJobSplitType.innerHTML = jobSplitTypes.map(utils.wrapInOption).join();
        oClaimStatus.innerHTML = jobClaimStatuses.map(utils.wrapInOption).join();

        // set lister for `Save` button
        oAddJobBttn.onclick = addJob.bind(null);
    }


    window.ECSSales.AddPropertyForm = {
        init
    };
})();
