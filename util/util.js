/**
 *  lin
 *  此文件下主要为常用的工具函数
 */

/**
 *  金钱格式化，三位加逗号
 *  @param { number } num
 */
export const formatMoney = num => num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");


/**
 *  截取字符串并加身略号
 */
export function subText(str, length) {
    if (str.length === 0) {
        return '';
    }
    if (str.length > length) {
        return str.substr(0, length) + "...";
    } else {
        return str;
    }
}


/**
 * 获取文件base64编码
 * @param file
 * @param format  指定文件格式
 * @param size  指定文件大小(字节)
 * @param formatMsg 格式错误提示
 * @param sizeMsg   大小超出限制提示
 * @returns {Promise<any>}
 */
export function fileToBase64String(file, format = ['jpg', 'jpeg', 'png', 'gif'], size = 20 * 1024 * 1024, formatMsg = '文件格式不正确', sizeMsg = '文件大小超出限制') {
    return new Promise((resolve, reject) => {
        // 格式过滤
        let suffix = file.type.split('/')[1].toLowerCase();
        let inFormat = false;
        for (let i = 0; i < format.length; i++) {
            if (suffix == format[i]) {
                inFormat = true;
                break;
            }
        }
        if (!inFormat) {
            reject(formatMsg);
        }
        // 大小过滤
        if (file.size > size) {
            reject(sizeMsg);
        }
        // 转base64字符串
        let fileReader = new FileReader();
        fileReader.readAsDataURL(file);
        fileReader.onload = () => {
            let res = fileReader.result;
            resolve({base64String: res, suffix: suffix});
            reject('异常文件，请重新选择');
        }
    })
}


/**
 * 递归生成树形结构
 */
export function getTreeData(data, pid, pidName = 'parentId', idName = 'id', childrenName = 'children', key) {
    let arr = [];

    for (let i = 0; i < data.length; i++) {
        if (data[i][pidName] == pid) {
            data[i].key = data[i][idName];
            data[i][childrenName] = getTreeData(data, data[i][idName], pidName, idName, childrenName);
            arr.push(data[i]);
        }
    }

    return arr;
}


/**
 * 遍历树节点
 */
export function foreachTree(data, childrenName = 'children', callback) {
    for (let i = 0; i < data.length; i++) {
        callback(data[i]);
        if (data[i][childrenName] && data[i][childrenName].length > 0) {
            foreachTree(data[i][childrenName], childrenName, callback);
        }
    }
}


/**
 * 追溯父节点
 */
export function traceParentNode(pid, data, rootPid, pidName = 'parentId', idName = 'id', childrenName = 'children') {
    let arr = [];
    foreachTree(data, childrenName, (node) => {
        if (node[idName] == pid) {
            arr.push(node);
            if (node[pidName] != rootPid) {
                arr = arr.concat(traceParentNode(node[pidName], data, rootPid, pidName, idName));
            }
        }
    });
    return arr; 
}


/**
 * 寻找所有子节点
 */
export function traceChildNode(id, data, pidName = 'parentId', idName = 'id', childrenName = 'children') {
    let arr = [];
    foreachTree(data, childrenName, (node) => {
        if (node[pidName] == id) {
            arr.push(node);
            arr = arr.concat(traceChildNode(node[idName], data, pidName, idName, childrenName));
        }
    });
    return arr;
}

/**
 * 根据pid生成树形结构
 *  @param { object } items 后台获取的数据
 *  @param { * } id 数据中的id
 *  @param { * } link 生成树形结构的依据
 */
export const createTree = (items, id = null, link = 'pid') =>{
    items.filter(item => item[link] === id).map(item => ({ ...item, children: createTree(items, item.id) }));
};


/**
 * 查询数组中是否存在某个元素并返回元素第一次出现的下标 
 * @param {*} item 
 * @param { array } data
 */
export function inArray(item, data) {
    for (let i = 0; i < data.length; i++) {
        if (item === data[i]) {
            return i;
        }
    }
    return -1;
}


/**
 * B转换到KB,MB,GB并保留两位小数
 * @param { number } fileSize 
 */
export function formatFileSize(fileSize) {
    if (fileSize < 1024) {
        return fileSize + 'B';
    } else if (fileSize < (1024 * 1024)) {
        var temp = fileSize / 1024;
        temp = temp.toFixed(2);
        return temp + 'KB';
    } else if (fileSize < (1024 * 1024 * 1024)) {
        var temp = fileSize / (1024 * 1024);
        temp = temp.toFixed(2);
        return temp + 'MB';
    } else {
        var temp = fileSize / (1024 * 1024 * 1024);
        temp = temp.toFixed(2);
        return temp + 'GB';
    }
}


/**
 *  Windows根据详细版本号判断当前系统名称
 * @param { string } osVersion 
 */
export function OutOsName(osVersion) {
    if(!osVersion){
        return
    }
    let str = osVersion.substr(0, 3);
    if (str === "5.0") {
        return "Win 2000"
    } else if (str === "5.1") {
        return "Win XP"
    } else if (str === "5.2") {
        return "Win XP64"
    } else if (str === "6.0") {
        return "Win Vista"
    } else if (str === "6.1") {
        return "Win 7"
    } else if (str === "6.2") {
        return "Win 8"
    } else if (str === "6.3") {
        return "Win 8.1"
    } else if (str === "10.") {
        return "Win 10"
    } else {
        return "Win"
    }
}


/**
 * 判断手机是Andoird还是IOS
 *  0: ios
 *  1: android
 *  2: 其它
 */
export function getOSType() {
    let u = navigator.userAgent, app = navigator.appVersion;
    let isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1;
    let isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
    if (isIOS) {
        return 0;
    }
    if (isAndroid) {
        return 1;
    }
    return 2;
}


/**
 * @desc 函数防抖
 * @param { function } func
 * @param { number } wait 延迟执行毫秒数
 * @param { boolean } immediate  true 表立即执行，false 表非立即执行
 */
export function debounce(func,wait,immediate) {
    let timeout;
    return function () {
        let context = this;
        let args = arguments;

        if (timeout) clearTimeout(timeout);
        if (immediate) {
            let callNow = !timeout;
            timeout = setTimeout(() => {
                timeout = null;
            }, wait);
            if (callNow) func.apply(context, args)
        }
        else {
            timeout = setTimeout(() => {
                func.apply(context, args)
            }, wait);
        }
    }
}


/**
 * @desc 函数节流
 * @param { function } func 函数
 * @param { number } wait 延迟执行毫秒数
 * @param { number } type 1 表时间戳版，2 表定时器版
 */
export function throttle(func, wait ,type) {
    if(type===1){
        var previous = 0;
    }else if(type===2){
        var timeout;
    }
    return function() {
        let context = this;
        let args = arguments;
        if(type===1){
            let now = Date.now();

            if (now - previous > wait) {
                func.apply(context, args);
                previous = now;
            }
        }else if(type===2){
            if (!timeout) {
                timeout = setTimeout(() => {
                    timeout = null;
                    func.apply(context, args)
                }, wait)
            }
        }

    }
}


/**
 * 判断类型
 * @param {*} target 
 */
export function type(target) {
    var ret = typeof(target);
    var template = {
        "[object Array]": "array",
        "[object Object]":"object",
        "[object Number]":"number - object",
        "[object Boolean]":"boolean - object",
        "[object String]":'string-object'
    };

    if(target === null) {
        return 'null';
    }else if(ret == "object"){
        var str = Object.prototype.toString.call(target);
        return template[str];
    }else{
        return ret;
    }
}

/**
 * 生成指定范围随机数
 * @param { number } min 
 * @param { number } max 
 */
export const RandomNum = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;


/**
 * 自适应页面（rem）
 * @param { number } width 
 */
export function AutoResponse(width = 750) {
    const target = document.documentElement;
    target.clientWidth >= 600
        ? (target.style.fontSize = "80px")
        : (target.style.fontSize = target.clientWidth / width * 100 + "px");
}


/**
 * 数组乱序
 * @param {array} arr
 */
export function shuffle(arr) {
    let array = arr;
    let index = array.length;

    while (index) {
        index -= 1;
        let randomIndex = Math.floor(Math.random() * index);
        let middleware = array[index];
        array[index] = array[randomIndex];
        array[randomIndex] = middleware
    }

    return array
}

/**
 * 数组交集
 * @param { array} arr1
 * @param { array } arr2
 */
export const similarity = (arr1, arr2) => arr1.filter(v => arr2.includes(v));

/**
 * 数组中某元素出现的次数
 * @param { array } arr
 * @param {*} value
 */
export function countOccurrences(arr, value) {
    return arr.reduce((a, v) => v === value ? a + 1 : a + 0, 0);
}

/**
 * 加法函数（精度丢失问题）
 * @param { number } arg1
 * @param { number } arg2
 */
export function add(arg1, arg2) {
    let r1, r2, m;
    try { r1 = arg1.toString().split(".")[1].length } catch (e) { r1 = 0 }
    try { r2 = arg2.toString().split(".")[1].length } catch (e) { r2 = 0 }
    m = Math.pow(10, Math.max(r1, r2));
    return (arg1 * m + arg2 * m) / m
}

/**
 * 减法函数（精度丢失问题）
 * @param { number } arg1
 * @param { number } arg2
 */
export function sub(arg1, arg2) {
    let r1, r2, m, n;
    try { r1 = arg1.toString().split(".")[1].length } catch (e) { r1 = 0 }
    try { r2 = arg2.toString().split(".")[1].length } catch (e) { r2 = 0 }
    m = Math.pow(10, Math.max(r1, r2));
    n = (r1 >= r2) ? r1 : r2;
    return Number(((arg1 * m - arg2 * m) / m).toFixed(n));
}
/**
 * 除法函数（精度丢失问题）
 * @param { number } num1
 * @param { number } num2
 */
export function division(num1,num2){
    let t1,t2,r1,r2;
    try{
        t1 = num1.toString().split('.')[1].length;
    }catch(e){
        t1 = 0;
    }
    try{
        t2=num2.toString().split(".")[1].length;
    }catch(e){
        t2=0;
    }
    r1=Number(num1.toString().replace(".",""));
    r2=Number(num2.toString().replace(".",""));
    return (r1/r2)*Math.pow(10,t2-t1);
}

/**
 * 乘法函数
 * @param { number } num1
 * @param { number } num2
 */
export function mcl(num1,num2){
    let m=0,s1=num1.toString(),s2=num2.toString();
    try{m+=s1.split(".")[1].length}catch(e){}
    try{m+=s2.split(".")[1].length}catch(e){}
    return Number(s1.replace(".",""))*Number(s2.replace(".",""))/Math.pow(10,m);
}


/**
 * 递归优化（尾递归）
 * @param { function } f
 */
export function tco(f) {
    let value;
    let active = false;
    let accumulated = [];

    return function accumulator() {
        accumulated.push(arguments);
        if (!active) {
            active = true;
            while (accumulated.length) {
                value = f.apply(this, accumulated.shift());
            }
            active = false;
            return value;
        }
    };
}


/**
 *  生成随机整数
 *
 */
export function randomNumInteger(min, max) {
    switch (arguments.length) {
        case 1:
            return parseInt(Math.random() * min + 1, 10);
        case 2:
            return parseInt(Math.random() * (max - min + 1) + min, 10);
        default:
            return 0
    }
}

/**
 * 去除空格
 * @param { string } str 待处理字符串
 * @param  { number } type 去除空格类型 1-所有空格  2-前后空格  3-前空格 4-后空格 默认为1
 */
export function trim(str, type = 1) {
    if (type && type !== 1 && type !== 2 && type !== 3 && type !== 4) return;
    switch (type) {
        case 1:
            return str.replace(/\s/g, "");
        case 2:
            return str.replace(/(^\s)|(\s*$)/g, "");
        case 3:
            return str.replace(/(^\s)/g, "");
        case 4:
            return str.replace(/(\s$)/g, "");
        default:
            return str;
    }
}


/**
 * 大小写转换
 * @param { string } str 待转换的字符串
 * @param { number } type 1-全大写 2-全小写 3-首字母大写
 */

export function turnCase(str, type) {
    switch (type) {
        case 1:
            return str.toUpperCase();
        case 2:
            return str.toLowerCase();
        case 3:
            return str[0].toUpperCase() + str.substr(1).toLowerCase();
        default:
            return str;
    }
}

/**
 * 随机16进制颜色 hexColor
 * 方法一
 */

export function hexColor() {

    let str = '#';
    let arr = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 'A', 'B', 'C', 'D', 'E', 'F'];
    for (let i = 0; i < 6; i++) {
        let index = Number.parseInt(Math.random() * 16);
        str += arr[index]
    }
    return str;
}
/**
 * 随机16进制颜色 randomHexColorCode
 * 方法二
 */
export const randomHexColorCode = () => {
    let n = (Math.random() * 0xfffff * 1000000).toString(16);
    return '#' + n.slice(0, 6);
};



/**
 * 转义html(防XSS攻击)
 */
export const escapeHTML = str =>{
    str.replace(
        /[&<>'"]/g,
        tag =>
            ({
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                "'": '&#39;',
                '"': '&quot;'
            }[tag] || tag)
    );
};

/**
 * 检测移动/PC设备
 */
export const detectDeviceType = () => { return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ? 'Mobile' : 'Desktop'; };


/**
 * 隐藏所有指定标签
 * 例: hide(document.querySelectorAll('img'))
 */
export const hideTag = (...el) => [...el].forEach(e => (e.style.display = 'none'));


/**
 * 返回指定元素的生效样式
 * @param { element} el  元素节点
 * @param { string } ruleName  指定元素的名称
 */
export const getStyle = (el, ruleName) => getComputedStyle(el)[ruleName];

/**
 * 检查是否包含子元素
 * @param { element } parent
 * @param { element } child
 * 例：elementContains(document.querySelector('head'), document.querySelector('title')); // true
 */
export const elementContains = (parent, child) => parent !== child && parent.contains(child);


/**
 * 数字超过规定大小加上加号“+”，如数字超过99显示99+
 * @param { number } val 输入的数字
 * @param { number } maxNum 数字规定界限
 */
export const outOfNum = (val, maxNum) =>{
    val = val ? val-0 :0;
    if (val > maxNum ) {
        return `${maxNum}+`
    }else{
        return val;
    }
};


/**
 *  base64转file
 *  @param { base64 } base64
 *  @param { string } filename 转换后的文件名
 */
export const base64ToFile = (base64, filename )=> {
    let arr = base64.split(',');
    let mime = arr[0].match(/:(.*?);/)[1];
    let suffix = mime.split('/')[1] ;// 图片后缀
    let bstr = atob(arr[1]);
    let n = bstr.length;
    let u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n)
    }
    return new File([u8arr], `${filename}.${suffix}`, { type: mime })
};

/**
 *  base64转blob
 *  @param { base64 } base64
 */
export const base64ToBlob = base64 => {
    let arr = base64.split(','),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]),
        n = bstr.length,
        u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
};

/**
 *  blob转file
 *  @param { blob } blob
 *  @param { string } fileName
 */
export const blobToFile = (blob, fileName) => {
    blob.lastModifiedDate = new Date();
    blob.name = fileName;
    return blob;
};

/**
 * file转base64
 * @param { * } file 图片文件
 */
export const fileToBase64 = file => {
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function (e) {
        return e.target.result
    };
};



