(function() {
    const utils = window.ECSSales.utils;

    const getElmById = document.getElementById.bind(document);
    const oListPropertiesForm = getElmById("list-properties-form");
    const oDivProperties = getElmById("divProperties");

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
        // In MDL - `required` input fields are invalid on page load by default (which looks bad).
        // Fix: https://github.com/google/material-design-lite/issues/1502#issuecomment-257405822
        document
            .querySelectorAll("*[data-required]")
            .forEach(e => (e.required = true));

        var parms = utils.getRequestObj(sheetID, "Pipeline!A3");
        gapi.client.sheets.spreadsheets.values
            .get(
                parms
            )
            .then(
                response => {
                    console.log(response.result);

                    var aProps = response.result.values;
                    var tableRef = getElmById("tblPropertiesBody");

                    for (var rowIndx in tableRef.rows.item.length)
                        tableRef.deleteRow(-1);

                    aProps.forEach(function (aPropInfo) {
                        var row = tableRef.insertRow();

                        var clm0 = row.insertCell(0);
                        clm0.appendChild(document.createTextNode(aPropInfo[0].split(" ")[0]));

                        var clm1 = row.insertCell(1);
                        clm1.appendChild(document.createTextNode(aPropInfo[3] + ", " + aPropInfo[4]));

                        var clm2 = row.insertCell(2);
                        clm2.appendChild(document.createTextNode(aPropInfo[1] + ", " + aPropInfo[2]));

                        var clm3 = row.insertCell(3);
                        var node3 = document.createElement("a");
                        node3.href = "tel:" + aPropInfo[5];
                        node3.text = aPropInfo[5];
                        clm3.appendChild(node3);

                        var clm4 = row.insertCell(4);
                        if (!CSupport.isEmpty(aPropInfo[6])) {
                            var node4 = document.createElement("a");
                            node4.href = "mailto:" + aPropInfo[6];
                            node4.text = aPropInfo[6];
                            clm4.appendChild(node4);
                        }
                    });

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
                }
            );

        // set lister for buttons
        //oGetPropertiesBttn.onclick = getProperties.bind(null);
    }


    window.ECSSales.ListPropertiesForm = {
        init
    };
})();
