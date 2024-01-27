const fs = require('fs');
const path = require('path');

const currentResourceName = GetCurrentResourceName();

// I hate that this file is necessary :(

// This isn't included in release builds or in build process
// as its only purpose is to detect whether we live in the non-built
// source code.

on('onResourceStart', async (resName) => {
  if (resName !== currentResourceName && process.env.NODE_ENV !== 'development') return;

  const currentResourcePath = GetResourcePath(currentResourceName);
  const targetBuildPath = path.join(currentResourcePath, 'dist', 'game');

  try {
    await fs.promises.access(targetBuildPath);
  } catch {
    console.log(
      '^1==============================================\n\n' +
      '!!! NPWD WAS UNABLE TO LOCATE BUILT FILES AND WAS UNABLE TO START !!!\n\n' +
      'This error is most likely caused by downloading the source code instead of the release\n\n' +
      'Find the latest NPWD release here: \n\n' +
      'https://github.com/project-error/npwd/releases/latest/download/npwd.zip\n\n' +
      '==============================================^0',
    );
  }
});
