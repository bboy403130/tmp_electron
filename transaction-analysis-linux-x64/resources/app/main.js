const { app, Menu }= require('electron');
const electron = require('electron');
// Module to control application life.
const globalShortcut = electron.globalShortcut;
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow;

const path = require('path');
const url = require('url');
const fs = require('fs');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;
let guideWindow = null;
const debugMode = false;
function createGuideWindow() {

	guideWindow = new BrowserWindow({parent:mainWindow});

	guideWindow.loadURL(url.format({
		pathname: path.join(__dirname, 'guide.html'),
		protocol: 'file:',
		slashes: true
	}));
	guideWindow.show();
	guideWindow.on('closed', ()=>{
		console.log("guideWindow is closed");
		guideWindow = null;
	});

}
function createWindow () {
	createMenu();
	// Create the browser window.
	mainWindow = new BrowserWindow();
	mainWindow.maximize();
	// and load the index.html of the app.
	mainWindow.loadURL(url.format({
		pathname: path.join(__dirname, 'index.html'),
		protocol: 'file:',
		slashes: true
	}));
	createGuideWindow();
	// Open the DevTools.
	if(debugMode) {
		mainWindow.webContents.openDevTools();
		guideWindow.hide();
	}else{

	}



	// Emitted when the window is closed.
	mainWindow.on('closed', function () {
		// Dereference the window object, usually you would store windows
		// in an array if your app supports multi windows, this is the time
		// when you should delete the corresponding element.
		mainWindow = null;
	});
	//open or close devToll
	const ret = globalShortcut.register('CommandOrControl+E', () => {
		console.log(mainWindow.webContents.isDevToolsOpened());
		if(mainWindow.webContents.isDevToolsOpened()) {
			mainWindow.webContents.closeDevTools();
		}else{
			mainWindow.webContents.openDevTools();
		}

	});
	//print pdf
	globalShortcut.register('CommandOrControl+P', () => {
		let targetDir = path.join(__dirname,'export','transaction-analysis.pdf');
		mainWindow.webContents.printToPDF({
			pageSize:'A3',
			marginsType:2
		}, (error, data) => {
			if (error) throw error;
			fs.writeFile(targetDir, data, (error) => {
				if (error) throw error;
				console.log('Write PDF successfully.');
				electron.dialog.showMessageBox(mainWindow,{message:'PDF writed to:'+targetDir});
			});
		});
	});
	//show or hide the guide
	globalShortcut.register('CommandOrControl+/', () => {
		if(!guideWindow) 
			createGuideWindow();
		else
			guideWindow.show();
	});

	if (!ret) {
		console.log('registration failed');
	}
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', function () {
	// On OS X it is common for applications and their menu bar
	// to stay active until the user quits explicitly with Cmd + Q
	if (process.platform !== 'darwin') {
		app.quit();
	}
});

app.on('activate', function () {
	// On OS X it's common to re-create a window in the app when the
	// dock icon is clicked and there are no other windows open.
	if (mainWindow === null) {
		createWindow();
	}
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
function createMenu () {
	const template = [
		{
			label: 'Edit',
			submenu: [
				{role: 'undo'},
				{role: 'redo'},
				{type: 'separator'},
				{role: 'cut'},
				{role: 'copy'},
				{role: 'paste'},
				{role: 'pasteandmatchstyle'},
				{role: 'delete'},
				{role: 'selectall'}
			]
		},
		{
			label: 'View',
			submenu: [
				{role: 'reload'},
				{role: 'forcereload'},
				{role: 'toggledevtools'},
				{type: 'separator'},
				{role: 'resetzoom'},
				{role: 'zoomin'},
				{role: 'zoomout'},
				{type: 'separator'},
				{role: 'togglefullscreen'}
			]
		},
		{
			role: 'window',
			submenu: [
				{role: 'minimize'},
				{role: 'close'}
			]
		},
		{
			role: 'help',
			submenu: [
				{
					label: 'Learn More',
					click () { require('electron').shell.openExternal('https://electron.atom.io'); }
				}
			]
		}
	];

	if (process.platform === 'darwin') {
		template.unshift({
			label: app.getName(),
			submenu: [
				{role: 'about'},
				{type: 'separator'},
				{role: 'services', submenu: []},
				{type: 'separator'},
				{role: 'hide'},
				{role: 'hideothers'},
				{role: 'unhide'},
				{type: 'separator'},
				{role: 'quit'}
			]
		});

		// Edit menu
		template[1].submenu.push(
			{type: 'separator'},
			{
				label: 'Speech',
				submenu: [
					{role: 'startspeaking'},
					{role: 'stopspeaking'}
				]
			}
		);

		// Window menu
		template[3].submenu = [
			{role: 'close'},
			{role: 'minimize'},
			{role: 'zoom'},
			{type: 'separator'},
			{role: 'front'}
		];
	}

	const menu = Menu.buildFromTemplate(template);
	Menu.setApplicationMenu(menu);
}
