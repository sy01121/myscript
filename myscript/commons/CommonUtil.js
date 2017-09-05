/**
 * Created by suny on 2017/8/24.
 * @author sunyue
 */

/*
*  SY 命名空间  namespace
* */
var SY = {};

/**
 *  Interface Class
 *  接口类 Class Interface ===> 实例化N多个接口
 *  接口类需要2个参数（接口名称、方法名（由于接口方法名数量不固定，类参数直接name,method1,method2...）参数个数就不固定，麻烦）
 *  解决：直接把接口方法名装进数组里一个参数就搞定
 *  参数1：接口的名字(string)
 *  参数2：接收方法名字的集合（数组）（array）
 * */
SY.Interface = function (name,methods) {
    // 判断接口的参数个数
    if (arguments.length !== 2){
        throw new Error('this instance interface constructor arguments must be 2 length!');
    }
    // 接口的名字一定是String类型，因此可以直接赋值
    this.name = name;
    // 接口方法名数组元素必须是String，但传入数组元素太多，参次不齐，需判断
    // this.methods = methods;
    this.methods = []; // 定义一个内置的空数组，等待接收methods里的元素（方法名字）
    for (var i=0,len=methods.length;i<len;i++){
        if (typeof methods[i] !== 'string'){
            throw new Error('the Interface method name is error!');
        }
        this.methods.push(methods[i]);
    }
};
/*
*   Interface static method
* */
// 三： 检验接口里的方法
// 如果检验通过 不做任何操作 不通过：浏览器抛出异常（error）
// 这个方法的目的：就是检测方法的
// 直接接口的构造函数Interface上设置静态方法
SY.Interface.ensureImplements = function (object) {
    // 如果检测方法接收的参数小于2，只有一个参数或没有（只传入实现类的实例对象或不传），没有接口可检验，参数传递失败！
    if(arguments.length < 2){
        throw new Error('Interface.ensureImplements method constructor arguments must be >=2!');
    }

    // 获取接口实例对象,索引位置为0，是实现类实例对象无用，直接跳过
    for (var i=1,len=arguments.length;i<len;i++){
        var instanceInterface = arguments[i];
        // 判断参数是不是接口类的类型(双重保险)
        if (instanceInterface.constructor !== SY.Interface){
            throw new Error('the arguments constructor not be Interface Class');
        }
        // 循环接口实例对象里的每一个方法
        for (var j=0;j<instanceInterface.methods.length;j++){
            // 用一个临时变量 接收每一个方法的名字（注意是字符串）
            var methodName = instanceInterface.methods[j];
            // 用js特有的object[key] 方法
            if (!object[methodName] || (typeof object[methodName] !== 'function')){
                throw new Error('the method name '+methodName+' is not found!');
            }
        }
    }
};

/*
*   模拟extjs底层继承方式
*   extend方法：继承1次父类的模板（构造函数）继承1次父类的原型对象
* */
SY.extend = function(sub,sup) {
    // 目的：实现只继承父类的原型对象
    var F = new Function(); // 1.创建一个空函数（类） 目的：空函数进行中转
    F.prototype = sup.prototype; // 2.实现空函数的原型对象和父类原型对象的转换
    // 目前F的地位与Person相同
    sub.prototype = new F(); // 3.原型继承（目前子类的构造器是F）
    sub.prototype.constructor = sub; // 4.还原子类构造器
    // 保存一下父类的原型对象：一方面方便解耦 另一方面方便获得父类的原型对象
    sub.superClass = sup.prototype; // 自定义一个子类的静态属性 接收父类的原型对象
    //判断父类原型对象的构造器
    if (sup.prototype.constructor == Object.prototype.constructor){
        sup.prototype.constructor = sup; // 手动改变父类原型对象的构造器
    }
};

/*
* 单体模式
* 实现一个跨浏览器的元素添加事件程序（一套方法：添加事件；移除事件）
* */
SY.EventUtil = {
    addHandler : function (element,type,handler) {
        if (element.addEventListener){   //FF
            // 事件有两种型式：冒泡型事件（IE） 捕获型事件（FF）
            // .addEventListener()第三个false含义：将 FF的 捕获型事件改为 IE的 冒泡型事件
            element.addEventListener(type,handler,false);
        }else if(element.attachEvent){   //IE
            element.attachEvent('on'+type,handler);
        }
    },
    removeHandler : function (element,type,handler) {
        if (element.removeEventListener){   //FF
            // 事件有两种型式：冒泡型事件（IE） 捕获型事件（FF）
            // .addEventListener()第三个false含义：将 FF的 捕获型事件改为 IE的 冒泡型事件
            element.removeEventListener(type,handler,false);
        }else if(element.detachEvent){   //IE
            element.detachEvent('on'+type,handler);
        }
    }
};

/*
* 扩展Array的原型对象 添加遍历数组的每一个元素  并让数组的每一个元素都执行fn函数（可遍历多维数组）
* */
// 利用到原型的作用：扩展对象中的属性和方法
Array.prototype.each = function (fn) {
    try{
        //1. 目的：遍历数组每一项，首先遍历到什么地方了，要有个计数器：记录当前遍历的元素位置
        // var i = 0; // 可以，但耦合性高，后面所有操作代码再用变量i容易冲突
        // 给this添加个属性
        this.i || (this.i = 0);
        //2. 严谨的判断什么时候走each核心方法
        // 当数组的长度大于0的时候 && 传递的参数必须为函数
        if(this.length > 0 && fn.constructor == Function){
            //3.开始遍历数组的每一项（采用循环 for 或者 while）
            //for(i in this){} // 遍历数组的特殊方法，this维数太多，多维i值相同，会报错
            while(this.i < this.length){  // while循环的范围
                //核心代码（稍等写）
                // 获得数组每一项的值
                var e = this[this.i];
                // 如果当前元素获取到了 && 当前元素是一个数组
                if (e && e.constructor == Array){
                    // 直接做递归操作
                    e.each(fn);
                }else {
                    //如果不是数组（那就是一个单个元素）直接执行传入函数即可
                    //fn(e); // 可以，不太好
                    //用apply或者call
                    //fn.apply(null,[e]); // fn就在当前环境执行就行，环境参数可以为空
                    //var obj = true;
                    //fn.apply(obj,[e]); // 也可以 但是新建的obj变量，占用内存，不合理
                    // e存在，值为true，可直接用，不用声明新变量
                    //fn.apply(e,[e]);
                    fn.call(e,e); //这目的就是为了把数组的当前元素传递给fn 并让函数执行
                }

                this.i++;
            }
            this.i = null; // 释放内存，垃圾回收机制回收变量
        }

    } catch(ex){
        // do something
        alert(ex);
    }
    // this指调用的数组，方法结果返回原数组，不改变数组值
    return this;
};