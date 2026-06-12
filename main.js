const { app, BrowserWindow } = require('electron');
const path = require('path');
const fs = require('fs');

let win = null;

function encontrarPDF(argv) {
  return (argv || []).find(a =>
    typeof a === 'string' && a.toLowerCase().endsWith('.pdf') && fs.existsSync(a)
  );
}

function entregarPDF(caminho) {
  if (!caminho || !win) return;
  try {
    const dados = fs.readFileSync(caminho);
    const nome = path.basename(caminho);
    const enviar = () => win.webContents.send('open-pdf', { name: nome, data: dados });
    if (win.webContents.isLoading()) {
      win.webContents.once('did-finish-load', enviar);
    } else {
      enviar();
    }
  } catch (e) {
    console.error('entregarPDF', e);
  }
}

function criarJanela() {
  win = new BrowserWindow({
    width: 1280,
    height: 860,
    icon: path.join(__dirname, 'PDF.ico'),
    backgroundColor: '#0a0e18',
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  });
  win.loadFile('PDF_SUD.html');
  entregarPDF(encontrarPDF(process.argv));
}

// uma só instância: se abrires outro PDF, usa a janela já aberta
const lock = app.requestSingleInstanceLock();
if (!lock) {
  app.quit();
} else {
  app.on('second-instance', (event, argv) => {
    if (win) { if (win.isMinimized()) win.restore(); win.focus(); }
    entregarPDF(encontrarPDF(argv));
  });

  app.whenReady().then(() => {
    criarJanela();
    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) criarJanela();
    });
  });

  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
  });
}
