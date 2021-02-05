window.JsToDotNetBridge = {
    m_dotNetReference: null,

    setDotNetReference: function (dotNetReference) {
        this.m_dotNetReference = dotNetReference;
    },

    showErrorJs: function (title, msg) {
        this.m_dotNetReference.invokeMethod("showError", title, msg);
    },

    setJsValJs: function (varName, aVals) { // aVals array of values
        this.m_dotNetReference.invokeMethod("setJsVal", varName, aVals);
    }
}


window.signIn = () => {
    authenticate();
};


window.signOut = () => {
    gapi.auth2.getAuthInstance().signOut();

    processSignout();
}


function init() {
    gapi.load("client:auth2", function () {
        gapi.auth2.init({ client_id: "323996053258-3smc60hane62th9l0nm9dupoin6v15qd.apps.googleusercontent.com" }); // cnfg !!!
    });
}


function processSignin() {
    console.log("Sign-in successfully.");

    CSupport.hideElm(bttnSignIn);
    CSupport.showElm(bttnSignOut);
    CSupport.showElm(divGetPlaylists);

    var oCurrUser = gapi.auth2.getAuthInstance().currentUser.get();
    var token = oCurrUser.getAuthResponse().access_token;
    JsToDotNetBridge.setJsValJs("gapi_token", [token]);

    var oProf = oCurrUser.getBasicProfile();
    //var id = oProf.getId();
    //var name = oProf.getName();
    //var imgUrl = oProf.getImageUrl();
    var email = oProf.getEmail();

    JsToDotNetBridge.setJsValJs("gapi_signin_status", [email]);
}


function processSignout() {
    console.log("Sign-out successfully.");

    CSupport.hideElm(bttnSignOut);
    CSupport.showElm(bttnSignIn);
    CSupport.hideElm(divGetPlaylists);


    JsToDotNetBridge.setJsValJs("gapi_signin_status", [""]);
}


function showError(msg, err) {
    console.error(msg, err);

    JsToDotNetBridge.showErrorJs(msg);
}


function authenticate() {
    return gapi.auth2.getAuthInstance()
        .signIn({ scope: "https://www.googleapis.com/auth/youtube.readonly" })  // cnfg !!!
        .then(function () {
            processSignin();
        },
            function (err) {
                alert("Failed to sign-in3:", err.name + " m: " + err.message + " s: " + err.toString());
                showError ("Failed to sign-in.", err);
            });
}
