// local variable definitions used for finding the API
var apiHandle = null;
var API = null;
var findAPITries = 0;
var _NoError = "0";
var _Debug = false;
// local variable used to keep from calling LMSFinish more than once
var finishCalled = 0;

/*****************************************************************************
** Function findAPI(win)
** Inputs: win - a Window Object
** Return: If an API object is found, it's returned; otherwise, null is returned
**
** Description:
** This function looks for an object named API in parent and opener windows
**
*****************************************************************************/
function findAPI(win)
{
    while ((win.API == null) && (win.parent != null) && (win.parent != win))
     {
       findAPITries++;
       // Note: 7 is an arbitrary number, but should be more than sufficient
       if (findAPITries > 7)
        {
          alert("Error finding API -- too deeply nested.");
          return null;
        }
      win = win.parent;
    }
   return win.API;
}

/*****************************************************************************
**
** Function getAPI()
** Inputs: none
** Return: If an API object is found, it's returned; otherwise, null is returned
**
** Description:
** This function looks for an object named API, first in the current window's
** frame hierarchy and then, if necessary, in the current window's opener window
** hierarchy (if there is an opener window).
**
*******************************************************************************/
function getAPI()
{
 var theAPI = findAPI(window);
 if ((theAPI == null) && (window.opener != null) && (typeof(window.opener) != "undefined"))
 {
  theAPI = findAPI(window.opener);
 }
 if (theAPI == null)
 {
  throw new Error("Unable to find an API adapter");
 }
 return theAPI
}

/*****************************************************************************
**
** Function getAPIHandle()
** Inputs: None
** Return: value contained by APIHandle
**
** Description:
** Returns the handle to API object if it was previously set;
** otherwise, it returns null
**
*****************************************************************************/
function getAPIHandle()
{
 if (apiHandle == null)
 {
  apiHandle = getAPI();
 }
 return apiHandle;
}


/**********************************************************************
**
** Function: doLMSInitialize()
** Inputs: None
** Return: CMIBoolean true if the initialization was successful or
** CMIBoolean false if the initialization failed.
**
** Description:
** Initialize communication with LMS by calling the LMSInitialize
** function, which will be implemented by the LMS.
**
**********************************************************************/
function doLMSInitialize()
{
 var api = getAPIHandle();
 if (api == null)
 {
  alert( "Unable to locate the LMS's API Implementation.\n" + "LMSInitialize was not successful.");
  return "false";
 }
 var result = api.LMSInitialize("");
 if (result.toString() != "true")
 {
  // may want to do some error handling
 }
 return result.toString();
}


















/**********************************************************************
**
** Function doLMSFinish()
** Inputs: None
** Return: CMIBoolean true if successful
** CMIBoolean false if failed.
**
** Description:
** Close communication with LMS by calling the LMSFinish
** function, which will be implemented by the LMS
**
**********************************************************************/
function doLMSFinish()
{
 var api = getAPIHandle();
 if (api == null)
 {
  alert( "Unable to locate the LMS's API Implementation.\n" + "LMSFinish was not successful.");
  return "false";
 }
 else
 {
  // call LMSFinish only if it was not previously called
  if ( ! finishCalled )
  {
   finishCalled = 1;
   // call the LMSFinish function that should be implemented by the API
   var result = api.LMSFinish("");
   if (result.toString() != "true")

   {
    // may want to do some error handling
   }
  }
 }
return result.toString();
}









/***********************************************************************
**
** Function doLMSGetValue(name)
** Inputs: name - string representing the cmi data model defined category or
** element (e.g. cmi.core.student_id)
** Return: The value presently assigned by the LMS to the cmi data model
** element defined by the element or category identified by the name
** input value.
**
** Description:
** Wraps the call to the LMS LMSGetValue method
**
**************************************************************************/
function doLMSGetValue(name)
{
 var api = getAPIHandle();
 if (api == null)
 {
  alert( "Unable to locate the LMS's API Implementation.\n" + "LMSGetValue was not successful.");
  return "";
 }
 else
 {
  var value = api.LMSGetValue(name);
  var errCode = api.LMSGetLastError().toString();
  if (errCode != "0")
  {
   // may want to do some error handling
  }
  else
  {
   return value.toString();
  }
 }
}











/******************************************************************************
**
** Function doLMSSetValue(name, value)
** Inputs: name -string representing the data model defined category or element
** value -the value that the named element or category will be assigned
** Return: CMIBoolean true if successful
** CMIBoolean false if failed.
**
** Description:
** Wraps the call to the LMS LMSSetValue function
**
****************************************************************************/
function doLMSSetValue(name, value)
{
 var api = getAPIHandle();
 if (api == null)
 {
  alert( "Unable to locate the LMS's API Implementation.\n" + "LMSSetValue was not successful.");
  return;
 }
 else
 {
  var result = api.LMSSetValue(name, value);
  if (result.toString() != "true")
  {
   // may want to do some error handling
  }
 }
 return;
}
















/**********************************************************************
**
** Function normalExit()
** Inputs: None
** Return: None
**
** Description:
** Makes the appropriate calls for a normal exit calling LMSFinish and
** setting cmi.core.exit to "" for a normal exit
**
**********************************************************************/
function normalExit()
{
 // do not call a set after finish was called
 if ( ! finishCalled )
 {
  doLMSSetValue( "cmi.core.exit", "" );
 }
 doLMSFinish();
}


/**********************************************************************
**
** Function abnormalExit()
** Inputs: None
** Return: None
**
** Description:
** Makes the appropriate calls for an abnormal exit calling LMSFinish
** and setting cmi.core.exit to suspend
**
**********************************************************************/
function abnormalExit()
{
 // do not call a set after finish was called
 if ( ! finishCalled )
 {
 alert('suspend');
  doLMSSetValue( "cmi.core.exit", "suspend" );
 }
 doLMSFinish();
}
























/*******************************************************************************
**
** Function doLMSCommit()
** Inputs:  None
** Return:  None
**
** Description:
** Call the LMSCommit function 
**
*******************************************************************************/
function doLMSCommit()
{
   var api = getAPIHandle();
   if (api == null)
   {
      alert("Unable to locate the LMS's API Implementation.\nLMSCommit was not successful.");
      return "false";
   }
   else
   {
      var result = api.LMSCommit("");
      if (result != "true")
      {
         var err = ErrorHandler();
      }
   }

   return result.toString();
}

/*******************************************************************************
**
** Function ErrorHandler()
** Inputs:  None
** Return:  The current value of the LMS Error Code
**
** Description:
** Determines if an error was encountered by the previous API call
** and if so, displays a message to the user.  If the error code
** has associated text it is also displayed.
**
*******************************************************************************/
function ErrorHandler()
{
   var api = getAPIHandle();
   if (api == null)
   {
      alert("Unable to locate the LMS's API Implementation.\nCannot determine LMS error code.");
      return;
   }

   // check for errors caused by or from the LMS
   var errCode = api.LMSGetLastError().toString();
   if (errCode != _NoError)
   {
      // an error was encountered so display the error description
      var errDescription = api.LMSGetErrorString(errCode);

      if (_Debug == true)
      {
         errDescription += "\n";
         errDescription += api.LMSGetDiagnostic(null);
         // by passing null to LMSGetDiagnostic, we get any available diagnostics
         // on the previous error.
      }

      alert(errDescription);
   }

   return errCode;
}