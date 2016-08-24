/**
 * Created by Superuser on 21.07.2016.
 */

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
        channelName: "Bitmovin-Channel" //e.g. ESPN2, Food Network, etc.
    };

    /* If initial video or a new video is loaded then change nielsen metadata object */
    player.addEventHandler(bitdash.EVENT.ON_SOURCE_LOADED, function(data) {

        nSdkInstance.ggPM(nEvent.METADATA, metadataObject);
    });

    player.addEventHandler(bitdash.EVENT.ON_PLAY, function(data) {

        nSdkInstance.ggPM(nEvent.PLAY, metadataPlay);
    });

    player.addEventHandler(bitdash.EVENT.ON_METADATA, function(data) {

        var index = 0;
        for (; index < data.metadata.frames.length; index++)
        {
            var ID3tag = data.metadata.frames[0].owner;
            if (ID3tag.includes(nielsen_string)) {

                nSdkInstance.ggPM(nEvent.ID3, ID3tag);
                console.log("Sending: " + ID3tag);
            }
        }
    });

    player.addEventHandler(bitdash.EVENT.ON_PLAYBACK_FINISHED, function(data) {

        sendPlayHead(player, nEvent.END, nSdkInstance);
    });
}

function sendPlayHead(player, nEvent, nSdkInstance) {

    if (player.isLive()) {
        nSdkInstance.ggPM(nEvent, (Date.now() / 1000));
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