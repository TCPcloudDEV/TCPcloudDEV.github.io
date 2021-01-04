const cVER_ID = "0.73";
const cECS_URL = "https://www.estateclaimservices.com/contact.html";

const utils = window.ECSSales.utils;
const getElmById = document.getElementById.bind(document);


//const cERROR_0001

const cWARN_0001 = "Something went wrong";

const cINFO_0001 = "The required spreadsheet is missing.";


const cPROPS_TBL_1ST_CLMN = "Pipeline!A";
const cPROPS_TBL_1ST_ROW = 3;
const cPROPS_TBL_RANGE = cPROPS_TBL_1ST_CLMN + cPROPS_TBL_1ST_ROW +":L";


const cDESKTOP_MIN_WITH = 700;
var gl_bDispModeMobile = false;
var gl_bDispModeSwitched = false;

var gl_aPropsInfo = null;
var gl_indxEditProp = -1; 


(function () {
    const cSHEET_NAME = "ECS_Sales (Responses)_WIP"; // TODO ECS:
    const cJOB_SPLIT_TYPE_RANGE = "cfg!C5:C";
    const cJOB_CLAIM_STATUS_RANGE = "cfg!A5:A";
    const oAuthBttn = getElmById("bttnAuthorize");
    const oSignoutBttn = getElmById("bttnSignout");
    const oFormTabs = getElmById("divFormTabs");
    const oFormLoader = getElmById("divFormLoader");
    const oSnackbar = getElmById("divToastCntnr");
    

    getElmById("lblVer").innerHTML = cVER_ID;

    fetch("./frm-tab-add.html")
        .then(CSupport.checkFetchError)
        .then(data => {
            getElmById("divTabAdd").innerHTML = data;
        }).catch((error) => {
            var msg = cWARN_0001 +" while loading divTabAdd. \n\n"+ error;

            utils.showError (msg);
        });

    fetch("./frm-tab-list.html")
        .then(CSupport.checkFetchError)
        .then(data => {
            getElmById("divTabList").innerHTML = data;
        }).catch((error) => {
            var msg = cWARN_0001 +" while loading divTabList. \n\n"+ error;

            utils.showError (msg);
        });

    utils.hideLoader = utils.hideLoader.bind(null, oFormTabs, oFormLoader);
    utils.showLoader = utils.showLoader.bind(null, oFormTabs, oFormLoader);


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
        const SCOPES = "https://www.googleapis.com/auth/spreadsheets https://www.googleapis.com/auth/drive.file"; //  https://www.googleapis.com/auth/drive.metadata.readonly

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

        isMobile();

        window.addEventListener("resize", () => {
            isMobile();

            if (gl_bDispModeSwitched)
                window.ECSSales.ListPropertiesForm.init();
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
            utils.hideElm(oFormTabs);
            utils.hideElm(oFormLoader);
        }
    }


    /**
    * On successful signin - Update authorization buttons, make a call to get sheetID
    */
    function onSignin() {
        utils.hideElm(oAuthBttn);
        utils.showElm(oSignoutBttn);

        getSheetId(cSHEET_NAME)
            .then(getJobStatusAndMore, sheetNotFound)
            .then(initApp);

        function sheetNotFound() {
            utils.showWarnWithDtls(oSnackbar, "Cannot find the sheet!");
        }
    }


    /**
    * Get sheet ID for a given sheet name
    *
    * @param {String} sheetName Sheet name to search in user's drive
    * @returns {Promise} a promise resolves successfully with sheetID if it's available in user's drive
    */
    function getSheetId(sheetName) {
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


    function getJobStatusAndMore(sheetId) {
        return new Promise((resolve, reject) => {
            gapi.client.sheets.spreadsheets.values
            .batchGet(
                utils.batchGetRequestObj(sheetId, [cJOB_SPLIT_TYPE_RANGE, cJOB_CLAIM_STATUS_RANGE])
            )
            .then(response => {
                const jobSplitTypes = response.result.valueRanges[0].values[0];
                const jobClaimStatuses = response.result.valueRanges[1].values[0];
                resolve({ sheetId, jobSplitTypes, jobClaimStatuses });
            });
        });
    }


    function isMobile() {
        var bMobilePrev = gl_bDispModeMobile;

        gl_bDispModeMobile = window.innerWidth < cDESKTOP_MIN_WITH;
        gl_bDispModeSwitched = bMobilePrev != gl_bDispModeMobile;

        return gl_bDispModeMobile;
    }


    function initApp(data) {
        utils.hideLoader();

        window.ECSSales.AddPropertyForm.init(
            data.jobSplitTypes,
            data.jobClaimStatuses
        );

        utils.appendRequestObj = utils.appendRequestObj.bind(null, data.sheetId);
        utils.updateRequestObj = utils.updateRequestObj.bind(null, data.sheetId);
        window.ECSSales.ListPropertiesForm.init = window.ECSSales.ListPropertiesForm.init.bind(null, data.sheetId);
   
        window.ECSSales.ListPropertiesForm.init();
    }


    window.handleClientLoad = handleClientLoad.bind(null);
})();
