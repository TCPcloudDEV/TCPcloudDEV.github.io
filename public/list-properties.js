(function() {
    const utils = window.ECSSales.utils;

    const getElmById = document.getElementById.bind(document);
    const oListPropertiesForm = getElmById("list-properties-form");
    const oTblProperties = getElmById("tblProperties");

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
        var parms = utils.getRequestObj(sheetID, "Pipeline!A3:G");

        gapi.client.sheets.spreadsheets.values
            .get(
                parms
            )
            .then(response => {
                console.log(response.result);

                let data = "";
                var aProps = response.result.values;
                aProps.forEach(row => data += row[1] + ", " + row[2] + " " + row[3] + ", "+ row[4] + "<br/>c: " + row[5] + "&emsp; e: " + row[6] + "<br/><br/>");

                oTblProperties.innerHTML = data;

                utils.showMsg(oSnackbar, "Data retrived");
                utils.hideLoader();
            },
            response => {
                utils.hideLoader();

                let message = cWARN_0001 + " " + response.result.error.message;
                if (response.status === 403) {
                    message = cINFO_0001;
                }

                console.log(response);

                utils.showWarnWithDtls(oSnackbar, message);
            });

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
