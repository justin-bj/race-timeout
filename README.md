# race-timeout
In nodejs environment, a controllable function execution is realized. 
Controllable means adding a timeout control and interrupting the function execution after the timeout. 
If the function is completed before the timeout, the result of the function execution is returned 
and the timeout monitoring is terminated.
Note that it can not be used for very short time timeout control, at least 1 second, preferably from 1 minute.

在nodejs环境下，实现了一个可控的功能执行。
可控意味着要添加一个超时控制，在超时之后中断函数执行。
如果在超时之前完成了该函数，则返回函数执行的结果并终止超时监视。
注意，不能用于特别短时间的超时控制，至少要1秒，最好是1分钟起。
