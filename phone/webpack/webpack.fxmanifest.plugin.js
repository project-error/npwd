const path = require("path");

const defaultOptions = {
  itemsFromCompilation: (compilation) => Object.keys(compilation.assets),
  output: "phonemanifest.lua",
};

const makeDefault = (object, ...sources) => {
  object = Object(object);
  sources.forEach((source) => {
    if (source != null) {
      source = Object(source);
      for (const key in source) {
        const value = object[key];
        if (
          value === undefined ||
          (eq(value, objectProto[key]) && !hasOwnProperty.call(object, key))
        ) {
          object[key] = source[key];
        }
      }
    }
  });
  return object;
};

function ResourceManifestPlugin(options) {
  makeDefault(this, options, defaultOptions);
}

const pluginName = "fivem-manifest-plugin";

ResourceManifestPlugin.prototype.apply = function (compiler) {
  const { itemsFromCompilation, output } = this;
  compiler.hooks.emit.tap(pluginName, (compilation) => {
    const assets = itemsFromCompilation(compilation);
    const result = format(
      assets,
      compilation.options.output.path.split("\\").pop()
    );
    compilation.assets[output] = {
      source: () => Buffer.from(result),
      size: () => Buffer.byteLength(result),
    };
  });
};

function format(assets, path) {
  return `
ui_page "${path}/index.html"
files{${assets.map((asset) => `"${path}/${asset}"`).join(",")}}
  `;
}

module.exports = ResourceManifestPlugin;
