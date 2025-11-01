// IE8兼容的工具函数库

// 跨浏览器事件监听
function addEvent(element, eventName, handler) {
    if (element.addEventListener) {
        element.addEventListener(eventName, handler, false);
    } else if (element.attachEvent) {
        element.attachEvent('on' + eventName, handler);
    }
}

// 跨浏览器Ajax请求
function ajaxGet(url, successCallback, errorCallback) {
    var xhr;
    if (window.XMLHttpRequest) {
        xhr = new XMLHttpRequest();
    } else if (window.ActiveXObject) {
        // IE6及以下
        try {
            xhr = new ActiveXObject("Msxml2.XMLHTTP");
        } catch (e) {
            xhr = new ActiveXObject("Microsoft.XMLHTTP");
        }
    }
    
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                try {
                    var data = JSON.parse(xhr.responseText);
                    successCallback(data);
                } catch (e) {
                    if (errorCallback) errorCallback(e);
                }
            } else {
                if (errorCallback) errorCallback(new Error('HTTP错误: ' + xhr.status));
            }
        }
    };
    
    xhr.open('GET', url, true);
    xhr.send(null);
}

// 安全更新元素内容
function safeUpdateElement(elementId, content) {
    var element = document.getElementById(elementId);
    if (element) {
        // 移除加载动画
        var spinner = element.getElementsByTagName('span')[0];
        if (spinner && spinner.className.indexOf('mdui-spinner') !== -1) {
            element.removeChild(spinner);
        }
        
        // 更新文本内容
        if (element.innerText !== undefined) {
            element.innerText = content; // IE
        } else {
            element.textContent = content; // 标准浏览器
        }
    }
}

// 添加class（IE8不支持classList）
function addClass(element, className) {
    if (element.className.indexOf(className) === -1) {
        element.className += ' ' + className;
    }
}

// 移除class
function removeClass(element, className) {
    var reg = new RegExp('(\\s|^)' + className + '(\\s|$)');
    element.className = element.className.replace(reg, ' ');
}

// 页面加载完成后执行
addEvent(window, 'load', function() {
    loadConfigData();
});

// 加载配置数据
function loadConfigData() {
    var basicInfoLoaded = false;
    var mirrorSiteInfoLoaded = false;
    var basicInfo = null;
    var mirrorSiteInfo = null;
    
    function checkAndUpdate() {
        if (basicInfoLoaded && mirrorSiteInfoLoaded) {
            updatePageContent(basicInfo, mirrorSiteInfo);
        }
    }
    
    // 加载BasicInfo.json
    ajaxGet('/config/BasicInfo.json', 
        function(data) {
            basicInfo = data;
            basicInfoLoaded = true;
            checkAndUpdate();
        },
        function(error) {
            console.log('加载BasicInfo失败:', error);
            showError();
        }
    );
    
    // 加载MirrorSiteInfo.json
    ajaxGet('/config/MirrorSiteInfo.json',
        function(data) {
            mirrorSiteInfo = data;
            mirrorSiteInfoLoaded = true;
            checkAndUpdate();
        },
        function(error) {
            console.log('加载MirrorSiteInfo失败:', error);
            showError();
        }
    );
}

// 显示错误信息
function showError() {
    safeUpdateElement('currentSiteName', '加载失败');
    safeUpdateElement('noticeInfo', '配置信息加载失败，请稍后重试');
    safeUpdateElement('currentIP', '未知');
    safeUpdateElement('currentServeTime', '未知');
    safeUpdateElement('latestUpdateTime', '未知');
    safeUpdateElement('copyrightInfo', '配置加载失败');
}

// 更新页面内容
function updatePageContent(basicInfo, mirrorSiteInfo) {
    // 更新站点名称
    safeUpdateElement('currentSiteName', basicInfo.siteInfo.name);
    safeUpdateElement('currentSiteName1', basicInfo.siteInfo.name);
    
    // 更新通知信息
    var notificationCard = document.getElementById('notificationCard');
    var noticeInfo = document.getElementById('noticeInfo');
    
    if (notificationCard && noticeInfo) {
        if (basicInfo.notification.enabled) {
            safeUpdateElement('noticeInfo', basicInfo.notification.message);
            removeClass(notificationCard, 'hidden');
        } else {
            addClass(notificationCard, 'hidden');
        }
    }
    
    // 更新版权信息
    safeUpdateElement('copyrightInfo', basicInfo.copyright.text);
    
    // 更新最近更新时间
    safeUpdateElement('latestUpdateTime', basicInfo.lastUpdate.date);
    safeUpdateElement('FcVersion', basicInfo.lastUpdate.version);
    
    // 查找当前站点的镜像信息
    var currentSiteId = basicInfo.siteInfo.id;
    var currentMirror = null;
    
    // 手动查找（IE8不支持find）
    for (var i = 0; i < mirrorSiteInfo.mirrors.length; i++) {
        if (mirrorSiteInfo.mirrors[i].id === currentSiteId) {
            currentMirror = mirrorSiteInfo.mirrors[i];
            break;
        }
    }
    
    if (currentMirror) {
        safeUpdateElement('currentIP', currentMirror.ip);
        safeUpdateElement('currentServeTime', currentMirror.serviceTime);
        safeUpdateElement('currentLocation', currentMirror.location);
    } else {
        safeUpdateElement('currentIP', '未知');
        safeUpdateElement('currentServeTime', '未知');
        console.log('未找到与站点ID匹配的镜像信息:', currentSiteId);
    }
}