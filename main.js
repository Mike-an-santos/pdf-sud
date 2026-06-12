const { app, BrowserWindow } = require('electron');
const path = require('path');

function criarJanela() {
  const win = new BrowserWindow({
    width: 1280,
    height: 860,
    icon: path.join(__dirname, 'PDF.ico'),
    backgroundColor: '#0a0e18',
    autoHideMenuBar: true
  });
  win.loadFile('PDF_SUD.html');
}

app.whenReady().then(() => {
  criarJanela();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) criarJanela();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
