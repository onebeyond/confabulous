# Change Log

## [2.0.0]
### Breaking Changes
- Updated decrypt processor to use [crypto.createCipheriv](https://nodejs.org/api/crypto.html#crypto_crypto_createcipheriv_algorithm_key_iv_options). Rather than suppying an algorithm and password, now an algorithm, key and initialization vector iare required.
### Updated
- Update dependencies
- Remove lodash.noop dependency
- Replace mocha with zUnit
- Replace lodash.set, lodash.has with dot-prop
- Replace imperative with esnext style
- Replace chai with node assert
- Update husky
- Replace travis with github actions
- Replace merge with ramda.mergeDeepRight due to [issue 41](https://github.com/yeikos/js.merge/issues/41)

## [1.7.0]
### Updated
- Update dependencies

## [1.6.0]
### Updated
- Update dependencies

## [1.5.5]
### Updated
- Updated dependencies

## [1.5.4]
### Updated
- Updated dependencies
- Fixed node deprecation warnings in tests

## [1.5.3]
### Updated
- Improved readme

## [1.5.2]
### Updated
- Improved readme

## [1.5.1]
### Updated
- Improved readme

## [1.5.0]
### Added
- Support for custom merges

### Updated
- Dependencies

## [1.4.0]
### Added
- Codeclimate automation on push
### Changed
- Upgraded dev dependencies

## [1.3.0]
### Changed
- Updated dev dependencies

## [1.2.0]
### Added
- envToCamelCaseProps processor

## [1.1.3]
### Changed
- Updated package.json description

## [1.1.2]
### [Changed]
- Updated package.json keywords

## [1.1.1]
### [Added]
- Increasing test coverage
- This changelog

The format is based on [Keep a Changelog](http://keepachangelog.com/)
