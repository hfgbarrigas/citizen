const globby = require('globby');
const tar = require('tar');
const semver = require('semver');

// The module must adhere to the requirements of terraform module.
// ref: https://www.terraform.io/docs/registry/modules/publish.html?#requirements

// The namespace follows username rule of github
// only contain alphanumeric characters or single hyphens, and cannot begin or end with a hyphen
const namespaceRule = /^[a-zA-Z0-9]+-?[a-zA-Z0-9]+$/;
const isValidNamespace = namespace => namespaceRule.test(namespace);

// The name must be terraform-PROVIDER-NAME.
const nameRule = /^terraform-([a-zA-Z0-9]+)-([a-zA-Z0-9]+)$/;
const isValidName = name => nameRule.test(name);

// The version must be semantic version.
const isValidVersion = version => semver.valid(version);

const makeFileList = async (target = __dirname) => {
  const filelist = await globby(['**'], {
    cwd: target,
    gitignore: true,
  });
  return filelist;
};

const makeTarball = (target = __dirname, filelist = [], writableDest) =>
  tar.create(
    {
      cwd: target,
      gzip: true,
    },
    filelist,
  ).pipe(writableDest);

module.exports = {
  isValidNamespace,
  nameRule,
  isValidName,
  isValidVersion,
  makeFileList,
  makeTarball,
};