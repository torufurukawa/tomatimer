import { app, Tray, nativeImage, Menu } from 'electron'
import serve from 'electron-serve'
import { createWindow } from './helpers'

const isProd = process.env.NODE_ENV === 'production'
const iconUrl = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAhGVYSWZNTQAqAAAACAAFARIAAwAAAAEAAQAAARoABQAAAAEAAABKARsABQAAAAEAAABSASgAAwAAAAEAAgAAh2kABAAAAAEAAABaAAAAAAAAAGAAAAABAAAAYAAAAAEAA6ABAAMAAAABAAEAAKACAAQAAAABAAAAGKADAAQAAAABAAAAGAAAAAD+UvRpAAAACXBIWXMAAA7EAAAOxAGVKw4bAAACZmlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iWE1QIENvcmUgNS40LjAiPgogICA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPgogICAgICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIgogICAgICAgICAgICB4bWxuczp0aWZmPSJodHRwOi8vbnMuYWRvYmUuY29tL3RpZmYvMS4wLyIKICAgICAgICAgICAgeG1sbnM6ZXhpZj0iaHR0cDovL25zLmFkb2JlLmNvbS9leGlmLzEuMC8iPgogICAgICAgICA8dGlmZjpPcmllbnRhdGlvbj4xPC90aWZmOk9yaWVudGF0aW9uPgogICAgICAgICA8dGlmZjpSZXNvbHV0aW9uVW5pdD4yPC90aWZmOlJlc29sdXRpb25Vbml0PgogICAgICAgICA8ZXhpZjpDb2xvclNwYWNlPjE8L2V4aWY6Q29sb3JTcGFjZT4KICAgICAgICAgPGV4aWY6UGl4ZWxYRGltZW5zaW9uPjI0PC9leGlmOlBpeGVsWERpbWVuc2lvbj4KICAgICAgICAgPGV4aWY6UGl4ZWxZRGltZW5zaW9uPjI0PC9leGlmOlBpeGVsWURpbWVuc2lvbj4KICAgICAgPC9yZGY6RGVzY3JpcHRpb24+CiAgIDwvcmRmOlJERj4KPC94OnhtcG1ldGE+CmssjRYAAAG6SURBVEgNY2AYBYM+BK5e/c+G5kgDIL8MTYwibgpQ90Qgzvn//z8PkN4Pom+feMsHMhXIRncASJgwMDW1UQKq6pUSkTIC0s1AfBSIrwPxXSC+D8T/gfg5EOtYGFgoAGmSQAhQ9VcgBhkyFYijgPgjFD8F0t+B+HxlcYMWkN4KxD+BOAeICQN3dz8VoCqQASCDYoA4CYh/AzHI1SCffBcXEfcD0o+B+GpGXK4ZkN4NxH+B2AGICYJ+oAqQy7/6eYV6HN9/XaG6sMHs1f3/Ejoa+j4guYndc3SyUvOsdqzarxLiG+4GUgvVsx5IEwQXgSpAFsDwQyAbJPazKK/cCkgfvHrkrhyQBrkYpgZGg3xNEIDCGqYBnT4KTDViMZHJHjjUgHxCEMC8i244jP8eaMJrIIbxkem36KYzoQsA+W+wiCELCQA5IsgCSOx7SGwwE5sFB9AVkcA/QoxaC6AiZG8TzVZQUAUVI0SB+UBVRBsMVbuQKJNBioAphQtI7QcxicSnb9+GlE1A9cQBoCUcQJWTgRhbeke2eDHJhiM7Idg3WAPI7wXi80AMSoYgDMp4k7m4uEAF4SgY5CEAAKRtwD6mIi8qAAAAAElFTkSuQmCC'
let tray = null

if (isProd) {
  serve({ directory: 'app' });
} else {
  app.setPath('userData', `${app.getPath('userData')} (development)`);
}

(async () => {
  await app.whenReady();

  const mainWindow = createWindow('main', {
    width: 320,
    height: 320,
    webPreferences: {
      additionalArguments: ['--env=' + process.env.NODE_ENV]
    }
  });

  if (isProd) {
    await mainWindow.loadURL('app://./home.html');
  } else {
    const port = process.argv[2];
    await mainWindow.loadURL(`http://localhost:${port}/home`);
    mainWindow.webContents.openDevTools();
  }

  tray = new Tray(nativeImage.createFromDataURL(iconUrl))
  tray.on('click', () => { mainWindow.show() })
})();

app.on('window-all-closed', () => {
  app.quit();
});

global.setTrayTitle = function (title) {
  tray.setTitle(title)
}
