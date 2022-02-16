// lazy way of bumping our fxmanifest version on tag push
// could be done better but meh this works
const fs = require('fs');

const newVersion = process.env.TGT_RELEASE_VERSION

const manifestFileContents = fs.readFileSync('fxmanifest.lua', {
  encoding: 'utf8'
});

const newFileContent = manifestFileContents.replace(
  /\bversion\s+(.*)$/gm,
  `version '${newVersion}'`,
);

fs.writeFileSync('fxmanifest.lua', newFileContent);
