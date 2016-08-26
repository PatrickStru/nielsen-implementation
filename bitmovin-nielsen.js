/**
 * Created by Superuser on 21.07.2016.
 */

var interval;
var ad_type;

var nEvent = {
    PLAY:       "play",
    ID3:        "sendID3",
    END:        "end",
    METADATA:   "loadMetadata"
};

function nielsenAnalytics(player, nSdkInstance)
{
    var nielsen_string = "www.nielsen.com";

    var metadataObject =
    {
        type:           "content",
        adModel:        "1",
        channelName:    "Bitmovin-Channel"
    };

    var metadataPlay = {
        "channelName": "Bitmovin-Channel" //e.g. ESPN2, Food Network, etc.
    };

    player.addEventHandler(bitdash.EVENT.ON_SOURCE_LOADED, function(data) {

        var offset;
        var linear;
        var channel;
        // Check if new source is an Ad
        if (data.adConfig != undefined) {
            offset = data.adConfig.offsetType;
            linear = data.adConfig.creativeType;
            channel = data.adConfig.clientType;
            console.log(data.adConfig);
        }
        else {
            console.log(data);
        }
        //nSdkInstance.ggPM(nEvent.METADATA, metadataObject);
    });

    player.addEventHandler(bitdash.EVENT.ON_PLAY, function(data) {

        console.log(JSON.stringify(data));
        //nSdkInstance.ggPM(nEvent.PLAY, metadataPlay);

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
            var ID3tag = data.metadata.frames[0].owner;
            if (ID3tag.includes(nielsen_string)) {

                //nSdkInstance.ggPM(nEvent.ID3, ID3tag);
                console.log("Sending: " + ID3tag);
            }
        }
    });

     // Ads werden vorübergehend nicht behandelt, da API calls zur Durchführung noch nicht bereitgestellt sind

     player.addEventHandler(bitdash.EVENT.ON_AD_STARTED, function(data) {

         console.log(JSON.stringify(data));

         var adMetadataObject = {
         "type": "preroll",
         "length": player.getDuration(),
         "assetid": "pre",
         "adModel": "2",                 // should be provided by the customer
         "tv": "true",                   // should be provided by the customer
         "dataSrc": "cms"
         };
         //sendPlayHead(player, nEvent.STOP, nSdkInstance);
         //nSdkInstance.ggPM(nEvent.METADATA, adMetadataObject);
     });

    player.addEventHandler(bitdash.EVENT.ON_AD_FINISHED, function(data) {

        console.log(JSON.stringify(data));
        //clearInterval(interval);
        //sendPlayHead(player, nEvent.STOP, nSdkInstance);
        //nSdkInstance.ggPM(nEvent.METADATA, metadataObject);
    });

    player.addEventHandler(bitdash.EVENT.ON_PLAYBACK_FINISHED, function(data) {

        console.log(JSON.stringify(data));
        //sendPlayHead(player, nEvent.END, nSdkInstance);
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