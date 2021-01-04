//var oCamStrm;


(function () {
    function init(jobSplitTypes, jobClaimStatuses) {
        const oJobSplitType = getElmById("ddJobSplitType");
        const oClaimStatus = getElmById("ddJobClaimStatus");

        // initialize dropdowns
        oJobSplitType.innerHTML = jobSplitTypes.map(utils.wrapInOption).join();
        oClaimStatus.innerHTML = jobClaimStatuses.map(utils.wrapInOption).join();

        clearFlds();

        //getElmById("bttnAddJob").onclick = addJob.bind(null); //-- setting this way blocks "Please fill out this field" notification, used onclick="addJob()" instead
    }


    window.ECSSales.AddPropertyForm = {
        init,
    };
})();


function clearFlds() {
    const oCustLastName = getElmById("tbCustLastName");
    const oCustFirstName = getElmById("tbCustFirstName");
    const oCustAddr = getElmById("tbCustAddr");
    const oCustCity = getElmById("tbCustCity");
    const oCustPhone = getElmById("tbCustPhone");
    const oCustEmail = getElmById("tbCustEmail");
    const oCustClaimNum = getElmById("tbJobClaimNum");
    const oJobSplitType = getElmById("ddJobSplitType");
    const oJobScope = getElmById("tbJobScope");
    const oJobNotes = getElmById("tbJobNotes");
    const oClaimStatus = getElmById("ddJobClaimStatus"); 

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

    oCustLastName.disabled = false;

    gl_indxEditProp = -1;
}


function addJob(event) {
    try {
        const oAddPropertyForm = getElmById("frmAddProp");
        const oCustLastName = getElmById("tbCustLastName");
        const oCustFirstName = getElmById("tbCustFirstName");
        const oCustAddr = getElmById("tbCustAddr");
        const oCustCity = getElmById("tbCustCity");
        const oCustPhone = getElmById("tbCustPhone");
        const oCustEmail = getElmById("tbCustEmail");
        const oCustClaimNum = getElmById("tbJobClaimNum");
        const oJobSplitType = getElmById("ddJobSplitType");
        const oJobScope = getElmById("tbJobScope");
        const oJobNotes = getElmById("tbJobNotes");
        const oClaimStatus = getElmById("ddJobClaimStatus");  
        const oSnackbar = getElmById("divToastCntnr");

        if (!oAddPropertyForm.checkValidity()) return false;

        event.preventDefault();
        utils.showLoader();

        var now = new Date();

        if (gl_indxEditProp == -1) {
            gapi.client.sheets.spreadsheets.values
                .append(
                    utils.appendRequestObj(cPROPS_TBL_RANGE, [
                        [
                            `=DATE(${now.getFullYear()}, ${now.getMonth() + 1}, ${now.getDate()}) + TIME(${now.getHours()}, ${now.getMinutes()}, ${now.getSeconds()})`,
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
                            oClaimStatus.value
                        ]
                    ])
                )
                .then(
                    response => {
                        // reset fileds
                        clearFlds();

                        utils.showMsg(oSnackbar, "Property added.");
                        utils.hideLoader();

                        window.ECSSales.ListPropertiesForm.init();
                    },
                    response => {
                        utils.hideLoader();

                        let message = cWARN_0001 +". "+ response.result.error.message;
                        if (response.status === 403) {
                            message = cINFO_0001;
                        }

                        console.log(response);

                        utils.showWarnWithDtls(oSnackbar, message);
                    }
                );
        } else {
            let rowIndx = cPROPS_TBL_1ST_ROW + gl_indxEditProp;
            let propRange = cPROPS_TBL_1ST_CLMN + rowIndx;

            gapi.client.sheets.spreadsheets.values
            .update(
                utils.updateRequestObj(propRange, [
                    [
                        gl_aPropsInfo[gl_indxEditProp][0],
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
                        oClaimStatus.value
                    ]
                ])
            )
            .then(
                response => {
                    // reset fileds
                    clearFlds();

                    utils.showMsg(oSnackbar, "Property updated.");
                    utils.hideLoader();

                    window.ECSSales.ListPropertiesForm.init();
                },
                response => {
                    utils.hideLoader();

                    let message = cWARN_0001 +". "+ response.result.error.message;
                    if (response.status === 403) {
                        message = cINFO_0001;
                    }

                    console.log(response);

                    utils.showWarnWithDtls(oSnackbar, message);
                }
            );            
        }
    } catch (err) {
        utils.showError(err.message);
    }
}


function execute() {
    // https://developers.google.com/drive/api/v2/search-files#node.js
    // q: "mimeType='application/vnd.google-apps.folder'"
    // q: "mimeType='image/jpeg'"
    var lll = gapi.client.drive.files.list(
        {
            q: "mimeType='application/vnd.google-apps.folder' and name='ECS'",
        })
        .then(function(response) {
        // Handle the results here (response.result has the parsed body).
        console.log("Response", response);
        return response;
        },
        function(err) { console.error("Execute error", err); });

        var iii = lll.result.files[0].id;
}


/* NIU
function getUserMedia(options, successCallback, failureCallback) {
    var api = navigator.getUserMedia || navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia || navigator.msGetUserMedia;
    if (api) {
        return api.bind(navigator)(options, successCallback, failureCallback);
    }
}


function getStream() {
    if (!navigator.getUserMedia && !navigator.webkitGetUserMedia &&
        !navigator.mozGetUserMedia && !navigator.msGetUserMedia) {

        alert("User Media API not supported.");

        return;
    }

    var constraints = {
        video: true
    };

    getUserMedia(constraints, function (strm) {
        var mediaControl = document.querySelector("video");
        if ("srcObject" in mediaControl) {
            mediaControl.srcObject = strm;
        } else if (navigator.mozGetUserMedia) {
            mediaControl.mozSrcObject = strm;
        } else {
            mediaControl.src = (window.URL || window.webkitURL).createObjectURL(strm);
        }

        oCamStrm = strm;
    }, function (err) {
        alert("Error: " + err);
    });
}


function takePhoto() {
    if (!("ImageCapture" in window)) {
        alert("ImageCapture is not available.");

        return;
    }

    if (!oCamStrm) {
        alert("Failed to get video stream.");

        return;
    }

    var img = new ImageCapture(oCamStrm.getVideoTracks()[0]);

    img.takePhoto()
        .then(blob => {
            var imgCtrl = document.getElementById("imgCtrl");
            imgCtrl.src = URL.createObjectURL(blob);
        })
        .catch(err => alert("Error: " + err));
}


function savePhoto() {
    var parentId = '0ByfGXtS3Wwvwb0s1UzlJTUMwVzQ';//some parentId of a folder under which to create the new folder
    var fileMetadata = {
        'name': 'New Folder',
        'mimeType': 'application/vnd.google-apps.folder',
        'parents': [parentId]
    };
    gapi.client.drive.files.create({
        resource: fileMetadata,
    }).then(function (response) {
        switch (response.status) {
            case 200:
                var file = response.result;
                console.log('Created Folder Id: ', file.id);
                break;
            default:
                console.log('Error creating the folder, ' + response);
                break;
        }
    });

    /*var fileMetadata = {
        'name': 'photo.jpg'
    };
    var media = {
        mimeType: 'image/jpeg',
        body: document.getElementById("imgCtrl").createReadStream('files/photo.jpg')
    };

    drive.files.create({
        resource: fileMetadata,
        media: media,
        fields: 'id'
    }, function (err, file) {
        if (err) {
            // Handle error
            console.error(err);
        } else {
            console.log('File Id: ', file.id);
        }
    });**
}*/
