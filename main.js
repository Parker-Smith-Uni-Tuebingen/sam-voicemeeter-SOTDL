const { app, BrowserWindow, session } = require('electron');

// 1. Bypass Windows audio sandbox (crucial for virtual audio cables like VoiceMeeter)
app.commandLine.appendSwitch('disable-features', 'AudioServiceSandbox');

// 2. Suppress the GPU cache errors you were seeing in the terminal
app.commandLine.appendSwitch('disable-gpu-shader-disk-cache');

// 3. Allow audio to play immediately
app.commandLine.appendSwitch('autoplay-policy', 'no-user-gesture-required');

function createWindow () {
  const win = new BrowserWindow({
    width: 620,
    height: 780,
    title: "SAM to VoiceMeeter",
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });
  
  win.setMenuBarVisibility(false);
  
  // NOTE: If you still have issues, uncomment the line below to see the error console!
  // win.webContents.openDevTools();

  win.loadFile('index.html');
}

app.whenReady().then(() => {
  // 4. Automatically grant device permission so it can see VoiceMeeter natively
  session.defaultSession.setPermissionRequestHandler((webContents, permission, callback) => {
    if (permission === 'media') {
      callback(true); // Auto-approve audio device access
    } else {
      callback(false);
    }
  });
  
  createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});