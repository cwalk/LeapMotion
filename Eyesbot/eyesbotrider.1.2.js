var stopRetrieving=false;
var showMotionImage=false;
var alreadyRetrieving=false;
var needLogin = false;
var photoOn = false;
var loginSpanShowing = false;
var lastIdLoaded = null;
var errorCounter=0;
var webSplashImage=null;
var image0Element=null;
var image1Element=null;
var image2Element=null;
var rateled0 =null;
var nextImageElement=null;
var pauseSpan=null;
var token="";
var messageSpan = null;
var serverSending=true;
var timesDelayed=0;
var followingLight = false;
var secondsToDelay=10;
var kNoResponseRetrievalDelay=10;
var kOneSecond=1000;
var kBatteryReadDelayMillis=20000;
var batteryNextReadMillis=0;
var retrievalDelay=100;
var noResponse=false;
var loggedIn = false;
var lightsOn = false;
var runningLightsOn = false;
var messages = new Array();
var gotConfig = false;
var frameRates = new Array(60000, 10000, 1000, 100, 20, 17);
var frameRateOptions = new Array("1_60", "1_10", "1_1", "10_1", "20_1", "30_1");
var rateMessages = new Array("1 frame per 60 seconds", "1 frame per 10 seconds", "1 frame per second", "10 frames per second", "20 frames per second", "30 frames per second");
var settingUp = true;
var waitingForImage = false;
var retrievalThread = 0;
var checkingMovement = false;
var checkingBatteryStatus = false;
var checkingMovementStarted = false;
var sendingTrajectoryStarted = false;
var checkingDistance = false;
var retrievingDistance = false;
var buttonDown= false;
var sendingTrajectory = false;
var lastLeftTrajectory = -100;
var lastRightTrajectory = -100;
var lastLeftTrajectorySent = -100;
var lastRightTrajectorySent = -100;
var hasNewTrajectory = false;
var usingFrontCamera = true;
var programNames = new Array();
var cameraReversed = false;


function getUrlContents(element){
    url="";
    var gettingConfig =false;
    var loggingIn =false;
    var recognizing = false;
    var learning = false;
    var checkingStatus =false;
    var movementDetected = false;
    var defeatCache =""+new Date().getTime();
    var checkingForMotion=true;
    
    if(typeof element === 'string'){
       if(element.indexOf("go=")==0){
           url="/command/?"+element+"&r="+defeatCache;
       }
       else if(element=="getconfig"){//these first several use strings, the others are DOM elements
          addServerMessage("Getting configuration");
          messageSpan=document.getElementById("messagespan");
          gettingConfig =true;
          url="/command/?config=retrieve"+"&r="+defeatCache;
       }
       else if(element=="getstatus"){
           checkingStatus=true;
           url="/command/?status=all&token="+token+"&r="+defeatCache;
       }
       else if(element=="getbatterystatus"){
           checkingBatteryStatus=true;
           url="/command/?battery=check&token="+token+"&r="+defeatCache;
       }
       else if(element=="clearmdphoto"){
          url="/command/?mdphoto=clear&token="+token+"&r="+defeatCache;
       }
       else if(element=="savemdphoto"){
          url="/command/?mdphoto=save&token="+token+"&r="+defeatCache;
       }
       else if(element=="wasmotiondetected"){
          checkingForMotion=true;
           url="/command/?wasmotiondetected=check&token="+token+"&r="+defeatCache;
       }
       else if(element=="dismissalarm"){
          url="/command/?dismissalarm=true&token="+token+"&r="+defeatCache;
       }
    }
    else if(element.id=="reversecamera"){
        if(settingUp) return;
        cameraReversed = !cameraReversed;
        if(cameraReversed){
            url="/command/?cameraside=back&token="+token+"&r="+defeatCache;
        }
        else{
            url="/command/?cameraside=front&token="+token+"&r="+defeatCache;
        }
    }
    else if(element.id=="followlight"){
        followingLight = !followingLight;
        if(followingLight){
            url="/command/?followlight=on&token="+token+"&r="+defeatCache;
            document.getElementById("followlight").setAttribute("src", "./followlight.on.png");
            addServerMessage("Now following light");
        }
        else{
            url="/command/?followlight=off&token="+token+"&r="+defeatCache;
            document.getElementById("followlight").setAttribute("src", "./followlight.off.png");
            addServerMessage("Now not following light");
        }
    }
    else if(element.id=="learn"){
        var objectName = document.getElementById("objectname").value;
        if(objectName.length==0){
            alert("Please supply an object name");
        }
        else{
            learning = true;
            document.getElementById("learn").setAttribute("src", "./learn.on.png");
            document.getElementById("objectname").value="";
            url="/command/?learn="+objectName+"&token="+token+"&r="+defeatCache;
        }
    }
    else if(element.id=="recognize"){
        recognizing=true;
        document.getElementById("recognize").setAttribute("src", "./recognize.on.png");
        url="/command/?lookforknownobjects=ok&token="+token+"&r="+defeatCache;
    }
    else if(element.id=="loginbutton"){
        loggingIn=true;
        var password = document.getElementById("passwordinput").value;
        url="/command/?login="+password+"&r="+defeatCache;
        document.getElementById("passwordinput").value="";
        //document.getElementById("messagespan").innerHTML="";
        //document.getElementById("pausespan").innerHTML="Logging in....";
    }
    else if(needLogin&&(!loggedIn)){
        showLoginSpan();          
    }
    else if(element.id=="motiondetection"){
        if(settingUp) return;
        addServerMessage("Updating motion detection settings");
        var selectControl =document.getElementById("motiondetection");
        var newSensitivity = selectControl.options[selectControl.selectedIndex].value;
        if(newSensitivity=="nomd"){
            checkingMovement=false;
        }
        else{
            checkingMovement=true;
        }
        url="/command/?motiondetection="+newSensitivity+"&token="+token+"&r="+defeatCache;
    }
    else if(element.id=="distance"){
        if(checkingDistance){
            url="/command/?distance=return&token="+token+"&r="+defeatCache;
            element.setAttribute("src", "./distance.off.png");
            checkingDistance = false;
            retrievingDistance = true;
        }
        else{
            url="/command/?distance=determine&token="+token+"&r="+defeatCache;
            element.setAttribute("src", "./distance.on.png");
            checkingDistance = true;
            retrievingDistance = false;
            setTimeout(function(){getUrlContents(document.getElementById("distance"))}, 5000);
        }
    }
    else if(element.id=="refreshprogramsbutton"){
    }
    else if(element.id=="loadprogrambutton"){
    }
    else if(element.id=="saveprogrambutton"){
    }
    else if(element.id=="lightbutton"){
        lightsOn=!lightsOn;
        if(lightsOn){
            url="/command/?lights=on&token="+token+"&r="+defeatCache;
            element.className="selectedButton";
        }
        else{
            url="/command/?lights=off&token="+token+"&r="+defeatCache;
            element.className="enabledButton";
        }
    }
    else if(element.id=="runninglightbutton"){
        runningLightsOn=!runningLightsOn;
        if(runningLightsOn){
            url="/command/?runninglights=on&token="+token+"&r="+defeatCache;
            element.className="selectedButton";
        }
        else{
            url="/command/?runninglights=off&token="+token+"&r="+defeatCache;
            element.className="enabledButton";
        }
    }
    else if(element.id=="rearviewspan"){
        addServerMessage("Updating camera side");
        usingFrontCamera = !usingFrontCamera;
        var rearViewControl =document.getElementById("rearviewspan");
        if(usingFrontCamera){
            url="/command/?cameraside=front&token="+token+"&r="+defeatCache;
            rearViewControl.style.background = "";
        }
        else{
            url="/command/?cameraside=back&token="+token+"&r="+defeatCache;
            rearViewControl.style.background = "#A0A0A0";
        }
    }
    else if(element.id=="stopbutton"){
        if(alreadyRetrieving){
            returnToCenter();
            element.setAttribute("src", "./stop.on.png");
            setTimeout(function(){popupStopButton()}, 300);
        }
        var soundElement = document.getElementById("click_sound");
        soundElement.Play();
        return;
    }
    else if(element.id=="pausebutton"){
        if(alreadyRetrieving){
            returnToCenter();
            showSplash();
            addServerMessage("Pausing");
            alreadyRetrieving=false;
            stopRetrieving=true;
            element.className="selectedButton";
        }
        else{
            addServerMessage("Trying to restart after pause");
            element.className="enabledButton";
            startRetrieval();
        }
        var soundElement = document.getElementById("click_sound");
        soundElement.Play();
        return;
    }
    else if(element.id=="logoutbutton"){
        if(!needLogin)
            return;
        messages.length=0;
        showSplash();
        stopRetrieving=true;
        alreadyRetrieving=false;
        url="/command/?logout="+token+"&token="+token+"&r="+defeatCache;
        token="";
        showLoginSpan();
        document.getElementById("messagespan").innerHTML="";
    }
    else if(element.id=="framerate"){
        addServerMessage("Setting frame rate");
        var selectControl =document.getElementById("framerate");
        var newRate = selectControl.options[selectControl.selectedIndex].value;
        url="/command/?setframerate="+newRate+"&token="+token+"&r="+defeatCache;
    }
    else if(element.id=="photobutton"){
        addServerMessage("Taking photo");
        photoOn=true;
        url="/command/?photo=on&token="+token+"&r="+defeatCache;
        element.setAttribute("src", "./photo.on.png");
        setTimeout(function(){popupPhotoButton()}, 300);
        var soundElement = document.getElementById("click_sound");
        soundElement.Play();
    }
    try{
        var ajaxRequest;
        if (window.XMLHttpRequest) {
            ajaxRequest = new XMLHttpRequest();
        } else {
            ajaxRequest = new ActiveXObject("Microsoft.XMLHTTP");
        }
        
        if (ajaxRequest) {
            if(learning || recognizing){
                ajaxRequest.open("GET", url, false);
                ajaxRequest.send();
            }
            else{
                ajaxRequest.open("GET", url, true);
                ajaxRequest.onreadystatechange = function(){bitBucketResponse();}
            }
            
            if(gettingConfig){
                ajaxRequest.onreadystatechange = function(){
                    if (ajaxRequest.readyState == 4) {
                        if (ajaxRequest.status == 200) {
                            var responseText = ajaxRequest.responseText;
                            parseConfigResponse(responseText);
                        }
                    }
                }
            }
            else if(loggingIn){
                ajaxRequest.onreadystatechange = function(){
                    if (ajaxRequest.readyState == 4) {
                        if (ajaxRequest.status == 200) {
                            var responseText = ajaxRequest.responseText;
                            parseLoginResponse(responseText);
                        }
                    }
                }
            }
            else if(checkingStatus){
                ajaxRequest.onreadystatechange = function(){
                    if (ajaxRequest.readyState == 4) {
                        if (ajaxRequest.status == 200) {
                            var responseText = ajaxRequest.responseText;
                            parseStatusResponse(responseText);
                        }
                    }
                }
            }
            else if(checkingBatteryStatus){
                ajaxRequest.onreadystatechange = function(){
                    if (ajaxRequest.readyState == 4) {
                        if (ajaxRequest.status == 200) {
                            //var responseText = ajaxRequest.responseText;
                            
                        }
                    }
                }
            }
            else if(retrievingDistance){
                ajaxRequest.onreadystatechange = function(){
                    if (ajaxRequest.readyState == 4) {
                        if (ajaxRequest.status == 200) {
                            var responseText = ajaxRequest.responseText;
                            addServerMessage(responseText);
                            retrievingDistance = false;
                        }
                    }
                }
            }
            else if(checkingForMotion){
                ajaxRequest.onreadystatechange = function(){
                    if (ajaxRequest.readyState == 4) {
                        if (ajaxRequest.status == 200) {
                            var responseText = ajaxRequest.responseText;
                            parseMotionDetectedResponse(responseText);
                        }
                    }
                }
            }
            if(learning){
                learning = false;
                document.getElementById("learn").setAttribute("src", "./learn.off.png");
            }
            else if(recognizing){
                var responseText = ajaxRequest.responseText;
                addServerMessage(responseText);
                recognizing = false;
                document.getElementById("recognize").setAttribute("src", "./recognize.off.png");
            }
            else{
                ajaxRequest.send(null);
            }
        }
    }
    catch (err){
    }
    
    return "";
}

function bitBucketResponse(){
    
}
      
function popupPhotoButton(){
    var element=document.getElementById("photobutton");
    element.className="enabledButton";
}

function popupStopButton(){
    var element=document.getElementById("stopbutton");
    element.className="enabledButton";
}

function popupLearnButton(){
    var element=document.getElementById("stopbutton");
    element.setAttribute("src", "./learn.off.png");
}

function startRetrieval(){
    document.getElementById("pausespan").style.display="none";
    document.getElementById("trynowspan").style.display="none";
    serverSending=true;
    errorCounter=0;
    secondsToDelay=0;
    waitingForImage = false;
    stopRetrieving=false;
    alreadyRetrieving =true;
    retrievalThread++;
    getNextImage(new Date().getTime(), retrievalThread);
    if(!checkingMovementStarted){
        checkingMovementStarted= true;
        checkForMovement();
    }
    if(!sendingTrajectoryStarted){
        sendingTrajectoryStarted= true;
        sendNewTrajectory();
    }
}

function getNextImage(imageCounter, threadId) {
    if(stopRetrieving){
        showSplash();
        return;
    }
    if(threadId!=retrievalThread)
        return;

    var currentMillis = new Date().getMilliseconds();
    if(currentMillis>batteryNextReadMillis){
        batteryNextReadMillis=currentMillis+kBatteryReadDelayMillis;
    }

    if(!waitingForImage){
        if((serverSending)||(secondsToDelay==0)){
            if(nextImageElement==image0Element){
                nextImageElement=image1Element;
            }
            else if(nextImageElement==image1Element){
                nextImageElement=image2Element;
            }
            else if(nextImageElement==image2Element){
                nextImageElement=image0Element;
            }
            else{
                nextImageElement=document.getElementById("image_0");
            }
            var url = "/image/?counter="+imageCounter+"&token="+token;
            nextImageElement.setAttribute("src", url);
            imageCounter++;
            waitingForImage=true;
        }
    }
    if(serverSending){
       setTimeout(function(){getNextImage(imageCounter, threadId)}, retrievalDelay);
    }
    else{
        if(secondsToDelay==0){
            secondsToDelay=kNoResponseRetrievalDelay+(timesDelayed*kNoResponseRetrievalDelay);
            if(timesDelayed<5){
                timesDelayed++;
            }
            if(needLogin&&loggedIn&&!paused){
                checkLoginStatus();
            }
        }
        if(!loginSpanShowing){
            showPaused(true, "EyesBot Driver not sending images, will try again in "+secondsToDelay+" seconds...");
        }
        secondsToDelay--;
        setTimeout(function(){getNextImage(imageCounter, threadId)}, kOneSecond);
    }
}

function tryNow(){
    secondsToDelay=0;
}



function imageLoaded(imageElement){
    if(showMotionImage){
        return;
    }
    if(stopRetrieving){
        webSplashImage.style.display="inline-block";
        image0Element.style.display="none";
        image1Element.style.display="none";
        image2Element.style.display="none";
        return;
    }
    if(!serverSending){
        showPaused(false, "");
        timesDelayed=0;
        secondsToDelay=kNoResponseRetrievalDelay;
    }
    errorCounter = 0;
    serverSending=true;
    waitingForImage=false;
    if(imageElement==image0Element)
    {
        webSplashImage.style.display="none";
        image0Element.style.display="inline-block";
        image1Element.style.display="none";
        image2Element.style.display="none";
    }
    else if(imageElement==image1Element)
    {
        webSplashImage.style.display="none";
        image0Element.style.display="none";
        image1Element.style.display="inline-block";
        image2Element.style.display="none";
    }
    else if(imageElement==image2Element)
    {
        webSplashImage.style.display="none";
        image0Element.style.display="none";
        image1Element.style.display="none";
        image2Element.style.display="inline-block";
    }
}

function imageErrored(imageElement){
    waitingForImage=false;
    //imageElement.style.display="none";
    errorCounter++;
    
    if(!serverSending){
        checkLoginStatus();
    }
    
    if(errorCounter>3){
        showSplash();
        //first check login status, if not logged in log in again
        if(serverSending){
            serverSending=false; 
            if(needLogin&&loggedIn){
                checkLoginStatus();
            }
        }
    }
}

function mdImageLoaded(imageElement){
    
}

function mdImageErrored(imageElement){
}

function showSplash(){
    webSplashImage.style.display="inline-block";
    document.getElementById("md_image").style.display="none";
    image0Element.style.display="none";
    image1Element.style.display="none";
    image2Element.style.display="none";
}

function showPaused(show, pauseMessage){
    if(show){
        document.getElementById("pausespan").style.display="inline-block";
        document.getElementById("trynowspan").style.display="inline-block";
        document.getElementById("buttonsspan").style.display="none";
        document.getElementById("programmingspanwrapper").style.display="none";
        document.getElementById("loginspan").style.display="none";
        showSplash();
        document.getElementById("pausespan").innerHTML=pauseMessage;
    }
    else{
        document.getElementById("pausespan").style.display="none";
        document.getElementById("trynowspan").style.display="none";
        document.getElementById("buttonsspan").style.display="inline-block";
        document.getElementById("programmingspanwrapper").style.display="inline-block";
    }
}

function showMotionDetectionImage(){
    checkingMovement = false;
    showMotionImage=true;
    var imageElement=document.getElementById("md_image");
    var defeatCache =""+new Date().getTime();
    imageElement.setAttribute("src", "/capture/?token="+token+"&r="+defeatCache);
    document.getElementById("motiondetectionphotorow").style.display="table-row";
    document.getElementById("motiondetectionalarmrow").style.display="none";
    webSplashImage.style.display="none";
    image0Element.style.display="none";
    image1Element.style.display="none";
    image2Element.style.display="none";
    imageElement.style.display="inline-block";
}


function dismissMotionDetectionImage(){
    showMotionImage=false;
    document.getElementById("motiondetectionphotorow").style.display="none";
    var imageElement=document.getElementById("md_image");
    imageElement.setAttribute("src", "");
    imageElement.style.display="none";
    webSplashImage.style.display="none";
    image0Element.style.display="inline-block";
    image1Element.style.display="none";
    image2Element.style.display="none";
    waitingForImage = false;
}

function clearMotionDetectionImage(){
    getUrlContents("clearmdphoto");
    dismissMotionDetectionImage();
}

function saveMotionDetectionImage(){
    getUrlContents("savemdphoto");
    dismissMotionDetectionImage();
}

function dismissAlarm(){
    checkingMovement = false;
    document.getElementById("motiondetection").selectedIndex=0;
    getUrlContents("dismissalarm");
    document.getElementById("dismissalarmrow").style.display="none";
    var soundElement = document.getElementById("alarm_sound");
    soundElement.Stop();
    checkingMovement = false;
}

function checkLoginStatus(){
    getUrlContents("getstatus");
}

function setRate(select){
    if(settingUp) return;
    var selectedIndex=select.selectedIndex;
    getUrlContents(select);
    retrievalDelay = frameRates[selectedIndex];
    startRetrieval();
}

function parseConfigResponse(responseText){
    
    document.getElementById("passwordinput").onkeydown= function(event) {
        if (event===undefined) event= window.event; 
        if (event.keyCode == 13) {
            if((timesDelayed>1)&&(timesDelayed<5))
               timesDelayed--;
            getUrlContents(document.getElementById("loginbutton"));
        }
    };

    
    //document.getElementById("behavior").selectedIndex = 0;
    
    //var motionControl = document.getElementById("moving_controlstick");
    document.onmousedown = OnMouseDown;
    document.onmouseup = OnMouseUp;
    
    //all of these are loaded only once to increase performance
    pauseSpan = document.getElementById("pausespan");
    webSplashImage=document.getElementById("websplashimage");
    image0Element=document.getElementById("image_0");
    image1Element=document.getElementById("image_1");
    image2Element=document.getElementById("image_2");
    nextImageElement=image0Element;
    var audioSpan = document.getElementById("audiospan");
    var audioSpanHTML ="<embed src=\"./click.wav\" id=\"click_sound\" loop=\"FALSE\" width=\"0\" height=\"0\" autostart=\"false\" enablejavascript=\"true\"/>\r\n";
    audioSpanHTML +="<embed src=\"./alarm.wav\" id=\"alarm_sound\" loop=\"TRUE\" width=\"0\" height=\"0\" autostart=\"false\" enablejavascript=\"true\"/>\r\n";
    audioSpan.innerHTML = audioSpanHTML;
    
    createSpeedControls();
    
    settingUp = true;
    var hasWebService = false;
    var parsedResponse = responseText.split("\r\n");
    var rate = "";
    var useVideoInterface = false;
    for(var i=0; i<parsedResponse.length; i++){
        var line = parsedResponse[i];
        if(line.indexOf("maximumframerate:") == 0){
            rate = line.substring(17);
        }
        else if(line.indexOf("needlogin:true") == 0){
            needLogin =true;
        }
        else if(line.indexOf("webservice:")==0){
            if(line=="webservice:present"){
                hasWebService = true;
            }
        }
        else if(line.indexOf("uitype:")==0){
            if(line=="uitype:video"){
                useVideoInterface = true;
            }
        }
        else if(line.indexOf("prog_")==0){
            
        }
        else if(line.indexOf("cameras:")==0){
            if(line=="cameras:2"){
                if(document.getElementById("parseConfigResponse") !=  null){
                    document.getElementById("parseConfigResponse").style.display="block";
                }
            }
            else{
                document.getElementById("parseConfigResponse").style.display="none";
            }
        }
    }
    
    
    
    /*
    if(hasWebService){
        document.getElementById("webservice").style.display="inline";
    }
    else{
        document.getElementById("webservice").style.display="none";
    }
    */
    var option=null;
    var rateMessage = "Server is configured for up to 30 frames per second";

    if(useVideoInterface){
        document.getElementById("lightbutton").style.display="none";
        document.getElementById("stopbutton").style.display="none";
        document.getElementById("leftspeedlabel").style.display="none";
        document.getElementById("rightspeedlabel").style.display="none";
        document.getElementById("speedcontrolspan").style.display="none";
    }
    else{
        document.getElementById("lightbutton").style.display="inline-block";
        document.getElementById("stopbutton").style.display="inline-block";
        document.getElementById("leftspeedlabel").value="";
        document.getElementById("rightspeedlabel").value="";
        document.getElementById("speedcontrolspan").style.display="inline-block";
    }
    
    settingUp = false;
    if(needLogin){
        document.getElementById("logoutbutton").style.display="inline-block";
        showLoginSpan();
        paused=true;
    }
    else{
        document.getElementById("logoutbutton").style.display="none";
        hideLoginSpan();
        startRetrieval();
    }
    
}

function parseStatusResponse(responseText){
    
    if(stopRetrieving) return;
    
    var parsedResponse = responseText.split("\r\n");
    
    for(var i=0; i<parsedResponse.length; i++){
        var line = parsedResponse[i];
        if(line.indexOf("loggedin:true") == 0){
            document.getElementById("logoutbutton").style.display="inline-block";
            loggedIn=true;
        }
        else if(line.indexOf("loggedin:false") == 0){
            loggedIn=false;
        }
        else if(line.indexOf("token:") == 0){
            token=line.substring(6);
        }
    }
    if(loggedIn){
        hideLoginSpan();
    }
    else{
        showLoginSpan();
    }
}

function parseMotionDetectedResponse(responseText){
    
    if(stopRetrieving) return;
    
    var parsedResponse = responseText.split("\r\n");
    
    for(var i=0; i<parsedResponse.length; i++){
        var line = parsedResponse[i];
        if((line.indexOf("motiondetected:true") == 0)&&(checkingMovement)){
            var soundElement = document.getElementById("alarm_sound");
            soundElement.Play();
            document.getElementById("motiondetectionphotorow").style.display="none";
            document.getElementById("motiondetectionalarmrow").style.display="table-row";
            document.getElementById("dismissalarmrow").style.display="table-row";
        }
    }
}

function parseMotionUpdateResponse(responseText){
    /*
    if(stopRetrieving) return;
    
    var parsedResponse = responseText.split("\r\n");
    
    for(var i=0; i<parsedResponse.length; i++){
        var line = parsedResponse[i];
        if((line.indexOf("motiondetected:true") == 0)&&(checkingMovement)){
            var soundElement = document.getElementById("alarm_sound");
            soundElement.Play();
            document.getElementById("motiondetectionphotorow").style.display="none";
            document.getElementById("motiondetectionalarmrow").style.display="table-row";
            document.getElementById("dismissalarmrow").style.display="table-row";
        }
    }
    
    */
}

function parseLoginResponse(responseText){
    var parsedResponse = responseText.split("\r\n");
    for(var i=0; i<parsedResponse.length; i++){
        var line = parsedResponse[i];
        if(line.indexOf("loggedin:true") == 0){
            addServerMessage("Logged in");
            loggedIn=true;
        }
        else if(line.indexOf("loggedin:false") == 0){
            document.getElementById("loginerror").innerHTML="Login failed, please try again";
            loggedIn=false;
        }
        else if(line.indexOf("token:") == 0){
            token=line.substring(6);
        }
    }
    if(loggedIn){
        hideLoginSpan();
        secondsToDelay=10;
        errorCounter=0;
        startRetrieval();
    }
}

function addServerMessage(message){
    //if(messageSpan==null){
    //    messageSpan = document.getElementById("messagespan");
    //}

    //messages.push(message);
    //if(messages>25){
    //    messages.splice(0, 1);
    //}
    //messageSpan.innerHTML=messages.join("<BR>");
}

function showLoginSpan(){
    loginSpanShowing = true;
    document.getElementById("buttonsspan").style.display="none";
    document.getElementById("programmingspanwrapper").style.display="none";
    document.getElementById("loginspan").style.display="inline-block";
    document.getElementById("pausespan").style.display="none";
    document.getElementById("trynowspan").style.display="none";
    document.getElementById("programmingspan").style.display="none";
    document.getElementById("showprogrammingbutton").style.display="none";
}

function hideLoginSpan(){
    loginSpanShowing = false;
    document.getElementById("buttonsspan").style.display="inline-block";
    document.getElementById("programmingspanwrapper").style.display="inline-block";
    document.getElementById("showprogrammingbutton").style.display="inline-block";
    document.getElementById("loginspan").style.display="none";
}


function checkForMovement(){
    if(checkingMovement){
        getUrlContents("wasmotiondetected");
    }
    setTimeout(function(){checkForMovement()}, 500);
}

function OnMouseDown(e){
    buttonDown=true;
}

function OnMouseUp(e){
    buttonDown=false;
}


function returnToCenter(){
    updateTrajectory(0, 0);
    document.getElementById("leftspeedlabel").innerHTML = "left: 0";
    document.getElementById("rightspeedlabel").innerHTML = "right: 0";
}


function updateTrajectory(left, right){
    if((left != lastLeftTrajectorySent)||(right!=lastRightTrajectorySent)){
        lastLeftTrajectory = left;
        lastRightTrajectory = right;
        hasNewTrajectory = true;
    }
}

function sendNewTrajectory(){
    if(hasNewTrajectory){
        var leftString = ""+lastLeftTrajectory;
        var rightString = ""+lastRightTrajectory;
        hasNewTrajectory = false;
        lastLeftTrajectorySent = lastLeftTrajectory;
        lastRightTrajectorySent = lastRightTrajectory;
        setSpeed(lastLeftTrajectory, lastRightTrajectory);
    }
    setTimeout(function(){sendNewTrajectory()}, 50);
}

function showHelp(){
    var soundElement = document.getElementById("click_sound");
    soundElement.Play();
    var ret=confirm("EyesBot will attempt to open http://www.EyesBot.com/gettingstarted, should EyesBot continue?")
    if (ret==true){
        window.open( "http://www.EyesBot.com/gettingstarted", "eyesbothelp" );
    }
}

function endsWith(str, suffix) {
    return str.indexOf(suffix, str.length - suffix.length) !== -1;
}

function startsWith(str, test) {
    str.substring(0, test.length) === input;
}

function createSpeedControls(){
    
    var speedControlSpan = document.getElementById("speedcontrolspan");
    if(speedControlSpan==null){
        return;
    }
    var additionalX = 0;
    var additionalY=0;
    speedControlSpan.addEventListener('touchmove', function(e){ e.preventDefault(); }, false);
    for (var column=10; column<31; column++){
        for (var row=10; row<31; row++){
            var speedSpan = document.createElement("span");
            speedSpan.id="speed_"+column+"_"+row;
            speedSpan.innerHTML = "&nbsp;";
            speedSpan.style.display="inline-block";
            speedSpan.setAttribute("unselectable", "on");
            speedSpan.className = "unselectable";
            speedSpan.style.cursor="pointer";
            speedSpan.style.width="7px";
            speedSpan.style.height="7px";
            speedSpan.style.zIndex=200;
            additionalX=2;
            additionalY=2;
            if(column == 10){
                speedSpan.style.width="9px";
                additionalX=0;
            }
            if(column == 30){
                speedSpan.style.width="10px";
            }
            if(row == 10){
                additionalY=0;
                speedSpan.style.height="9px";
            }
            if(row == 30){
                speedSpan.style.height="8px";
            }
            
            speedSpan.style.left=(0+additionalX+(7*(column-10)))+"px";
            speedSpan.style.top=(0+additionalY+(7*(row-10)))+"px";
            speedSpan.style.position = "absolute";
            speedControlSpan.appendChild(speedSpan);
            speedSpan.onclick = function(){speedClicked(this);};
            speedSpan.onmousemove = function(){speedMouseMove(this);};
            speedSpan.addEventListener('touchstarted', speedTouchClicked, false);
            speedSpan.addEventListener('touchmove', speedTouchMove, false);
            speedSpan.addEventListener('touchended', speedTouchEnded, false);
        }
    }
}

function speedTouchClicked(e){
    buttonDown = true;
    //speedClicked(e.target);
}

function speedTouchEnded(e){
    buttonDown = false;
}


function speedTouchMove(e){
    speedClicked(e.target);
}


function speedMouseMove(element){
    
    if(!buttonDown){
        return;
    }

    speedClicked(element);
}

function speedClicked(element){
    if(stopRetrieving)
        return;
    //speed_[column]_row
    var elementId = element.id;
    if(elementId=="speedcontrolspan")
        return;
    
    var column = parseInt(elementId.substring(6, 8));
    var row = parseInt(elementId.substring(9, 11));

    column -=20;
    var absoluteColumn = column;
    if(absoluteColumn<0) absoluteColumn *=-1;
    row -=20;
    var absoluteRow=row;
    if(absoluteRow<0) absoluteRow*=-1;
    
    var leftSpeed = 0;
    var rightSpeed = 0;
    if(absoluteColumn>0){
        var magnitude = Math.max(absoluteColumn, absoluteRow);
        rightSpeed = magnitude;
        var subtractor = Math.min(absoluteColumn, absoluteRow);
        leftSpeed = absoluteRow - absoluteColumn;
    }
    else {
        leftSpeed = absoluteRow;
        rightSpeed = absoluteRow;
    }
    
    //this is because the above code assumes bottom is higher, but it is more
    //natural for the UI to have top being higher
    leftSpeed*=-1;
    rightSpeed*=-1;
    if(row<0){
        leftSpeed*=-1;
        rightSpeed*=-1;
    }
    else{
        var tempSpeed = leftSpeed;
        leftSpeed = rightSpeed;
        rightSpeed = tempSpeed;
    }
    if(column<0){
        var tempSpeed = leftSpeed;
        leftSpeed = rightSpeed;
        rightSpeed = tempSpeed;
    }
    
    var leftSpeedLabel = document.getElementById("leftspeedlabel");
    var rightSpeedLabel = document.getElementById("rightspeedlabel");
   
    //if((rightSpeed==-1)||(rightSpeed==1))
    //    rightSpeed =0;
    //if((leftSpeed==-1)||(leftSpeed==1))
    //P    leftSpeed =0;
    
    leftSpeedLabel.innerHTML = "left: "+rightSpeed;
    rightSpeedLabel.innerHTML = "right: "+leftSpeed;
    
    
    
    //alert("here "+elementId);
    updateTrajectory(leftSpeed/10, rightSpeed/10);

}

function toggleRunningJavascript(){
    if(document.getElementById("playprogrambutton").innerHTML == "Run"){
        eval(document.getElementById("programsource").value);
        document.getElementById("playprogrambutton").innerHTML = "Stop";
    }
    else{
        stopRobotScript();
        document.getElementById("playprogrambutton").innerHTML = "Run";
    }
}

function deleteProgram(){
    var programName=document.getElementById("programname").value;
    
    var ajaxRequest;
    if (window.XMLHttpRequest) {
        ajaxRequest = new XMLHttpRequest();
    } else {
        ajaxRequest = new ActiveXObject("Microsoft.XMLHTTP");
    }
    
    if (ajaxRequest) {
        ajaxRequest.open("GET","/robot/?program=delete&name="+programName,true);
        ajaxRequest.send(null);
    }
    
    document.getElementById("programsource").value = "" ;
    document.getElementById("programname").value = "";
}

function loadProgram(fileName){
    var programText=document.getElementById("programsource");
    var programName=document.getElementById("programname");
    programName.value = fileName;
    
    var ajaxRequest;
    if (window.XMLHttpRequest) {
        ajaxRequest = new XMLHttpRequest();
    } else {
        ajaxRequest = new ActiveXObject("Microsoft.XMLHTTP");
    }
    
    if (ajaxRequest) {
        ajaxRequest.open("GET","/robot/?program=load&name="+programName.value, true);
        ajaxRequest.send();
        ajaxRequest.onreadystatechange = function(){
            if (ajaxRequest.readyState == 4) {
                if (ajaxRequest.status == 200) {
                    var responseText = ajaxRequest.responseText;
                    programText.value = responseText;
                }
            }
        }
    }
}

function sendRobotCommand(command){
    sendRobotCommand(command, null);
}

function sendRobotCommand(command, callback){
    var defeatCache =""+new Date().getTime();
    
    var ajaxRequest;
    if (window.XMLHttpRequest) {
        ajaxRequest = new XMLHttpRequest();
    } else {
        ajaxRequest = new ActiveXObject("Microsoft.XMLHTTP");
    }
    
    if (ajaxRequest) {
        ajaxRequest.open("GET","/robot/?"+command+"&r="+defeatCache,true);
        ajaxRequest.setRequestHeader("Content-type","application/x-www-form-urlencoded");
        ajaxRequest.send();
        if(callback!=null){
            ajaxRequest.onreadystatechange = function(){
                if (ajaxRequest.readyState == 4) {
                    if (ajaxRequest.status == 200) {
                        callback(ajaxRequest.responseText);
                    }
                }
            }
        }
    }
}

function saveProgram(){
    var programText=document.getElementById("programsource").value;
    var programName=document.getElementById("programname").value;
    
    var ajaxRequest;
    if (window.XMLHttpRequest) {
        ajaxRequest = new XMLHttpRequest();
    } else {
        ajaxRequest = new ActiveXObject("Microsoft.XMLHTTP");
    }
    
    if (ajaxRequest) {
        ajaxRequest.open("POST","/robot/?program=save&name="+programName,true);
        ajaxRequest.setRequestHeader("Content-type","application/x-www-form-urlencoded");
        ajaxRequest.send(programText);
    }
}

function loadProgramsList(){
    var ajaxRequest;
    if (window.XMLHttpRequest) {
        ajaxRequest = new XMLHttpRequest();
    } else {
        ajaxRequest = new ActiveXObject("Microsoft.XMLHTTP");
    }
    
    if (ajaxRequest) {
        ajaxRequest.open("GET","/robot/?program=list", true);
        ajaxRequest.send();
        ajaxRequest.onreadystatechange = function(){
            if (ajaxRequest.readyState == 4) {
                if (ajaxRequest.status == 200) {
                    var responseText = ajaxRequest.responseText;
                    createProgramsList(responseText);
                }
            }
        }
    }
}

function createProgramsList(jsonText){
    var programListSpan = document.getElementById("programlistspan");
    var programObj = eval("(" + jsonText + ")");

    var programingNameSpans = "<span style=\"display:inline-block;vertical-align:top;position:relative;padding:0px;width:520px;text-align:left;margin: 5px 0px 5px 0px;\">";
    var even = true;
    for(var i = 0; i < programObj.programs.length; i++) {
        var programFileName = programObj.programs[i];
        even = !even;
        if(even){
            programingNameSpans += "<span onclick=\"loadProgram('"+programFileName+"');\" style=\"display:inline-block;width:400px;height:20px;border:1px solid #666666;background:#C0C0C0;cursor:pointer;\">"+programFileName+"</span>";
        }
        else{
            programingNameSpans += "<span onclick=\"loadProgram('"+programFileName+"');\" style=\"display:inline-block;width:400px;height:20px;border:1px solid #666666;background:#F0F0F0;cursor:pointer;\">"+programFileName+"</span>";
        }
    }
    programingNameSpans += "</span>";
    
    programListSpan.innerHTML = programingNameSpans;
}

function showprogrammingSpan(){
    var programmingSpan = document.getElementById("programmingspan");
    var programmingButtonSpan = document.getElementById("showprogrammingbutton");
    if(programmingSpan.style.display == "none"){
        programmingButtonSpan.innerHTML ="Hide Programming Interface";
        programmingSpan.style.display ="inline-block";
        loadProgramsList();
    }
    else{
        programmingButtonSpan.innerHTML ="Show Programming Interface";
        programmingSpan.style.display ="none";
    }
}
