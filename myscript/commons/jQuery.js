/**
 * Created by suny on 2017/8/23.
 */
// 模拟jQuery底层链式编程
// 块级作用域
/*
 (function () {
 // 特点1：程序启动的时候，里面的代码直接执行了
 alert('我执行了！');  // 我执行了！
 // 特点2：内部的成员变量 外部无法访问（除了不加var修饰的变量）
 var a = 10;
 b = 20;
 })();
 alert(b);  // 20
 alert(a);  // a is not defined
 */
// 模拟jQuery底层代码
(function (window,undefined) {
    // $ 最常用的对象 返回给外界 大型程序开发 一般使用“_”作为私有对象（规范）
    function _$(argument) {
        // 实现代码...
        // 正则表达式匹配id选择器
        var idselector = /#\w+/;
        // 此属性 接收所得到的元素
        this.dom;
        // 如果匹配成功，则接收dom元素 否则抛出异常 arguments[0] = '#inp' arguments接收传进来的实参
        // alert(arguments[0]);
        if(idselector.test(arguments[0])){
            this.dom = document.getElementById(arguments[0].substring(1));
        }else {
            throw new Error('arguments is error!');
        }
    }

    // 在Function类上扩展一个可以实现链式编程的方法
    Function.prototype.method = function (methodName,fn) {
        this.prototype[methodName] = fn;
        return this; // 链式编程的关键
    };

    // 在_$类的原型对象上 加一些公共的方法
    _$.prototype = {
        constructor: _$,
        addEvent: function (type,fn) {
            // 给你得到的元素 注册时间
            if (window.addEventListener){ // FF
                this.dom.addEventListener(type,fn);
            }else if (window.attachEvent){ // IE
                this.dom.attachEvent('on'+type,fn);
            }
            //alert('addEvent');
            return this;
        },
        setStyle: function (prop,val) {
            //alert('setStyle');
            this.dom.style[prop] = val;
            return this;
        }
    };

    // window 上先注册一个全局变量 与外界产生关系
    window.$ = _$;
    // 写一个准备的方法
    _$.onReady = function (fn) {
        // 1 _$是一个类直接赋值不妥，实例化出来_$对象，真正注册到window上
        window.$ = function (argument) {
            return new _$(argument);
        };
        // 2 执行传进来的函数
        fn();
        // 3 实现链式编程
        // 链式编程实现的模式
        _$.method('addEvent',function () {

        }).method('setStyle',function () {

        })
    }
})(window); // 程序的入口 window传入作用域