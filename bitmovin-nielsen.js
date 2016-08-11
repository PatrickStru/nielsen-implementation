/**
 * Created by Superuser on 21.07.2016.
 */

var interval;
var ad_type;

var nEvent = {
    PLAY:       "5",
    ID3:        "55",
    END:        "57",
    METADATA:  "3"
};

function nielsenAnalytics(player, nSdkInstance)
{
    var ID3 = [];
    var nielsen_string = "www.nielsen.com";

    var metadataObject =
    {
        "type": "content",                      // leave value 'content' here -> important!
        "length": player.getDuration(),         // (required)
        "title": "Bitmovin Content",            // should be provided by the customer (required)
        "program": "Bitmovin Adaptive Stream",  // should be provided by the customer (required)
        "assetid": "4",                         // should be provided by the customer (required)
        "segB": "segmentB",                     // should be provided by the customer (required)
        "segC": "segmentC",                     // should be provided by the customer (required)
        "isfullepisode":"Y",                    // should be provided by the customer (required)
        "airdate": getCurrentDate(),            // (required)
        "adloadtype": "2"                       // should be provided by the customer (“1” – Linear “2” – Dynamic) (required)
    };

    var metadataPlay = {
        "channelName": "Bitmovin-Channel" //e.g. ESPN2, Food Network, etc.
    };

    player.addEventHandler(bitdash.EVENT.ON_PLAY, function(data) {

        nSdkInstance.ggPM(nEvent.METADATA, metadataObject);
        nSdkInstance.ggPM(nEvent.PLAY, metadataPlay);

        /* not needed anymore due to DTVR package */
        //interval = setInterval(function() { sendPlayHead(player, nEvent.PLAYHEAD, nSdkInstance); }, 1000);
    });

    /* not needed anymore due to DTVR package */
    /*player.addEventHandler(bitdash.EVENT.ON_PAUSE, function(data) {

     clearInterval(interval);
     });*/

    player.addEventHandler(bitdash.EVENT.ON_METADATA, function(data) {

        var index = 0;
        for (; index < data.metadata.frames.length; index++)
        {
            /* Parsing of nielsen stream not needed here */

            /* Just sending founded ID3 data to nielsen server */
            nSdkInstance.ggPM(nEvent.ID3, data.metadata.frames[0].owner);
        }

    });

    /* Ads werden vorübergehend nicht behandelt, da API calls zur Durchführung noch nicht bereitgestellt sind
     player.addEventHandler(bitdash.EVENT.ON_AD_STARTED, function(data) {

     ad_type = checkAdType(ad_type);

     var adMetadataObject = {
     "type": "preroll",
     "length": player.getDuration(),
     "assetid": "pre",
     "adModel": "2",                 // should be provided by the customer
     "tv": "true",                   // should be provided by the customer
     "dataSrc": "cms"
     };
     sendPlayHead(player, nEvent.STOP, nSdkInstance);
     nSdkInstance.ggPM(nEvent.METADATA, adMetadataObject);

     });

     player.addEventHandler(bitdash.EVENT.ON_AD_FINISHED, function(data) {

     //clearInterval(interval);
     sendPlayHead(player, nEvent.STOP, nSdkInstance);
     nSdkInstance.ggPM(nEvent.METADATA, metadataObject);
     }); */

    player.addEventHandler(bitdash.EVENT.ON_PLAYBACK_FINISHED, function(data) {

        sendPlayHead(player, nEvent.END, nSdkInstance);
    });
}

/* not needed anymore due to DTVR package */
function sendPlayHead(player, nEvent, nSdkInstance) {

    if (player.isLive()) {
        nSdkInstance.ggPM(nEvent, (Date.now()/1000));
    }
    else {
        nSdkInstance.ggPM(nEvent, parseInt(player.getCurrentTime()));
    }
}

function getCurrentDate() {

    var data;
    var date = new Date();
    if (date.getMonth() < 10 && date.getDate() < 10) {

        data = date.getFullYear() + "0" + date.getMonth() + "0" + date.getDate() + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
    }
    else if (date.getMonth() < 10) {

        data = date.getFullYear() + "0" + date.getMonth() + "" + date.getDate() + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
    }
    else if (date.getDate() < 10) {

        data = date.getFullYear() + "" + date.getMonth() + "0" + date.getDate() + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
    }
    else {
        data = date.getFullYear() + "" + date.getMonth() + "" + date.getDate() + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
    }
    return data;
}

/*
 function checkAdType(type) {

 if (type == "") {
 return "preroll";
 }
 else if (type == "preroll") {
 return "midroll";
 }
 else {
 return "postroll";
 }
 } */