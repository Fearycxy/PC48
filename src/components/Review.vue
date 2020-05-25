<template>
    <video-player class="video-player-box" ref="videoPlayer" :options="playerOptions" :playsinline="true" @ready="playerReadied">
    </video-player>
</template>
<script>
// Similarly, you can also introduce the plugin resource pack you want to use within the component
// import 'some-videojs-plugin'
import 'video.js/dist/video-js.css'

import { videoPlayer } from 'vue-video-player'
import ipcMain from 'electron'
let ipcRenderer = ipcMain.ipcRenderer
import videojs from 'video.js'
window.videojs = videojs
require('videojs-contrib-hls/dist/videojs-contrib-hls.js')
export default {
    name: "Review",
    components: {
        videoPlayer
    },
    created() {
        console.log(`Review.vue create`)
        ipcRenderer.on('data', (event, data) => {
            console.log(data) // Prints 'whoooooooh!'
            this.playerOptions.sources[0].src = data.streamPath
        })
    },
    data() {
        return {
            playerOptions: {
                // videojs options
                muted: false,
                language: 'en',
                autoplay: true,
                looped: false,
                playbackRates: [0.7, 1.0, 1.5, 2.0],
                sources: [{
                    withCredentials: false,
                    type: "application/x-mpegURL",
                    src: ''
                }],
                controlBar: {
                    timeDivider: false,
                    durationDisplay: false
                },
                flash: { hls: { withCredentials: false } },
                html5: { hls: { withCredentials: false } }
                // poster: "/static/images/author.jpg",
            }
        }
    },
    mounted() {
        console.log('this is current player instance object', this.player)
    },
    methods: {
        playerReadied(player) {
            // var hls = player.tech({ IWillNotUseThisInPlugins: true }).hls
            player.tech_.hls.xhr.beforeRequest = function(options) {
                // console.log(options)
                return options
            }
        }
    }
}
</script>