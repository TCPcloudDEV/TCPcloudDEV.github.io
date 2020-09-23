(function() {
    function hideElm(oElm) {
        oElm.style.display = "none";
    }


    /**
    * @param  {DOMElement} oElm
    * @param  {String} displayStyle - (optional) flex, inline
    */
    function showElm(oElm, displayStyle) {
        oElm.style.display = displayStyle ? displayStyle : "block";
    }


    /**
    * show loader, hide forms
    */
    function showLoader(oForms, oFormLoader) {
        hideElm(oForms);
        showElm(oFormLoader);
    }


    /**
    * hide loader, show forms
    */
    function hideLoader(oForms, oFormLoader) {
        hideElm(oFormLoader);
        showElm(oForms);
    }


  /**
  * Generate append request object - for given sheet and values to append
  * Docs: https://developers.google.com/sheets/api/reference/rest/v4/spreadsheets.values/append
  *
  * @param {String} spreadsheetId sheet ID
  * @param {Array} values values to be appended
  * @returns {Object} request object for append
  */
  function appendRequestObj(spreadsheetId, values) {
    return {
      // The ID of the spreadsheet to update.
      spreadsheetId,

      // The A1 notation of a range to search for a logical table of data.
      // Values will be appended after the last row of the table.
      range: "Pipeline!A3",

      includeValuesInResponse: true,

      responseDateTimeRenderOption: "FORMATTED_STRING",

      responseValueRenderOption: "FORMATTED_VALUE",

      // How the input data should be interpreted.
      valueInputOption: "USER_ENTERED",

      // How the input data should be inserted.
      insertDataOption: "INSERT_ROWS",


      resource: {
        values
      }
    };
    }


  /**
  * Generate batchGet request object - for given sheet, and range.
  * Docs: https://developers.google.com/sheets/api/reference/rest/v4/spreadsheets.values/batchGet
  *
  * @param {String} sheetID sheet ID
  * @param {Array} ranges List of ranges in A1 notation
  * @returns {Object} request object for batchGet
  */
  function batchGetRequestObj(spreadsheetId, ranges) {
    return {
      spreadsheetId,
      ranges,
      dateTimeRenderOption: "FORMATTED_STRING",
      majorDimension: "COLUMNS",
      valueRenderOption: "FORMATTED_VALUE"
    };
  }

  function wrapInOption(option) {
    return `<option value='${option}'>${option}</option>`;
  }

    window.ECSSales = window.ECSSales || {};
    window.ECSSales.utils = window.ECSSales.utils || {
        showElm,
        hideElm,
        hideLoader,
        showLoader,
        wrapInOption,
        batchGetRequestObj,
        appendRequestObj
    };
})();
