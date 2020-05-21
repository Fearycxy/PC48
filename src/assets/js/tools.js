import ffmpeg from 'fluent-ffmpeg';
import axios from 'axios';

const ffmpegPath = require('ffmpeg-static').replace('app.asar', 'app.asar.unpacked');
ffmpeg.setFfmpegPath(ffmpegPath);

Date.prototype.format = function(fmt) {
    const o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "h+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    }
    for (const k in o) {
        if (new RegExp("(" + k + ")").test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) :
                (("00" + o[k]).substr(("" + o[k]).length)));
        }
    }
    return fmt;
};

const YI_ZHI_BO_HOST = 'alcdn.hls.xiaoka.tv';

class Tools {
    /**
     *
     * @param picturesStr
     * @returns {any[]}
     */
    static pictureUrls(picturesStr) {
        const pictures = picturesStr.split(',');
        return pictures.map(picture => {
            if (picture.includes('http')) {
                return picture;
            } else {
                return 'https://source.48.cn' + picture;
            }
        });
    }

    static sourceUrl(sourcePath) {
        if (sourcePath.includes('http://')) {
            return sourcePath;
        } else {
            return 'https://source.48.cn' + sourcePath;
        }
    }

    static timeToSecond(time) {
        if (!time) return;
        const hours = time.split(':')[0];
        const minutes = time.split(':')[1];
        const seconds = time.split(':')[2];
        return Number(hours) * 3600 + Number(minutes) * 60 + Number(seconds);
    }

    static setSenderName(senderName) {
        localStorage.setItem('senderName', senderName);
    }

    static getSenderName() {
        return localStorage.getItem('senderName');
    }

    static lyricsParse(lyrics) {
        const barrages = [];
        const lines = lyrics.split('\n');
        lines.forEach(line => {
            if (line) {
                const tmp = line.split(']');
                if (tmp) {
                    const arr = tmp[1].split('\t');
                    barrages.push({
                        time: tmp[0].replace('[', ''),
                        username: arr[0],
                        content: arr[1]
                    })
                }
            }
        });
        return barrages;
    }

    static streamPathHandle(streamPath, timestamp) {
        const date = new Date(timestamp);
        const liveDate = `${date.getFullYear()}${date.getMonth() + 1}${date.getDate()}`;
        /* eslint-disable */
        return streamPath.replace(/^(http|https):\/\/([^\/]+)\/(\d+)/, function(pathPrefix, protocol, host) {
            if (host.toLowerCase() != YI_ZHI_BO_HOST) {
                return pathPrefix;
            }

            return `${protocol}://${host}/${liveDate}`;
        })
        /* eslint-enable */
    }

    static createVideoServer(playerStreamPath, port) {
        const http = require('http');
        return http.createServer((request, response) => {
            ffmpeg().input(playerStreamPath)
                .nativeFramerate()
                .videoCodec('copy')
                .audioCodec('copy')
                .format('mp4')
                .outputOptions('-movflags', 'frag_keyframe+empty_moov')
                .pipe(response);
        }).listen(port);
    }

    static isToday(timestamp) {
        if (timestamp == null) return false;
        const date = new Date().format('MM-dd');
        const lastCheckInDate = new Date(timestamp).format('MM-dd');
        if (date == lastCheckInDate) {
            return true;
        }

        return false;
    }
/* eslint-disable */
    static checkForUpdate() {
        return new Promise((resolve, reject) => {
            axios.get('https://raw.githubusercontent.com/Jarvay/desktop48/master/package.json').then(response => {
                const remoteVersion = response.data.version;
                const localVersion = require('../../../package').version;
                const localVerArray = localVersion.split('.');
                const remoteVerArray = remoteVersion.split('.');
                let hasUpdate = false;
                if (remoteVerArray[0] > localVerArray[0]) {
                    hasUpdate = true;
                } else if (remoteVerArray[0] == localVerArray[0]) {
                    if (remoteVerArray[1] > localVerArray[1]) {
                        hasUpdate = true;
                    } else if (remoteVerArray[1] == localVerArray[1]) {
                        if (remoteVerArray[2] > localVerArray[2]) {
                            hasUpdate = true;
                        }
                    }
                }
                if (hasUpdate) {
                    resolve();
                } else {
                    reject();
                }
            }).catch(error => {
                reject();
            });
        });
    }
}

export default Tools;