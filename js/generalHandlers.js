// ********** General Handling ***************

var ServiceURL = "http://kevro.liquidbox.co.za/services/MobiApp.asmx";
//var ServiceURL = "http://www.kevro.co.za/services/PresentationService.asmx";

function WSCall(callBackFunction, ServerFunction, Vars, LoaderElement) {
    try {

        if (LoaderElement !== undefined) {
            document.getElementById(LoaderElement).style.display = "";
        }

        var soap = "<?xml version=\"1.0\" encoding=\"utf-8\"?>" +
            "<soap12:Envelope xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" " +
            "xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\" " +
            "xmlns:soap12=\"http://www.w3.org/2003/05/soap-envelope\">" +
            "<soap12:Body>" +
            "<" + ServerFunction + " xmlns=\"http://www.kevro.co.za/\">";

        for (i = 0; i < Vars.length; i++) {
            soap += "<" + Vars[i][0] + ">";
            soap += Vars[i][1];
            soap += "</" + Vars[i][0] + ">";
        }

        soap += "</" + ServerFunction + ">" +
        "</soap12:Body>" +
        "</soap12:Envelope>";

        //alert(soap);

        var webServiceCall = new WebSvc();
        webServiceCall.CallWebService(ServiceURL, soap, callBackFunction);

    } catch (ex) {
        handleError(ServerFunction, ex, ServerFunction + " call build error");
    }
}

function handleError(functionName, errorMessage, positionRef) {
    alert("Error in " + functionName + "() at " + positionRef + ", error message:" + errorMessage);
}

function getTagValue(inputStr, tagName) {
    // Simple function to search for tagged element in a string,
    // this function will not recurse and simply finds first ocurrence
    // of tag in document.

    // PARAM inputStr - string containing tagged document
    // PARAM tagName - name of element to locate
    // RETURNS string data between tagName element or "" if not found

    var stag = "<" + tagName + ">";
    var etag = "<" + "/" + tagName + ">";

    var startPos = inputStr.indexOf(stag, 0);
    if (startPos >= 0) {
        var endPos = inputStr.indexOf(etag, startPos);
        if (endPos > startPos) {
            startPos = startPos + stag.length;
            return inputStr.substring(startPos, endPos);
        }
    }

    return "";
}

// ********** Webservice Communication ***************
function WebSvc()   // Class Signature
{
    // Encapsulates the elements of a XMLHttpRequest to an ASP .Net Web Service

    WebSvc.prototype.CallWebService = function (url, soapXml, callback) {
        // Calls web service with XMLHttpRequest object. Utilizes a SOAP envelope for
        // transport to and from Server. This is an asynchronous call.
        // PARAM url - Fully qualified url to web service .asmx file</param>
        // PARAM sopXml - String containing SOAP envelope with request</param>
        // PARAM callback - Supplied callback with signature callback(result,data) when call returns.</param>

        var xmlDoc = null;

        if (window.XMLHttpRequest) {
            xmlDoc = new XMLHttpRequest(); //Newer browsers
        }
        else if (window.ActiveXObject) //IE 5, 6
        {
            xmlDoc = new ActiveXObject("Microsoft.XMLHTTP");
        }

        if (xmlDoc) {
            //callback for readystate when it returns
            var self = this;
            xmlDoc.onreadystatechange = function () { self.StateChange(xmlDoc, callback); };

            //set up the soap xml web service call
            xmlDoc.open("POST", url, true);
            xmlDoc.setRequestHeader("Content-Type", "text/xml");
            xmlDoc.setRequestHeader("Content-Length", soapXml.length);
            xmlDoc.send(soapXml);
        }
        else {
            if (callback) {
                callback(false, "unable to create XMLHttpRequest object");
            }
        }
    };

    WebSvc.prototype.StateChange = function (xmlDoc, callback) {
        // Callback supplied for XMLHttpObject to monitor state and retrieve data when returns.
        // PARAM xmlDoc - XMLHttpObject we're watching
        // PARAM callback - Callback function for returning data, signature CallBack(result,data)

        if (xmlDoc.readyState === 4) {
            var text = "";

            if (xmlDoc.status === 200) {
                text = xmlDoc.responseText;
            }

            // Perform callback with data if callback function signature was provided, 
            if (callback !== null) {
                callback(xmlDoc.status === 200, text);
            }
        }
    };
}