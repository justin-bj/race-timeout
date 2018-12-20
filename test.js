var Promise = require('bluebird')
let race_timeout = require('./race_timeout')
var TimeoutControl = require('./timeout_control')

async function test_func(timeout_control) {
    try {
        if (timeout_control && timeout_control.if_stop()) {
            console.log('timeout, give up')
            return
        }
        console.log('test 1')
        if (timeout_control && timeout_control.if_stop()) {
            console.log('timeout, give up')
            return
        }
        console.log('test 2')
        return { 'flag': 0, 'msg': 'test finished' }
    }
    catch (err) {
        return Promise.reject(err)
    }
    finally
    {
        if (timeout_control) timeout_control.set_stop()
    }
}

function test() {
    var timeout_control = new TimeoutControl()

    race_timeout(test_func(timeout_control), 120000, timeout_control)
        .then(function (json) {
            console.log(json)
        })
        .catch(function (err) {
            console.log(err)
        })
        .finally(()=>{
            console.log('completed')
        })
}
