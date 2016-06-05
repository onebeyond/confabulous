var assert = require('chai').assert
var http = require('../../lib/loaders/http')
var express = require('express')
var EventEmitter = require('events').EventEmitter

describe('http', function() {

    var app
    var server
    var confabulous

    beforeEach(function() {
        app = express()
        confabulous = new EventEmitter()
    })

    afterEach(function(done) {
        confabulous.emit('reloading')
        confabulous.removeAllListeners()
        try {
            server.close()
            done()
        } catch (err) {
            done()
        }
    })

    it('should require url when mandatory', function(done) {
        http()(confabulous, function(err, config) {
            assert(err)
            assert.equal(err.message, 'url is required')
            done()
        })
    })

    it('should load configuration', function(done) {

        app.get('/config', function(req, res) {
            res.json({ loaded: 'loaded' })
        })

        server = app.listen(3000, function() {
            http({ url: 'http://localhost:3000/config' })(confabulous, function(err, config) {
                assert.ifError(err)
                assert.equal(config.loaded, 'loaded')
                done()
            })
        })
    })

    it('should timeout', function(done) {

        app.get('/config', function(req, res) {
            setTimeout(function() {
                res.json({ loaded: 'loaded' })
            }, 300)
        })

        server = app.listen(3000, function() {
            http({ url: 'http://localhost:3000/config', request: { timeout: 100 } })(confabulous, function(err, config) {
                assert(err)
                assert.equal(err.message, 'ETIMEDOUT')
                done()
            })
        })
    })

    it('should report errors', function(done) {
        http({ url: 'http://localhost:9999/config' })(confabulous, function(err, config) {
            assert(err)
            assert.ok(/connect ECONNREFUSED/.test(err.message))
            done()
        })
    })

    it('should report unexpected status codes', function(done) {
        app.get('/config', function(req, res) {
            res.status(400).send({ message: 'Bad Request' })
        })

        server = app.listen(3000, function() {
            http({ url: 'http://localhost:3000/config' })(confabulous, function(err, config) {
                assert(err)
                assert.equal(err.message, 'http://localhost:3000/config returned 400')
                done()
            })
        })
    })

    it('should report 404s when mandatory', function(done) {

        app.get('/config', function(req, res) {
            res.status(404).send({ message: 'Not Found' })
        })

        server = app.listen(3000, function() {
            http({ url: 'http://localhost:3000/config' })(confabulous, function(err, config) {
                assert(err)
                assert.equal(err.message, 'http://localhost:3000/config returned 404')
                done()
            })
        })
    })

    it('should ignore 404s when not mandatory', function(done) {
        app.get('/config', function(req, res) {
            res.status(404).send({ message: 'Not Found' })
        })

        server = app.listen(3000, function() {
            http({ url: 'http://localhost:3000/config', mandatory: false })(confabulous, function(err, config) {
                assert.equal(err, true)
                done()
            })
        })
    })

    it('should emit change event when etag changes', function(done) {

        app.head('/config', function(req, res) {
            res.setHeader('ETag', 'bar')
            res.status(200).end()
        })

        app.get('/config', function(req, res) {
            res.setHeader('ETag', 'foo')
            res.json({ loaded: 'loaded' })
        })

        server = app.listen(3000, function() {
            http({ url: 'http://localhost:3000/config', watch: { interval: '100ms' } })(confabulous, function(err, config) {
                assert.ifError(err)
                assert.equal(config.loaded, 'loaded')
            }).on('change', done)
        })
    })


    it('should emit change event when last-modified changes', function(done) {

        app.head('/config', function(req, res) {
            res.setHeader('ETag', 'fixed')
            res.setHeader('Last-Modified', new Date())
            res.status(200).end()
        })

        app.get('/config', function(req, res) {
            res.setHeader('ETag', 'fixed')
            res.setHeader('Last-Modified', new Date())
            res.json({ loaded: 'loaded' })
        })

        server = app.listen(3000, function() {
            http({ url: 'http://localhost:3000/config', watch: { interval: '100ms' } })(confabulous, function(err, config) {
                assert.ifError(err)
                assert.equal(config.loaded, 'loaded')
            }).on('change', done)
        })
    })

    it('should emit change event when a previously existing page starting returning 404', function(done) {

        app.head('/config', function(req, res) {
            res.status(404).end()
        })

        app.get('/config', function(req, res) {
            res.json({ loaded: 'loaded' })
        })

        server = app.listen(3000, function() {
            http({ url: 'http://localhost:3000/config', mandatory: false, watch: { interval: '100ms' } })(confabulous, function(err, config) {
                assert.ifError(err)
                assert.equal(config.loaded, 'loaded')
            }).on('change', done)
        })
    })

    it('should emit change event when a previously missing page starts returning 200', function(done) {

        app.head('/config', function(req, res) {
            res.status(200).end()
        })

        app.get('/config', function(req, res) {
            res.status(404).json({ message: 'Not Found' })
        })

        server = app.listen(3000, function() {
            http({ url: 'http://localhost:3000/config', mandatory: false, watch: { interval: '100ms' } })(confabulous, function(err, config) {
                assert.equal(err, true)
            }).on('change', done)
        })
    })

    it('should not emit change events when content does not change', function(done) {

        var date = new Date()

        app.head('/config', function(req, res) {
            res.setHeader('ETag', 'fixed')
            res.setHeader('Last-Modified', date)
        })

        app.get('/config', function(req, res) {
            res.setHeader('ETag', 'fixed')
            res.setHeader('Last-Modified', date)
            res.json({ loaded: 'loaded' })
        })

        server = app.listen(3000, function() {
            http({ url: 'http://localhost:3000/config', mandatory: false, watch: { interval: '100ms' } })(confabulous, function(err, config) {
                assert.ifError(err)
                assert.equal(config.loaded, 'loaded')
                setTimeout(done, 500)
            }).on('change', function() {
                assert(false, 'Change event emitted')
            })
        })
    })

    it('should not emit change events for 304s', function(done) {

        app.head('/config', function(req, res) {
            res.status(304).end()
        })

        app.get('/config', function(req, res) {
            res.json({ loaded: 'loaded' })
        })

        server = app.listen(3000, function() {
            http({ url: 'http://localhost:3000/config', mandatory: false, watch: { interval: '100ms' } })(confabulous, function(err, config) {
                assert.ifError(err)
                assert.equal(config.loaded, 'loaded')
                setTimeout(done, 500)
            }).on('change', function() {
                assert(false, 'Change event emitted')
            })
        })

    })

    it('should emit error events while watching', function(done) {

        app.head('/config', function(req, res) {
            setTimeout(function() {
                res.json({ loaded: 'loaded' })
            }, 300)
        })

        app.get('/config', function(req, res) {
            res.json({ loaded: 'loaded' })
        })

        server = app.listen(3000, function() {
            http({ url: 'http://localhost:3000/config', mandatory: false, watch: { interval: '100ms' }, request: { timeout: 100 } })(confabulous, function(err, config) {
                assert.ifError(err)
                assert.equal(config.loaded, 'loaded')
            }).on('error', function(err) {
                confabulous.emit('reloading')
                assert(err)
                assert.equal(err.message, 'ETIMEDOUT')
                done()
            })
        })
    })

    it('should post-process', function(done) {

        app.get('/config', function(req, res) {
            res.json({ loaded: 'loaded' })
        })

        server = app.listen(3000, function() {
            http({ url: 'http://localhost:3000/config' }, [
                function(config, cb) {
                    config.loaded = config.loaded.toUpperCase()
                    cb(null, config)
                }
            ])(confabulous, function(err, config) {
                assert.ifError(err)
                assert.equal(config.loaded, 'LOADED')
                done()
            })
        })
    })
})