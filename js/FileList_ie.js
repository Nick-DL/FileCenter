// FileList.js - IE8兼容版

// 页面加载完成后执行
addEvent(window, 'load', function() {
    loadFileListData();
});

// 加载文件列表数据
function loadFileListData() {
    ajaxGet('/config/FileListInfo.json',
        function(fileListInfo) {
            updateFileList(fileListInfo);
        },
        function(error) {
            console.log('加载文件列表数据时出错:', error);
            var fileListArea = document.getElementById('fileListArea');
            if (fileListArea) {
                fileListArea.innerHTML = 
                    '<div class="mdui-card mdui-shadow-0 mdui-p-a-4 mdui-text-center">' +
                    '<div class="mdui-typo">' +
                    '<p>文件列表加载失败，请稍后重试</p>' +
                    '</div>' +
                    '</div>';
            }
        }
    );
}

// 更新文件列表
function updateFileList(fileListInfo) {
    var fileListArea = document.getElementById('fileListArea');
    
    if (!fileListArea) {
        console.log('找不到文件列表区域');
        return;
    }
    
    // 清空现有内容
    fileListArea.innerHTML = '';
    
    // 生成分类卡片
    for (var i = 0; i < fileListInfo.categories.length; i++) {
        var category = fileListInfo.categories[i];
        var categoryCard = createCategoryCard(category);
        fileListArea.appendChild(categoryCard);
        
        // 添加分隔符
        var separator = document.createElement('p');
        fileListArea.appendChild(separator);
    }
}

// 创建分类卡片
function createCategoryCard(categoryData) {
    // 创建卡片容器
    var card = document.createElement('div');
    card.className = 'mdui-card mdui-shadow-0';
    
    // 创建列表容器
    var list = document.createElement('ul');
    list.className = 'mdui-list';
    
    // 添加分类标题
    var header = document.createElement('li');
    header.className = 'mdui-subheader';
    if (header.innerText !== undefined) {
        header.innerText = categoryData.name;
    } else {
        header.textContent = categoryData.name;
    }
    list.appendChild(header);
    
    // 添加文件项
    for (var i = 0; i < categoryData.files.length; i++) {
        var file = categoryData.files[i];
        
        // 创建文件链接
        var link = document.createElement('a');
        link.href = file.path;
        
        // 创建列表项
        var listItem = document.createElement('li');
        listItem.className = 'mdui-list-item';
        
        // 文件内容
        listItem.innerHTML = 
            '<div class="mdui-list-item-content">' + file.name + '</div>' +
            '<i class="mdui-list-item-icon mdui-icon material-icons">&#xe2c4;</i>';
        
        link.appendChild(listItem);
        list.appendChild(link);
        
        // 如果不是最后一个文件，添加分隔线
        if (i < categoryData.files.length - 1) {
            var divider = document.createElement('li');
            divider.className = 'mdui-divider mdui-m-y-0';
            list.appendChild(divider);
        }
    }
    
    card.appendChild(list);
    return card;
}