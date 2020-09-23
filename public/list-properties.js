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
            var rrr = utils.batchGetRequestObj(["Pipeline!A3:G"]);

            gapi.client.sheets.spreadsheets.values
                .batchGet(
                    rrr
                )
                .then(
                    response => {
                        response.result;

                        /*oSnackbar.MaterialSnackbar.showSnackbar({
                            message: "Expense added!"
                        });*/

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
        } catch (err) {
            console.error(err);
        }
    }


    function init(sheetID) {
        const parms = {
            spreadsheetId: sheetID,
            range: "Pipeline!A3:G",

            // How values should be represented in the output.
            // The default render option is ValueRenderOption.FORMATTED_VALUE.
            valueRenderOption: "FORMATTED_VALUE",

            // How dates, times, and durations should be represented in the output.
            // This is ignored if value_render_option is
            // FORMATTED_VALUE.
            // The default dateTime render option is [DateTimeRenderOption.SERIAL_NUMBER].
            dateTimeRenderOption: "FORMATTED_STRING",
        };


        var request = gapi.client.sheets.spreadsheets.values.get(parms);

        request.then(function (response) {
            console.log(response.result);
        }, function (reason) {
            console.error('error: ' + reason.result.error.message);
        });
        

        // In MDL - `required` input fields are invalid on page load by default (which looks bad).
        // Fix: https://github.com/google/material-design-lite/issues/1502#issuecomment-257405822
        document
        .querySelectorAll("*[data-required]")
        .forEach(e => (e.required = true));

        // set lister for button
        oGetPropertiesBttn.onclick = getProperties.bind(null);
    }


    window.ECSSales.ListPropertiesForm = {
        init
    };
})();
