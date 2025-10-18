// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', function () {
    // 加载配置信息
    loadConfigData();
});

// 加载配置数据
//const timer = setTimeout(() => {
async function loadConfigData() {
    try {
        // 并行加载两个配置文件
        const [basicInfoResponse, mirrorSiteInfoResponse] = await Promise.all([
            fetch('/config/BasicInfo.json'),
            fetch('/config/MirrorSiteInfo.json')
        ]);

        // 检查响应状态
        if (!basicInfoResponse.ok || !mirrorSiteInfoResponse.ok) {
            throw new Error('配置文件加载失败');
        }

        // 解析JSON数据
        const basicInfo = await basicInfoResponse.json();
        const mirrorSiteInfo = await mirrorSiteInfoResponse.json();

        // 更新页面内容
        updatePageContent(basicInfo, mirrorSiteInfo);

    } catch (error) {
        console.error('加载配置数据时出错:', error);
        // 安全地显示错误信息，只操作存在的元素
        safeUpdateElement('currentSiteName', '加载失败');
        safeUpdateElement('noticeInfo', '配置信息加载失败，请稍后重试');
        safeUpdateElement('currentIP', '未知');
        safeUpdateElement('currentServeTime', '未知');
        safeUpdateElement('latestUpdateTime', '未知');
        safeUpdateElement('copyrightInfo', '配置加载失败');
    }
}

// 安全更新元素内容，如果元素存在才更新
function safeUpdateElement(elementId, content) {
    const element = document.getElementById(elementId);
    if (element) {
        element.textContent = content;

        // 如果元素中有加载动画，移除它
        const spinner = element.querySelector('.mdui-spinner');
        if (spinner) {
            spinner.remove();
        }
    }
}

// 更新页面内容
function updatePageContent(basicInfo, mirrorSiteInfo) {
    // 更新站点名称
    safeUpdateElement('currentSiteName', basicInfo.siteInfo.name);
    safeUpdateElement('currentSiteName1', basicInfo.siteInfo.name);

    // 更新通知信息（只在主页中存在）
    const notificationCard = document.getElementById('notificationCard');
    const noticeInfo = document.getElementById('noticeInfo');

    if (notificationCard && noticeInfo) {
        if (basicInfo.notification.enabled) {
            noticeInfo.textContent = basicInfo.notification.message;
            notificationCard.classList.remove('hidden');
        } else {
            notificationCard.classList.add('hidden');
        }

        // 移除加载动画
        const spinner = noticeInfo.querySelector('.mdui-spinner');
        if (spinner) {
            spinner.remove();
        }
    }

    // 更新版权信息
    safeUpdateElement('copyrightInfo', basicInfo.copyright.text);

    // 更新最近更新时间
    safeUpdateElement('latestUpdateTime', basicInfo.lastUpdate.date);
    safeUpdateElement('FcVersion', basicInfo.lastUpdate.version);

    // 查找当前站点的镜像信息
    const currentSiteId = basicInfo.siteInfo.id;
    const currentMirror = mirrorSiteInfo.mirrors.find(mirror => mirror.id === currentSiteId);

    if (currentMirror) {
        // 更新IP地址
        safeUpdateElement('currentIP', currentMirror.ip);

        // 更新服务时间
        safeUpdateElement('currentServeTime', currentMirror.serviceTime);
        safeUpdateElement('currentLocation', currentMirror.location);

    } else {
        // 如果没有找到对应的镜像信息
        safeUpdateElement('currentIP', '未知');
        safeUpdateElement('currentServeTime', '未知');
        console.warn('未找到与站点ID匹配的镜像信息:', currentSiteId);
    }

    // 移除所有加载动画（安全方式）
    //const spinners = document.querySelectorAll('.mdui-spinner');
    //spinners.forEach(spinner => {
        //spinner.remove();
    //});
  }