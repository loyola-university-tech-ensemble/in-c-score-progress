const path = require('path');
const url = require('url');
const { app, BrowserWindow } = require('electron');

let mainWindow = null;

app.on('ready', () => {
  mainWindow = new BrowserWindow({
    height: 800,
    width: 1200,
    webPreferences: { nodeIntegration: true },
  });

  mainWindow.loadFile('app/index.html')

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
});

app.on('window-all-closed', () => {
  app.quit();
});
