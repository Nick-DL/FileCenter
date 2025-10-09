// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', function () {
    // 加载镜像站配置信息
    loadMirrorSitesData();
});

// 加载镜像站数据
async function loadMirrorSitesData() {
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

        // 更新镜像站列表
        updateMirrorSiteList(basicInfo, mirrorSiteInfo);

    } catch (error) {
        console.error('加载镜像站数据时出错:', error);
        // 显示错误信息
        document.getElementById('mirrorSiteListArea').innerHTML = `
          <div class="mdui-card mdui-shadow-0 mdui-p-a-4 mdui-text-center">
            <div class="mdui-typo">
              <p>镜像站信息加载失败，请稍后重试</p>
            </div>
          </div>
        `;
    }
}

// 更新镜像站列表
function updateMirrorSiteList(basicInfo, mirrorSiteInfo) {
    const currentSiteId = basicInfo.siteInfo.id;
    const mirrorSiteListArea = document.getElementById('mirrorSiteListArea');

    // 清空加载提示
    mirrorSiteListArea.innerHTML = '';

    // 获取当前站点信息
    const currentMirror = mirrorSiteInfo.mirrors.find(mirror => mirror.id === currentSiteId);

    // 生成当前站点卡片（黄色）
    if (currentMirror) {
        const currentSiteCard = createMirrorSiteCard(currentMirror, true);
        mirrorSiteListArea.appendChild(currentSiteCard);
        mirrorSiteListArea.appendChild(document.createElement('p'));
    }

    // 按priority从小到大排序其他镜像站
    const otherMirrors = mirrorSiteInfo.mirrors
        .filter(mirror => mirror.id !== currentSiteId)
        .sort((a, b) => a.priority - b.priority);

    // 生成其他镜像站卡片
    otherMirrors.forEach(mirror => {
        const mirrorCard = createMirrorSiteCard(mirror, false);
        mirrorSiteListArea.appendChild(mirrorCard);
        mirrorSiteListArea.appendChild(document.createElement('p'));
    });

    // 更新镜像站信息更新时间
    document.getElementById('MirrorSiteUpdateTime').textContent = mirrorSiteInfo.infoUpdate;
}

// 创建镜像站卡片
function createMirrorSiteCard(mirrorData, isCurrent) {
    // 创建卡片容器
    const card = document.createElement('div');
    card.className = isCurrent ?
        'mdui-card mdui-shadow-0 mdui-color-yellow-100 text-color-changing' :
        'mdui-card mdui-shadow-0';

    // 卡片内容
    card.innerHTML = `
        <div class="mdui-card-primary mdui-typo">
          <div class="mdui-card-primary-title">
            ${isCurrent ? '当前：' : ''}${mirrorData.name}
          </div>
          ${mirrorData.remark ? `<div class="mdui-card-primary-subtitle">${mirrorData.remark}</div>` : '<div class="mdui-card-primary-subtitle"></div>'}
        </div>
        <div class="mdui-card-content mdui-typo">
          <p>当前 IP: ${mirrorData.ip}<br>
            服务时间： ${mirrorData.serviceTime}<br>
            位置：${mirrorData.location}
          </p>
        </div>
        ${!isCurrent ? `
        <ul class="mdui-list">
          <a href="http://${mirrorData.ip}">
            <li class="mdui-list-item">
              <div class="mdui-list-item-content" style="color: #0A59F7; font-weight: 500; ">跳转</div>
              <i class="mdui-list-item-icon mdui-icon material-icons">chevron_right</i>
            </li>
          </a>
        </ul>
        ` : ''}
      `;

    return card;
}