(function() {
    const utils = window.ECSSales.utils;

    const getElmById = document.getElementById.bind(document);
    const oListPropertiesForm = getElmById("list-properties-form");
    const oGetPropertiesBttn = getElmById("get-properties-bttn");

    const oSnackbar = getElmById("toast-container");


    function getProperties(event) {
        if (!oListPropertiesForm.checkValidity()) return false;

        utils.showLoader();

        try {
            console.log("hre");
        } catch (err) {
            console.error(err);
        }
    }


    function init(sheetID) {
        var parms = utils.getRequestObj(sheetID, "Pipeline2!A3:G"); // !!!!!!!

        gapi.client.sheets.spreadsheets.values
            .get(
                parms
            )
            .then(response => {
                    console.log(response.result);

                    var rrr = response.result;

                    utils.showMsg("Data retrived");
                    utils.hideLoader();
                },
                response => {
                    utils.hideLoader();

                    let message = "Sorry, something went wrong";
                    if (response.status === 403) {
                        message = "Please copy the sheet in your drive";
                    }

                    console.log(response);

                    utils.showWarnWithDtls(oSnackbar, message, "google.com");
                }
            );

        // In MDL - `required` input fields are invalid on page load by default (which looks bad).
        // Fix: https://github.com/google/material-design-lite/issues/1502#issuecomment-257405822
        document
            .querySelectorAll("*[data-required]")
            .forEach(e => (e.required = true));

        // set lister for buttons
        oGetPropertiesBttn.onclick = getProperties.bind(null);
    }


    window.ECSSales.ListPropertiesForm = {
        init
    };
})();
