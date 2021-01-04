(function() {
    const oSnackbar = getElmById("divToastCntnr");


    function init(sheetId) {
        // In MDL - `required` input fields are invalid on page load by default (which looks bad).
        // Fix: https://github.com/google/material-design-lite/issues/1502#issuecomment-257405822
        document
            .querySelectorAll("*[data-required]")
            .forEach(e => (e.required = true));

        let parms = utils.getRequestObj(sheetId, cPROPS_TBL_RANGE);
        gapi.client.sheets.spreadsheets.values
            .get(
                parms
            )
            .then(
                response => {
                    //console.log(response.result);

                    gl_aPropsInfo = response.result.values;
                    let oTblHdr = getElmById("tblPropsHdr");
                    let oTblData = getElmById("tblPropsBody");

                    while (oTblData.rows.length) {
                        for (let row in oTblData.rows)
                            oTblData.deleteRow(-1);
                    }

                    const aClmnHidden = gl_bDispModeMobile ?  [true, true, false, true, false, true, true] : [false, false, false, false, false, false, false];
                    for (let i = 0; i < aClmnHidden.length; i++) {
                        oTblHdr.rows[0].cells[i].hidden = aClmnHidden[i];    
                    }

                    //gl_aPropsInfo.forEach(function (aPropInfo) {
                    for (indx = 0; indx < gl_aPropsInfo.length; indx++) {
                        let aPropInfo = gl_aPropsInfo[indx];
                        let row = oTblData.insertRow();

                        // # Date
                        let clm0 = row.insertCell(-1);
                        clm0.hidden = aClmnHidden[0];
                        if (!aClmnHidden[0])
                            clm0.appendChild(document.createTextNode(aPropInfo[0].split(" ")[0]));
                        
                        // # Address
                        let clm1 = row.insertCell(-1);
                        clm1.hidden = aClmnHidden[1];
                        if (!aClmnHidden[1]) {
                            let node1 = document.createElement("a");
                            node1.href = "javascript:window.ECSSales.ListPropertiesForm.editProp("+ indx +");";
                            node1.text = aPropInfo[3];
                            
                            clm1.appendChild(node1);
                            clm1.appendChild(document.createTextNode(", " + aPropInfo[4]));
                        }

                        // # Name
                        let clm2 = row.insertCell(-1);
                        clm2.hidden = aClmnHidden[2];
                        if (gl_bDispModeMobile) {
                            clm2.appendChild(document.createTextNode(aPropInfo[1] + ", " + aPropInfo[2]));
                            clm2.appendChild(document.createElement("br"));

                            let node2 = document.createElement("a");
                            node2.href = "javascript:window.ECSSales.ListPropertiesForm.editProp("+ indx +");";
                            node2.text = aPropInfo[3];

                            clm2.appendChild(node2);
                            clm2.appendChild(document.createElement("br"));
                            clm2.appendChild(document.createTextNode(aPropInfo[4]));
                            clm2.appendChild(document.createElement("br"));
                            clm2.appendChild(document.createElement("br"));
                            clm2.appendChild(document.createTextNode("status: " + aPropInfo[11]));
                            clm2.appendChild(document.createElement("br"));
                            clm2.appendChild(document.createTextNode("split: "+ aPropInfo[8]));
                        } else {
                            clm2.appendChild(document.createTextNode(aPropInfo[1] + ", " + aPropInfo[2]));
                        }

                        // # Phone
                        let clm3 = row.insertCell(-1);
                        clm3.hidden =  aClmnHidden[3];
                        let node3 = document.createElement("a");
                        node3.href = "tel:" + aPropInfo[5];
                        node3.text = aPropInfo[5];

                        if (!aClmnHidden[3]) {
                            clm3.appendChild(node3);
                        }

                        // # Email
                        let clm4 = row.insertCell(-1);
                        clm4.hidden = aClmnHidden[4];
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
                        } else {
                            if (node4 != null) {
                                clm4.appendChild(node4);
                            }

                            // # Split
                            let clm5 = row.insertCell(-1);
                            clm5.appendChild(document.createTextNode(aPropInfo[8]));

                            // # Status
                            let clm6 = row.insertCell(-1);
                            clm6.appendChild(document.createTextNode(aPropInfo[11]));
                        }
                    //});
                    }

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


    function editProp (indx) {
        gl_indxEditProp = indx;
        let aPropInfo = gl_aPropsInfo[indx];

        const oCustLastName = getElmById("tbCustLastName");
        oCustLastName.value = aPropInfo[1];
        oCustLastName.disabled = true; // disabled is better then readOnly
        getElmById("tbCustFirstName").value = aPropInfo[2];
        getElmById("tbCustAddr").value = aPropInfo[3];
        getElmById("tbCustCity").value = aPropInfo[4];
        getElmById("tbCustPhone").value = aPropInfo[5];
        getElmById("tbCustEmail").value = aPropInfo[6];
        getElmById("tbJobClaimNum").value = aPropInfo[7];
        getElmById("ddJobSplitType").value = aPropInfo[8];
        getElmById("tbJobScope").value = aPropInfo[9];
        getElmById("tbJobNotes").value = aPropInfo[10];
        getElmById("ddJobClaimStatus").value = aPropInfo[11];

        utils.mdlCleanUpTb();     
        
        getElmById("bttnTabAdd").click();
    }


    window.ECSSales.ListPropertiesForm = {
        init,
        editProp
    };
})();
