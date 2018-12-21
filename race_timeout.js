/*
设置执行超时功能
注意，超时时间参数msecs是毫秒，不能小于1000毫秒。

Setting up execution timeout function
Note that the time-out parameter MSECS is milliseconds and should not be less than 1000 milliseconds.
*/
let Promise = require('bluebird')
var moment = require('moment')

function timeout(msecs, timeout_control, returnvalue_when_timeout, tag) {
    let begTick = moment();
    var begTick_msecs = begTick.valueOf();

    return new Promise(function(resolve, reject) {
        var st_func = function() {
            //如果操作取消，那么清理后退出
            if (timeout_control && timeout_control.if_stop()) {
                //不能马上返回，要给正常操作的返回留出时间
                setTimeout(function() {
                    console.log((tag != null? tag + ' ':'') + 'operation was finished, timeout was canceled.')
                    resolve({'flag': returnvalue_when_timeout, 'msg':'操作完成，超时监控已取消', 'emsg': 'operation was finished, timeout was canceled.'})
                }, 200)
            }
            else {
                //首先判断时间是否足够，不然执行下一次定时
                let nowTick = moment();
                let nowTick_msecs = nowTick.valueOf();
                let passed = nowTick_msecs - begTick_msecs
                if (passed < (msecs - 1000)) {
                    setTimeout(st_func, 1000)
                }
                else if (passed < msecs) {
                    setTimeout(st_func, msecs - passed)
                }
                else {        
                    if (timeout_control) timeout_control.set_stop()
                    //时间已足够，超时返回
                    resolve({'flag': ERRORS_DEF.ERR_TIMEOUT, 'msg':'操作超时', 'emsg': 'timeout'})
                }
            }
        }
        setTimeout(st_func, 1000)
    })
}
/// work可以是一个Promise，也可以是一个Promise数组
/// msecs是超时的毫秒数
/// work can be either a Promise or an array of Promises
/// msecs is the number of milliseconds that are timed out
/// tag是一个附加参数，用做区分不同的timeout，可以不传
/// tag is an additional parameter used to distinguish different timeouts, which can not be passed
module.exports = function(work, msecs, timeout_control, tag) {  
    try {
        if (work == null) {
            return Promise.reject(new Error('参数错误，不能为null'))
        }
        let all = []
        if (Object.prototype.toString.call(work)=='[object Array]') {
            all = all.concat(work)
        }
        else {
            all.push(work)
        }
        if (msecs == '' || msecs == null) {
            all.push(timeout(120000, timeout_control, 10000, tag))
        }
        else {
            nmsecs = parseInt(msecs)
            if (nmsecs < 1000) {
                nmsecs = 1000
            }
            all.push(timeout(nmsecs, timeout_control, 10000, tag))
        }
        return Promise.race(all)
    }
    catch(err) {
        return Promise.reject(err)
    }
}
