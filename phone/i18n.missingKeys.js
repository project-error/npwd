const args = process.argv.slice(2);

console.log(args);

const path = './src/locale/';

const langs = ['bs', 'no', 'es', 'fr', 'pt', 'ptbr', 'sv', 'tr', "hu", 'ru'];

const defaultLang = 'en';

const langFiles = [];

let defaultLangFile;

const missingKeys = {};

const promises = langs
  .filter((l) => (args[0] ? args[0] === l : true))
  .map((l) => {
    return new Promise((res, rej) => {
      import(path + l + '.json')
        .then((module) => {
          langFiles.push(module.default.translation);
          res();
        })
        .catch((e) => {
          console.error(e);
          rej(e);
        });
    });
  });

const Load = () => Promise.all(promises);

const LoadDefault = () =>
  new Promise((res, rej) => {
    import(path + defaultLang + '.json')
      .then((module) => {
        defaultLangFile = module.default.translation;
        res();
      })
      .catch((e) => {
        console.error(e);
        rej(e);
      });
  });

(async () => {
  const filteredLangs = langs.filter((l) => (args[0] ? args[0] === l : true));

  await LoadDefault();
  await Load();
  let idx = 0;
  for (const file of langFiles) {
    const currLang = filteredLangs[idx];
    if (currLang === defaultLang) {
      return;
    }
    idx++;
    if (args[0] && args[0] !== currLang) {
      return;
    }
    missingKeys[currLang] = [];
    for (const dKey in defaultLangFile) {
      let exists = false;
      for (const key in file) {
        if (key === dKey) {
          exists = true;
        }
      }
      if (!exists) {
        missingKeys[currLang].push([dKey, defaultLangFile[dKey]]);
      }
    }
  }
  console.log(missingKeys);
})();
