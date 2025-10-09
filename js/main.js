// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', function () {
    // 加载配置信息
    loadConfigData();
});

// 加载配置数据
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
        // 显示错误信息
        document.getElementById('currentSiteName').innerHTML = '加载失败';
        document.getElementById('noticeInfo').innerHTML = '配置信息加载失败，请稍后重试';
        document.getElementById('currentIP').innerHTML = '未知';
        document.getElementById('currentServeTime').innerHTML = '未知';
        document.getElementById('latestUpdateTime').innerHTML = '未知';
        document.getElementById('copyrightInfo').innerHTML = '配置加载失败';
    }
}

// 更新页面内容
function updatePageContent(basicInfo, mirrorSiteInfo) {
    // 更新站点名称
    document.getElementById('currentSiteName').textContent = basicInfo.siteInfo.name;

    // 更新通知信息
    if (basicInfo.notification.enabled) {
        document.getElementById('noticeInfo').textContent = basicInfo.notification.message;
        document.getElementById('notificationCard').classList.remove('hidden');
    } else {
        document.getElementById('notificationCard').classList.add('hidden');
    }

    // 更新版权信息
    document.getElementById('copyrightInfo').textContent = basicInfo.copyright.text;

    // 更新最近更新时间
    document.getElementById('latestUpdateTime').textContent = basicInfo.lastUpdate.date;

    // 查找当前站点的镜像信息
    const currentSiteId = basicInfo.siteInfo.id;
    const currentMirror = mirrorSiteInfo.mirrors.find(mirror => mirror.id === currentSiteId);

    if (currentMirror) {
        // 更新IP地址
        document.getElementById('currentIP').textContent = currentMirror.ip;

        // 更新服务时间
        document.getElementById('currentServeTime').textContent = currentMirror.serviceTime;
    } else {
        // 如果没有找到对应的镜像信息
        document.getElementById('currentIP').textContent = '未知';
        document.getElementById('currentServeTime').textContent = '未知';
        console.warn('未找到与站点ID匹配的镜像信息:', currentSiteId);
    }

    // 移除所有加载动画
    const loadingElements = document.querySelectorAll('.loading');
    loadingElements.forEach(element => {
        element.remove();
    });
}