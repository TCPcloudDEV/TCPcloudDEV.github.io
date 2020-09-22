(function() {
    const utils = window.ECSSales.utils;
    const getElmById = document.getElementById.bind(document);


    const cSHEET_NAME = "ECS_Sales (Responses)_WIP"; // TODO ECS:
    const cJOB_SPLIT_TYPE_RANGE = "cfg!C5:C";
    const cJOB_CLAIM_STATUS_RANGE = "cfg!A5:A";

    getElmById("lblVer").innerHTML = "0.30";


    const oAuthBttn = getElmById("authorize-bttn");
    const oSignoutBttn = getElmById("signout-button");
    const oForms = getElmById("forms");
    const oFormLoader = getElmById("form-loader");
    const oSnackbar = getElmById("toast-container");

    utils.hideLoader = utils.hideLoader.bind(null, oForms, oFormLoader);
    utils.showLoader = utils.showLoader.bind(null, oForms, oFormLoader);


    /**
    *  On load, called to load the auth2 library and API client library.
    */
    function handleClientLoad() {
        gapi.load("client:auth2", initClient);
    }


    /**
    *  Sign in the user upon button click.
    */
    function handleAuthClick(event) {
        gapi.auth2.getAuthInstance().signIn();
    }


    /**
    *  Sign out the user upon button click.
    */
    function handleSignoutClick(event) {
        gapi.auth2.getAuthInstance().signOut();
    }


    /**
    *  Initializes the API client library and sets up sign-in state
    *  listeners.
    */
    function initClient() {
        const CLIENT_ID = "405463250476-g6vgneqp01ht2pmv0mkqjr7qfds6k30l.apps.googleusercontent.com";
        const API_KEY = "AIzaSyB9lsuRV2xUnKU4mXwho34IZlZVxwu5qwQ";
        const DISCOVERY_DOCS = [
            "https://sheets.googleapis.com/$discovery/rest?version=v4",
            "https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"
        ];

        // Write access for spreadsheet, readonly access for drive to find sheet ID
        const SCOPES = "https://www.googleapis.com/auth/spreadsheets https://www.googleapis.com/auth/drive.metadata.readonly";

        gapi.client.setApiKey(API_KEY);
        
        gapi.client
            .init({
                discoveryDocs: DISCOVERY_DOCS,
                clientId: CLIENT_ID,
                scope: SCOPES
            })
            .then(() => {
                // Listen for sign-in state changes.
                gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);

                // Handle the initial sign-in state.
                updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
                oAuthBttn.onclick = handleAuthClick.bind(null);
                oSignoutBttn.onclick = handleSignoutClick.bind(null);
            });
    }


    /**
    *  Called when the signed in status changes, to update the UI
    *  appropriately. After a sign-in, find sheet id.
    */
    function updateSigninStatus(isSignedIn) {
        if (isSignedIn) {
            onSignin();
        } else {
            utils.showElm(oAuthBttn);
            utils.hideElm(oSignoutBttn);
            utils.hideElm(oForms);
            utils.hideElm(oFormLoader);
        }
    }


    /**
    * On successful signin - Update authorization buttons, make a call to get sheetID
    */
    function onSignin() {
        utils.hideElm(oAuthBttn);
        utils.showElm(oSignoutBttn);

        getSheetID(cSHEET_NAME)
            .then(getJobStatusAndMore, sheetNotFound)
            .then(initApp);

        function sheetNotFound() {
            oSnackbar.MaterialSnackbar.showSnackbar({
                message: "Cannot find the sheet!",
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
    }


    /**
    * Get sheet ID for a given sheet name
    *
    * @param {String} sheetName Sheet name to search in user's drive
    * @returns {Promise} a promise resolves successfully with sheetID if it's available in user's drive
    */
    function getSheetID(sheetName) {
        return new Promise((resolve, reject) => {
          gapi.client.drive.files
            .list({
              q: `name='${sheetName}' and mimeType='application/vnd.google-apps.spreadsheet'`,
              orderBy: "starred"
            })
            .then(response => {
              if (response.result.files.length === 0) reject();
              else resolve(response.result.files[0].id);
            });
        });
    }


    function getJobStatusAndMore(sheetID) {
        return new Promise((resolve, reject) => {
            gapi.client.sheets.spreadsheets.values
            .batchGet(
                utils.batchGetRequestObj(sheetID, [cJOB_SPLIT_TYPE_RANGE, cJOB_CLAIM_STATUS_RANGE])
            )
            .then(response => {
                const jobSplitTypes = response.result.valueRanges[0].values[0];
                const jobClaimStatuses = response.result.valueRanges[1].values[0];
                resolve({ sheetID, jobSplitTypes, jobClaimStatuses });
            });
        });
    }


    function initApp(data) {
        utils.hideLoader();

        window.ECSSales.AddPropertyForm.init(
            data.sheetID,
            data.jobSplitTypes,
            data.jobClaimStatuses
        );

        //window.ECSSales.transferForm.init(data.sheetID, data.jobSplitTypes);

        utils.appendRequestObj = utils.appendRequestObj.bind(null, data.sheetID);
    }


    window.handleClientLoad = handleClientLoad.bind(null);
})();
