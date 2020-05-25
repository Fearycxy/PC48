<template>
    <div>
        <video id="video-element" controls={true}></video>
    </div>
</template>
<script>
// Similarly, you can also introduce the plugin resource pack you want to use within the component
// import 'some-videojs-plugin'
import flvjs from 'flv.js';
import Constants from '../assets/js/constants.js'
// import { videoPlayer } from 'vue-video-player'
import ipcMain from 'electron'

export default {
    name: "Live",
    created() {
        console.log(`Live.vue create`)
        let ipcRenderer = ipcMain.ipcRenderer
        ipcRenderer.on('data', (event, data) => {
            console.log(data) // Prints 'whoooooooh!'
            if (flvjs.isSupported()) {
                const videoElement = document.getElementById('video-element');
                const flvPlayer = flvjs.createPlayer({
                    type: 'flv',
                    isLive: true,
                    url: `http://localhost:${Constants.HTTP_PORT}/live/${ data.serverId }.flv`
                });
                flvPlayer.attachMediaElement(videoElement);
                flvPlayer.load();
                flvPlayer.play()
            }

        })
    },
    data() {
        return {}
    },
    mounted() {},
    methods: {
        playerReadied(player) {
            // var hls = player.tech({ IWillNotUseThisInPlugins: true }).hls
            player.tech_.hls.xhr.beforeRequest = function(options) {
                // console.log(options)
                return options
            }
        },


    }
}
</script>