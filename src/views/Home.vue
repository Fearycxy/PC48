<template>
    <div class="layout">
        <Tabs type="card" closable @on-tab-remove="handleTabRemove" :value="activeTab">
            <TabPane label="App" :closable="homeClosable">
                <Layout>
                    <Sider hide-trigger width="120">
                        <Menu :active-name="$Constants.MENU.LIVES" theme="dark" width="auto" @on-select="onMenuSelect">
                            <MenuItem :name="Constants.MENU.LIVES">直播</MenuItem>
                            <MenuItem :name="Constants.MENU.REVIEWS">回放</MenuItem>
                            <MenuItem :name="Constants.MENU.TRIPS">行程</MenuItem>
                            <MenuItem :name="Constants.MENU.JUJU">聚聚</MenuItem>
                            <MenuItem :name="Constants.MENU.MESSAGES">消息</MenuItem>
                            <MenuItem :name="Constants.MENU.SETTINGS">设置</MenuItem>
                        </Menu>
                    </Sider>

                     <Layout>
                        <Content style="padding: 8px 16px;min-height: 600px;">
                            <Card>
                                <div>
                                    <Lives ref="lives" v-show="menus[Constants.MENU.LIVES]"
                                           :col="colNum"
                                           @on-item-click="openLive"></Lives>
<!-- 
                                    <Reviews ref="reviews" v-show="menus[Constants.MENU.REVIEWS]"
                                             :col="colNum"
                                             @on-item-click="openLive"
                                             :members="members"
                                             :teams="teams"
                                             :groups="groups"></Reviews>

                                    <Trips v-show="menus[Constants.MENU.TRIPS]"></Trips>

                                    <MessageBox
                                            v-show="menus[Constants.MENU.MESSAGES]"></MessageBox>

                                    <JuJu v-show="menus[Constants.MENU.JUJU]"></JuJu>

                                    <Settings v-show="menus[Constants.MENU.SETTINGS]"></Settings> -->
                                </div>
                            </Card>
                        </Content>
                    </Layout>
                </Layout>
            </TabPane>
            <!-- eslint-disable -->
            <TabPane v-for="(liveTab, index) in liveTabs" :label="liveTab.label" v-if="liveTab.show" :name="liveTab.name">
                <Live :index="index" :live-id="liveTab.liveId" :start-time="liveTab.startTime" :title="liveTab.title"></Live>
            </TabPane>
            <!-- eslint-enable -->
        </Tabs>
    </div>
</template>
<script>
// @ is an alias to /src
// import HelloWorld from '@/components/HelloWorld.vue'
// import Live from "@/components/Live";
import Lives from "@/components/Lives"
import Constants from "@/assets/js/constants"
import Database from "@/assets/js/database"
const menus = {}
Object.keys(Constants.MENU).forEach(key => {
    menus[key] = Constants.MENU[key] == Constants.MENU.LIVES;
})

export default {
    name: 'App',
    components: {Lives},
    data() {
        return {
            homeClosable: false,
            liveTabs: [],
            activeTab: 0,
            syncing: false,
            colNum: 8,
            Constants:Constants,
            menuShow: {
                lives: true,
                reviews: false,
                settings: false,
                messages: false
            },
            menus: menus,
            activeMenu: this.$Constants.MENU.LIVES,
            members: [],
            teams: [],
            groups: []
        }
    },

    methods: {
        handleTabRemove: function(name) {
            const index = this.liveTabs.findIndex(item => {
                return item.name == name;
            });

            this.liveTabs[index].show = false;
        },
        openLive: function (item) {
                const exists = this.liveTabs.some(tab => {
                    return tab.liveId == item.liveId && tab.show == true;
                });
                if (exists) return;
                const liveTab = {
                    label: `${item.userInfo.nickname}的直播间`,
                    title: item.title,
                    liveId: item.liveId,
                    show: true,
                    name: item.liveId + '_' + Math.random().toString(36).substr(2),
                    startTime: parseInt(item.ctime)
                };
                this.liveTabs.push(liveTab);
                this.activeTab = liveTab.name;
            },
        onMenuSelect: function(name) {
            switch (name) {
                case this.$Constants.MENU.JUJU:
                case this.$Constants.MENU.MESSAGES:
                    if (!Database.isLogin()) {
                        this.$Message.warning({
                            content: '登录后才能使用'
                        });
                        return;
                    }
                    break;
            }

            Object.keys(this.menus).forEach(key => {
                this.menus[key] = key == name;
            });
            this.activeMenu = name;
        },
    }
}
</script>
<style scoped>
</style>