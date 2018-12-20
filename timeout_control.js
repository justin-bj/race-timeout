/**
 * Author: ZhengYong, 103304010@qq.com
 * 20181120
 *  用做超时控制
 * Used as timeout control
 */

module.exports = function() {
    var m_if_stop = false
    this.if_stop = function() {
        return m_if_stop
    }
    this.set_stop = function () {
        m_if_stop = true
    }
}