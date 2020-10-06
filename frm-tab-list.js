(function() {
    const utils = window.ECSSales.utils;

    const getElmById = document.getElementById.bind(document);


    const oSnackbar = getElmById("divToastCntnr");


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
            .then(
                response => {
                    //console.log(response.result);

                    let aProps = response.result.values;
                    let oTblHdr = getElmById("tblPropsHdr");
                    var oTblData = getElmById("tblPropsBody");

                    while (oTblData.rows.length) {
                        for (let row in oTblData.rows)
                            oTblData.deleteRow(-1);
                    }

                    const aClmnVis = gl_bDispModeMobile ?  [true, true, false, true, false] : [false, false, false, false, false];
                    for (let i = 0; i < aClmnVis.length; i++) {
                        oTblHdr.rows[0].cells[i].hidden = aClmnVis[i];    
                    }

                    aProps.forEach(function (aPropInfo) {
                        let row = oTblData.insertRow();

                        let clm0 = row.insertCell(-1);
                        clm0.hidden = aClmnVis[0];
                        if (!clm0.hidde)
                            clm0.appendChild(document.createTextNode(aPropInfo[0].split(" ")[0]));
                                                    
                        let clm1 = row.insertCell(-1);
                        clm1.hidden =  aClmnVis[1];
                        if (!clm1.hidde)
                            clm1.appendChild(document.createTextNode(aPropInfo[3] + ", " + aPropInfo[4]));

                        let clm2 = row.insertCell(-1);
                        clm2.hidden =  aClmnVis[2];
                        if (gl_bDispModeMobile) {
                            clm2.appendChild(document.createTextNode(aPropInfo[1] + ", " + aPropInfo[2]));
                            clm2.appendChild(document.createElement("br"));
                            clm2.appendChild(document.createTextNode(aPropInfo[3]));
                            clm2.appendChild(document.createElement("br"));
                            clm2.appendChild(document.createTextNode(aPropInfo[4]));
                        } else
                            clm2.appendChild(document.createTextNode(aPropInfo[1] + ", " + aPropInfo[2]));

                        let clm3 = row.insertCell(-1);
                        clm3.hidden =  aClmnVis[3];
                        let node3 = document.createElement("a");
                        node3.href = "tel:" + aPropInfo[5];
                        node3.text = aPropInfo[5];

                        if (!clm3.hidde) {
                            clm3.appendChild(node3);
                        }

                        let clm4 = row.insertCell(-1);
                        clm4.hidden =  aClmnVis[4];
                        let node4 = null;

                        if (!CSupport.isEmpty(aPropInfo[6])) {
                            node4 = document.createElement("a");
                            node4.href = "mailto:" + aPropInfo[6];
                            node4.text = aPropInfo[6];
                        }

                        if (gl_bDispModeMobile) {
                            if (node4 != null) {
                                clm4.appendChild(document.createTextNode("e: "));
                                clm4.appendChild(node4);
                                clm4.appendChild(document.createElement("br"));
                                clm4.appendChild(document.createElement("br"));
                            }

                            clm4.appendChild(document.createTextNode("ph: "));
                            clm4.appendChild(node3);

                            if (gl_bDispModeMobile)
                                clm4.appendChild(document.createElement("br"));
                        } else {
                            if (node4 != null) {
                                clm4.appendChild(node4);
                            }
                        }
                    });

                    utils.showMsg(oSnackbar, "Data retrived");
                    utils.hideLoader();
                },
                response => {
                    utils.hideLoader();

                    let message = cWARN_0001 + ". " + response.result.error.message;
                    if (response.status === 403) {
                        message = cINFO_0001;
                    }

                    console.log(response);

                    utils.showWarnWithDtls(oSnackbar, message);
                }
            );
    }


    window.ECSSales.ListPropertiesForm = {
        init
    };
})();
