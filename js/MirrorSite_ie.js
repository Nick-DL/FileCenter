// MirrorSite.js - IE8兼容版

// 页面加载完成后执行
addEvent(window, 'load', function() {
    loadMirrorSitesData();
});

// 加载镜像站数据
function loadMirrorSitesData() {
    var basicInfoLoaded = false;
    var mirrorSiteInfoLoaded = false;
    var basicInfo = null;
    var mirrorSiteInfo = null;
    
    function checkAndUpdate() {
        if (basicInfoLoaded && mirrorSiteInfoLoaded) {
            updateMirrorSiteList(basicInfo, mirrorSiteInfo);
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
            showMirrorError();
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
            showMirrorError();
        }
    );
}

// 显示错误信息
function showMirrorError() {
    var mirrorSiteListArea = document.getElementById('mirrorSiteListArea');
    if (mirrorSiteListArea) {
        mirrorSiteListArea.innerHTML = 
            '<div class="mdui-card mdui-shadow-0 mdui-p-a-4 mdui-text-center">' +
            '<div class="mdui-typo">' +
            '<p>镜像站信息加载失败，请稍后重试</p>' +
            '</div>' +
            '</div>';
    }
}

// 更新镜像站列表
function updateMirrorSiteList(basicInfo, mirrorSiteInfo) {
    var currentSiteId = basicInfo.siteInfo.id;
    var mirrorSiteListArea = document.getElementById('mirrorSiteListArea');
    
    // 清空加载提示
    mirrorSiteListArea.innerHTML = '';
    
    // 查找当前站点信息
    var currentMirror = null;
    for (var i = 0; i < mirrorSiteInfo.mirrors.length; i++) {
        if (mirrorSiteInfo.mirrors[i].id === currentSiteId) {
            currentMirror = mirrorSiteInfo.mirrors[i];
            break;
        }
    }
    
    // 生成当前站点卡片（黄色）
    if (currentMirror) {
        var currentSiteCard = createMirrorSiteCard(currentMirror, true);
        mirrorSiteListArea.appendChild(currentSiteCard);
        mirrorSiteListArea.appendChild(document.createElement('p'));
    }
    
    // 收集并排序其他镜像站
    var otherMirrors = [];
    for (var i = 0; i < mirrorSiteInfo.mirrors.length; i++) {
        if (mirrorSiteInfo.mirrors[i].id !== currentSiteId) {
            otherMirrors.push(mirrorSiteInfo.mirrors[i]);
        }
    }
    
    // 按priority排序（冒泡排序，IE8兼容）
    for (var i = 0; i < otherMirrors.length - 1; i++) {
        for (var j = 0; j < otherMirrors.length - 1 - i; j++) {
            if (otherMirrors[j].priority > otherMirrors[j + 1].priority) {
                var temp = otherMirrors[j];
                otherMirrors[j] = otherMirrors[j + 1];
                otherMirrors[j + 1] = temp;
            }
        }
    }
    
    // 生成其他镜像站卡片
    for (var i = 0; i < otherMirrors.length; i++) {
        var mirrorCard = createMirrorSiteCard(otherMirrors[i], false);
        mirrorSiteListArea.appendChild(mirrorCard);
        mirrorSiteListArea.appendChild(document.createElement('p'));
    }
    
    // 更新镜像站信息更新时间
    safeUpdateElement('MirrorSiteUpdateTime', mirrorSiteInfo.infoUpdate);
}

// 创建镜像站卡片
function createMirrorSiteCard(mirrorData, isCurrent) {
    // 创建卡片容器
    var card = document.createElement('div');
    card.className = isCurrent ?
        'mdui-card mdui-shadow-0 mdui-color-yellow-100 text-color-changing' :
        'mdui-card mdui-shadow-0';
    
    // 构建HTML内容
    var html = 
        '<div class="mdui-card-primary mdui-typo">' +
        '<div class="mdui-card-primary-title">' +
        (isCurrent ? '当前：' : '') + mirrorData.name +
        '</div>' +
        (mirrorData.remark ? 
            '<div class="mdui-card-primary-subtitle">' + mirrorData.remark + '</div>' : 
            '<div class="mdui-card-primary-subtitle"></div>') +
        '</div>' +
        '<div class="mdui-card-content mdui-typo">' +
        '<p>当前 IP: ' + mirrorData.ip + '<br>' +
        '服务时间： ' + mirrorData.serviceTime + '<br>' +
        '位置：' + mirrorData.location +
        '</p>' +
        '</div>';
    
    if (!isCurrent) {
        html += 
            '<ul class="mdui-list">' +
            '<a href="http://' + mirrorData.ip + '">' +
            '<li class="mdui-list-item">' +
            '<div class="mdui-list-item-content" style="color: #0A59F7; font-weight: 500; ">跳转</div>' +
            '<i class="mdui-list-item-icon mdui-icon material-icons">chevron_right</i>' +
            '</li>' +
            '</a>' +
            '</ul>';
    }
    
    card.innerHTML = html;
    return card;
}