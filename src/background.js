'use strict'

import { app, protocol, BrowserWindow, Menu, shell, ipcMain } from 'electron'
import {
    createProtocol,
    /* installVueDevtools */
} from 'vue-cli-plugin-electron-builder/lib'
import Vue from 'vue'
const isDevelopment = process.env.NODE_ENV !== 'production'

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
var mainWin



// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([{ scheme: 'app', privileges: { secure: true, standard: true } }])

function createWindow() {
    mainWin = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            webSecurity: false
        }
    })
    if (process.env.WEBPACK_DEV_SERVER_URL) {
        // Load the url of the dev server if in development mode
        mainWin.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
        if (!process.env.IS_TEST) mainWin.webContents.openDevTools()
    } else {
        createProtocol('app')
        // Load the index.html when not in development
        mainWin.loadURL('app://./index.html')
    }

    mainWin.maximize()
    mainWin.show()

    mainWin.on('closed', () => {
        mainWin = null
        Vue.prototype.$mainWin = null
    })
    Vue.prototype.$mainWin = mainWin
}

let template = [{
    label: '帮助',
    role: 'help',
    submenu: [{
            label: 'Github',
            click: function() {
                shell.openExternal('https://github.com/Fearycxy/desktop48')
            }
        },
        {
            label: '调试',
            click: function() {
                mainWin.webContents.openDevTools()
            }
        }
    ]
}]

// Quit when all windows are closed.
app.on('window-all-closed', () => {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWin === null) {
        createWindow()
    }
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
    // if (isDevelopment && !process.env.IS_TEST) {
    const menu = Menu.buildFromTemplate(template)
    Menu.setApplicationMenu(menu)
    // Install Vue Devtools
    // Devtools extensions are broken in Electron 6.0.0 and greater
    // See https://github.com/nklayman/vue-cli-plugin-electron-builder/issues/378 for more info
    // Electron will not launch with Devtools extensions installed on Windows 10 with dark mode
    // If you are not using Windows 10 dark mode, you may uncomment these lines
    // In addition, if the linked issue is closed, you can upgrade electron and uncomment these lines
    // try {
    //   await installVueDevtools()
    // } catch (e) {
    //   console.error('Vue Devtools failed to install:', e.toString())
    // }

    // }
    createWindow()
})

//app.setAppUserModelId('cn.jarvay.desktop48')//TODO don/t know about id
// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
    if (process.platform === 'win32') {
        process.on('message', data => {
            if (data === 'graceful-exit') {
                app.quit()
            }
        })
    } else {
        process.on('SIGTERM', () => {
            app.quit()
        })
    }
}

ipcMain.on('load-window', (event, data) => {
    // create the window
    // width = !data.width ? data.width : 1440
    // height = !data.height ? data.height : 900
    let win = new BrowserWindow({
        show: false,
        width: 400,
        height: 680,
        title: data.title,
        parent:mainWin,
        webPreferences: {
            nodeIntegration: true,
            plugins: true,
            webSecurity: false
        }
    })
    win.once('ready-to-show', () => {
        win.show()
    })
    let url = process.env.WEBPACK_DEV_SERVER_URL ? (process.env.WEBPACK_DEV_SERVER_URL + data.url) : `app://./${data.url}`
    win.loadURL(url)
    if (!process.env.IS_TEST) win.webContents.openDevTools()
    win.on('closed', () => {
        win = null
    })
    // here we can send the data to the new window
    win.webContents.once('did-finish-load', () => {
        if (win != null)
            win.webContents.send('data', data);
    });

});


// Exit cleanly on request from parent process in development mode.