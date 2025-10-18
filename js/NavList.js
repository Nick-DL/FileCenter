// NavList.js - 网址导航动态加载脚本

// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', function () {
    // 加载网址导航配置信息
    loadNavListData();
});

// 加载网址导航数据

async function loadNavListData() {
    try {
        // 加载配置文件
        const webLinkInfoResponse = await fetch('/config/WebLinkInfo.json');

        // 检查响应状态
        if (!webLinkInfoResponse.ok) {
            throw new Error('网址导航配置文件加载失败');
        }

        // 解析JSON数据
        const webLinkInfo = await webLinkInfoResponse.json();

        // 更新网址导航列表
        updateNavList(webLinkInfo);

    } catch (error) {
        console.error('加载网址导航数据时出错:', error);
        // 显示错误信息
        const fileListArea = document.getElementById('fileListArea');
        if (fileListArea) {
            fileListArea.innerHTML = `
          <div class="mdui-card mdui-shadow-0 mdui-p-a-4 mdui-text-center">
            <div class="mdui-typo">
              <p>网址导航加载失败，请稍后重试</p>
            </div>
          </div>
        `;
        }
    }
}

// 更新网址导航列表
function updateNavList(webLinkInfo) {
    const fileListArea = document.getElementById('fileListArea');

    if (!fileListArea) {
        console.error('找不到网址导航区域');
        return;
    }

    // 清空现有内容
    fileListArea.innerHTML = '';

    // 生成分类卡片
    webLinkInfo.categories.forEach(category => {
        const categoryCard = createCategoryCard(category);
        fileListArea.appendChild(categoryCard);

        // 添加分隔符
        const separator = document.createElement('p');
        fileListArea.appendChild(separator);
    });
}

// 创建分类卡片
function createCategoryCard(categoryData) {
    // 创建卡片容器
    const card = document.createElement('div');
    card.className = 'mdui-card mdui-shadow-0';

    // 创建列表容器
    const list = document.createElement('ul');
    list.className = 'mdui-list';

    // 添加分类标题
    const header = document.createElement('li');
    header.className = 'mdui-subheader';
    header.textContent = categoryData.name;
    list.appendChild(header);

    // 添加链接项
    categoryData.links.forEach((link, index) => {
        // 创建链接
        const linkElement = document.createElement('a');
        linkElement.href = link.url;

        // 创建列表项
        const listItem = document.createElement('li');
        listItem.className = 'mdui-list-item';

        // 图标
        listItem.innerHTML = link.icon;

        // 创建内容容器
        const contentDiv = document.createElement('div');
        contentDiv.className = 'mdui-list-item-content';

        // 标题
        const titleDiv = document.createElement('div');
        titleDiv.className = 'mdui-list-item-title';
        titleDiv.textContent = link.name;
        contentDiv.appendChild(titleDiv);

        // 描述（如果存在）
        if (link.description && link.description.trim() !== '') {
            const textDiv = document.createElement('div');
            textDiv.className = 'mdui-list-item-text';
            textDiv.textContent = link.description;
            contentDiv.appendChild(textDiv);
        }

        listItem.appendChild(contentDiv);

        // 右侧图标
        const rightIcon = document.createElement('i');
        rightIcon.className = 'mdui-list-item-icon mdui-icon material-icons';
        rightIcon.textContent = '';
        listItem.appendChild(rightIcon);

        linkElement.appendChild(listItem);
        list.appendChild(linkElement);

        // 如果不是最后一个链接，添加分隔线
        if (index < categoryData.links.length - 1) {
            const divider = document.createElement('li');
            divider.className = 'mdui-divider-inset mdui-m-y-0';
            list.appendChild(divider);
        }
    });

    card.appendChild(list);
    return card;
  }