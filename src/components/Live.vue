<template>
    <div>
        <span>{{path}}</span>
    </div>
</template>
<script>
import ipcMain from 'electron'
let ipcRenderer = ipcMain.ipcRenderer
export default {
    name: "Live",
    created() {
        console.log(`Live.vue create`)
        ipcRenderer.on('data', (event, data) => {
            console.log(data) // Prints 'whoooooooh!'
            this.path = data.streamPath
        })
    },
    data() {
        return {
            path: ''
        }
    },
}
</script>
<style scoped>
</style>