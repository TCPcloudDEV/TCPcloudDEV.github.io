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

                //oDivProperties.innerHTML = data;

                //var tableRef2 = document.getElementById('myTable').getElementsByTagName('tbody')[0];
                var tableRef = getElmById("tblPropertiesBody");

                aProps.forEach(function (aPropInfo) {
                    var row = tableRef.insertRow();

                    var clm0 = row.insertCell(0);
                    clm0.appendChild(aPropInfo[0]);

                    var clm1 = row.insertCell(1);
                    clm1.appendChild(aPropInfo[3] + ", " + aPropInfo[4]);

                    var clm2 = row.insertCell(2);
                    clm2.appendChild(aPropInfo[1] + ", " + aPropInfo[2]);

                    var clm3 = row.insertCell(3);
                    clm3.appendChild("<a href='tel:"+ aPropInfo[5] +"'>"+ aPropInfo[5] +"</a>");

                    var clm4 = row.insertCell(4);
                    clm4.appendChild("<a href='mailto:" + aPropInfo[6] + "'>" + aPropInfo[6] + "</a>");
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
            });

        // set lister for buttons
        oGetPropertiesBttn.onclick = getProperties.bind(null);
    }


    window.ECSSales.ListPropertiesForm = {
        init
    };
})();
