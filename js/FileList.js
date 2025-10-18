// FileList.js - 文件列表动态加载脚本

// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', function () {
    // 加载文件列表配置信息
    loadFileListData();
});
//const timer = setTimeout(() => {
// 加载文件列表数据
async function loadFileListData() {
    try {
        // 加载配置文件
        const fileListInfoResponse = await fetch('/config/FileListInfo.json');

        // 检查响应状态
        if (!fileListInfoResponse.ok) {
            throw new Error('文件列表配置文件加载失败');
        }

        // 解析JSON数据
        const fileListInfo = await fileListInfoResponse.json();

        // 更新文件列表
        updateFileList(fileListInfo);

    } catch (error) {
        console.error('加载文件列表数据时出错:', error);
        // 显示错误信息
        const fileListArea = document.getElementById('fileListArea');
        if (fileListArea) {
            fileListArea.innerHTML = `
          <div class="mdui-card mdui-shadow-0 mdui-p-a-4 mdui-text-center">
            <div class="mdui-typo">
              <p>文件列表加载失败，请稍后重试</p>
            </div>
          </div>
        `;
        }
    }
}

// 更新文件列表
function updateFileList(fileListInfo) {
    const fileListArea = document.getElementById('fileListArea');

    if (!fileListArea) {
        console.error('找不到文件列表区域');
        return;
    }

    // 清空现有内容
    fileListArea.innerHTML = '';

    // 生成分类卡片
    fileListInfo.categories.forEach(category => {
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

    // 添加文件项
    categoryData.files.forEach((file, index) => {
        // 创建文件链接
        const link = document.createElement('a');
        link.href = file.path;

        // 创建列表项
        const listItem = document.createElement('li');
        listItem.className = 'mdui-list-item';

        // 文件内容
        listItem.innerHTML = `
        <div class="mdui-list-item-content">${file.name}</div>
        <i class="mdui-list-item-icon mdui-icon material-icons">&#xe2c4;</i>
      `;

        link.appendChild(listItem);
        list.appendChild(link);

        // 如果不是最后一个文件，添加分隔线
        if (index < categoryData.files.length - 1) {
            const divider = document.createElement('li');
            divider.className = 'mdui-divider mdui-m-y-0';
            list.appendChild(divider);
        }
    });

    card.appendChild(list);
    return card;
  }