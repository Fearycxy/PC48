<template>
    <Layout>
        <!-- eslint-disable -->
        <Header class="header" align = "right">
                <Button class="rf-btn" type="primary" @click="refresh">刷新</Button>
        </Header>
        <Content>
            <div>
                <Spin size="large" fix v-if="liveSpinShow"></Spin>
                <Card v-if="liveList.length == 0" style="margin-bottom:8px">
                    <p slot="title">当前没有直播</p>
                </Card>
                <Row v-for="index in Math.ceil(liveList.length / col)" :key="index">
                    <Col style="padding: 4px;" span="3" v-for="(item, i) in liveList" v-if="i <  index * col && i >= (index - 1) * col" :key="item.liveId">
                    <div class="live-card" @click="onItemClick(item)">
                        <Card>
                            <p slot="title" class="live-title">
                                <span>{{item.title}}</span>
                            </p>
                            <p slot="extra">
                                <Tag v-if="item.liveType == 1" color="purple">直播</Tag>
                                <Tag v-else color="orange">电台</Tag>
                            </p>
                            <div class="cover-container">
                                <img ref="cover" class="cover" :src="item.cover">
                            </div>
                            <p class="live-date">{{item.date}}</p>
                            <div style="display: flex;justify-content: space-between;">
                                <div class="member-info">
                                    <span style="color: #000;font-size:">{{item.userInfo.nickname}}</span>
                                    <span class="team-badge" :style="{'background-color':`#${item.member.team.teamColor}`}">{{item.member.team.teamName.replace('TEAM ', '')}}</span>
                                </div>
                            </div>
                        </Card>
                    </div>
                    </Col>
                </Row>
            </div>
        </Content>
        <!-- eslint-enable -->
    </Layout>
</template>
<script>
import Apis from '../assets/js/apis';
import Tools from '../assets/js/tools';
import Database from "../assets/js/database";
import Dev from '../assets/js/dev';
import ipcMain from 'electron'
let ipcRenderer = ipcMain.ipcRenderer
export default {
    name: "Lives",
    props: {
        col: {
            type: Number,
            required: true
        }
    },
    data() {
        return {
            liveSpinShow: true,
            liveList: [],
            liveNext: '0',
            distance: -10
        }
    },
    mounted() {
        console.log('Lives.vue mounted')
        this.refresh()
    },
    methods: {
        getLiveList: function() {
            this.liveSpinShow = true;

            Apis.lives("0", this.liveNext).then(content => {
                this.liveSpinShow = false;
                // if (this.liveNext == content.next && this.liveNext != '0') {
                //     this.showListEndTips();
                //     return;
                // }

                const newList = [];
                content.liveList.forEach(item => {
                    item.cover = Tools.pictureUrls(item.coverPath);
                    item.date = new Date(parseInt(item.ctime)).format('yyyy-MM-dd hh:mm');
                    item.userInfo.teamLogo = Tools.pictureUrls(item.userInfo.teamLogo);
                    item.isReview = true;
                    item.member = Database.member(item.userInfo.userId);

                    const hidden = Database.getHiddenMembers().some(memberId => {
                        return memberId == item.userInfo.userId;
                    });
                    if (!hidden) {
                        newList.push(item);
                    }
                });
                this.liveList = newList;
                this.liveNext = content.next
            }).catch(error => {
                this.liveSpinShow = false;
                this.$Message.error({
                    content: error
                });
                console.error(error);
            });
        },
        refresh: function() {
            Dev.log('Lives.vue', 'refresh')
            this.liveNext = "0";
            this.liveList = [];
            this.getLiveList();
        },
        // onLiveReachBottom: function() {
        //     Dev.log('Lives.vue', `exec onLiveReachBottom next: ${this.liveNext}`)
        //     return new Promise(resolve => {
        //         this.getLiveList(this.liveNext);
        //         resolve();
        //     });
        // },
        // showListEndTips: function() {
        //     this.$Notice.info({
        //         title: '没有更多了'
        //     })
        // },
        onItemClick: function(item) {
            // this.$emit('on-item-click', item);
            Apis.live(item.liveId).then(content => {
                content.url = 'live';
                content.serverId = Tools.getIndex();
                Tools.play_rtmp(content);
                ipcRenderer.send('load-window', content);
            }).catch(error => {
                this.$Message.error({
                    content: `直播已结束！error: ${error}`
                });
                console.error(error);
            });
        }
    }
}
</script>
<style scoped>
.rf-btn {
    display: inline-flex;
    ;
}
</style>