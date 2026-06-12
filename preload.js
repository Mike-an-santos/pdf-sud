const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  onOpenPDF: (callback) => ipcRenderer.on('open-pdf', (event, payload) => callback(payload))
});
