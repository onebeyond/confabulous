# Change Log

## Unreleased

- Fixed a few typos in the changelog

## [2.1.1](https://github.com/onebeyond/confabulous/compare/confabulous-v2.1.0...confabulous-v2.1.1) (2024-07-01)


### 🐛 Bug Fixes

* added missing flags to NPM publication CI script ([e76c12c](https://github.com/onebeyond/confabulous/commit/e76c12c932fe997c5d5ccea9c7793cd518289404))
* coverage test ([2cc4a0b](https://github.com/onebeyond/confabulous/commit/2cc4a0b0b72b312674230f3b80d665983fb539d0))
* typo in pre-commit hook ([c059b9e](https://github.com/onebeyond/confabulous/commit/c059b9e99e520d1efe99f51ab9b06cfbedad3c6c))


### 🔧 Others

* add .nvmrc file with node 14 ([ff48224](https://github.com/onebeyond/confabulous/commit/ff48224779dcf2865ae74aaba92bc29e0536af94))
* bump to 2.0.2 ([034a64e](https://github.com/onebeyond/confabulous/commit/034a64e8f0c05f16214209fb37b4e028374f9e26))
* extended license ([4885ca2](https://github.com/onebeyond/confabulous/commit/4885ca2aea8bb3c637c57363a006897f89785dbc))
* recover package-lock.json ([35b9123](https://github.com/onebeyond/confabulous/commit/35b9123ee2e55c9735a28724584f17e3ab6397be))
* recover package-lock.json ([f3689dc](https://github.com/onebeyond/confabulous/commit/f3689dce1ca7d1e06a746a4b84fbbdecad2b4faa))
* regenerate package-lock with node 14 and npm 6 ([2b584c3](https://github.com/onebeyond/confabulous/commit/2b584c319e844e6783fc773bb65becc95251d130))
* remove obsolete release gh action ([2b30418](https://github.com/onebeyond/confabulous/commit/2b3041805af61c42f005a99ee2e9d9fe99793acd))
* remove package-lock-json ([039a1c4](https://github.com/onebeyond/confabulous/commit/039a1c4ef578ee0a85660ee93542239955780b1d))
* rename ci workflow ([756f8c7](https://github.com/onebeyond/confabulous/commit/756f8c7e6e1faba6137ffea674b52492d85cf615))
* temporally remove code-climate coverage ([4f52ef6](https://github.com/onebeyond/confabulous/commit/4f52ef6b0227f96caf037525c00fc8a914931b54))
* try to make it work with npm 7 ([7512788](https://github.com/onebeyond/confabulous/commit/751278845f9b3bc3b099d0c24530505569519a65))


### 📝 Docs

* improve readme file ([358c692](https://github.com/onebeyond/confabulous/commit/358c692ef629337bdf3b5d1c318cecde3376aa2a))
* update license reference to MIT ([f08d43d](https://github.com/onebeyond/confabulous/commit/f08d43d89ee3d84cb5e4c5a6a7f309593e912665))
* updated license file to MIT ([4e3e4f4](https://github.com/onebeyond/confabulous/commit/4e3e4f4b7e4cd5b6f5de10dce19a336b30b717c1))


### 🔄 Code Refactoring

* remove require-all and do the imports explicitly ([416790f](https://github.com/onebeyond/confabulous/commit/416790f170c13c4fd45fdf5765aa41c1a2cd1748))


### ☁️ CI

* add .npmrc file configuration ([d039537](https://github.com/onebeyond/confabulous/commit/d039537bba1f3bde3026110d4c5b4d952b398c14))
* add g action for code climate test coverage ([b869fc0](https://github.com/onebeyond/confabulous/commit/b869fc08e88a2c161c640c7873d84b45c9dddf75))
* add g action for pull request validation ([d0d1921](https://github.com/onebeyond/confabulous/commit/d0d1921d8761e51e729d7653c50dd89f660c9af7))
* add g action for scorecard ([4926bbd](https://github.com/onebeyond/confabulous/commit/4926bbd913bc787792dd16c06d995ddd28b068f6))
* add gh action to automate release process ([47ed962](https://github.com/onebeyond/confabulous/commit/47ed962dac4a4dd0f58d122f42f728a9622bb2ac))
* improve github actions ([f69cba7](https://github.com/onebeyond/confabulous/commit/f69cba7db7775b3dca19a05f386e3d2acffb5f20))
* modify coverage command ([918330f](https://github.com/onebeyond/confabulous/commit/918330f1803a629d031d3adddc3ff73ba576d415))
* remove test coverage gh action ([6ac5863](https://github.com/onebeyond/confabulous/commit/6ac5863a202484f9020e27e7f21bf53c36ecb25d))

## 2.1.0

### Added

- confabulous.close - See readme for details

### Updated

- Update dev dependencies
- Move to prettier

## 2.0.3

### Updated

- Update dev depenencies

## 2.0.2

### Updated

- Fix build

## 2.0.1

### Updated

- Update zUnit
- Use new npm token

## 2.0.0

### Breaking Changes

- Updated decrypt processor to use crypto.createCipheriv](https://nodejs.org/api/crypto.html#crypto_crypto_createcipheriv_algorithm_key_iv_options).Rather than suppying an algorithm and password, now an algorithm, key and initialization vector are required.

### Updated

- Update dependencies
- Remove lodash.noop dependency
- Replace mocha with zUnit
- Replace lodash.set, lodash.has with dot-prop
- Replace imperative with esnext style
- Replace chai with node assert
- Update husky
- Replace travis with github actions
- Replace merge with ramda.mergeDeepRight due to issue 41](https://github.com/yeikos/js.merge/issues/41

## 1.7.0

### Updated

- Update dependencies

## 1.6.0

### Updated

- Update dependencies

## 1.5.5

### Updated

- Updated dependencies

## 1.5.4

### Updated

- Updated dependencies
- Fixed node deprecation warnings in tests

## 1.5.3

### Updated

- Improved readme

## 1.5.2

### Updated

- Improved readme

## 1.5.1

### Updated

- Improved readme

## 1.5.0

### Added

- Support for custom merges

### Updated

- Dependencies

## 1.4.0

### Added

- Codeclimate automation on push

### Updated

- Upgraded dev dependencies

## 1.3.0

### Updated

- Updated dev dependencies

## 1.2.0

### Added

- envToCamelCaseProps processor

## 1.1.3

### Updated

- Updated package.json description

## 1.1.2

### Updated

- Updated package.json keywords

## 1.1.1

### Added

- Increasing test coverage
- This changelog

The format is based on Keep a Changelog](http://keepachangelog.com/)
