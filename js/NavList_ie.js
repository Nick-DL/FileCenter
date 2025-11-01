// NavList.js - IE8兼容版

// 页面加载完成后执行
addEvent(window, 'load', function() {
    loadNavListData();
});

// 加载网址导航数据
function loadNavListData() {
    ajaxGet('/config/WebLinkInfo.json',
        function(webLinkInfo) {
            updateNavList(webLinkInfo);
        },
        function(error) {
            console.log('加载网址导航数据时出错:', error);
            var fileListArea = document.getElementById('fileListArea');
            if (fileListArea) {
                fileListArea.innerHTML = 
                    '<div class="mdui-card mdui-shadow-0 mdui-p-a-4 mdui-text-center">' +
                    '<div class="mdui-typo">' +
                    '<p>网址导航加载失败，请稍后重试</p>' +
                    '</div>' +
                    '</div>';
            }
        }
    );
}

// 更新网址导航列表
function updateNavList(webLinkInfo) {
    var fileListArea = document.getElementById('fileListArea');
    
    if (!fileListArea) {
        console.log('找不到网址导航区域');
        return;
    }
    
    // 清空现有内容
    fileListArea.innerHTML = '';
    
    // 生成分类卡片
    for (var i = 0; i < webLinkInfo.categories.length; i++) {
        var category = webLinkInfo.categories[i];
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
    
    // 添加链接项
    for (var i = 0; i < categoryData.links.length; i++) {
        var link = categoryData.links[i];
        
        // 创建链接
        var linkElement = document.createElement('a');
        linkElement.href = link.url;
        
        // 创建列表项
        var listItem = document.createElement('li');
        listItem.className = 'mdui-list-item';
        
        // 图标
        listItem.innerHTML = link.icon;
        
        // 创建内容容器
        var contentDiv = document.createElement('div');
        contentDiv.className = 'mdui-list-item-content';
        
        // 标题
        var titleDiv = document.createElement('div');
        titleDiv.className = 'mdui-list-item-title';
        if (titleDiv.innerText !== undefined) {
            titleDiv.innerText = link.name;
        } else {
            titleDiv.textContent = link.name;
        }
        contentDiv.appendChild(titleDiv);
        
        // 描述（如果存在）
        if (link.description && link.description.replace(/^\s+|\s+$/g, '') !== '') {
            var textDiv = document.createElement('div');
            textDiv.className = 'mdui-list-item-text';
            if (textDiv.innerText !== undefined) {
                textDiv.innerText = link.description;
            } else {
                textDiv.textContent = link.description;
            }
            contentDiv.appendChild(textDiv);
        }
        
        listItem.appendChild(contentDiv);
        
        // 右侧图标
        var rightIcon = document.createElement('i');
        rightIcon.className = 'mdui-list-item-icon mdui-icon material-icons';
        if (rightIcon.innerText !== undefined) {
            rightIcon.innerText = '';
        } else {
            rightIcon.textContent = '';
        }
        listItem.appendChild(rightIcon);
        
        linkElement.appendChild(listItem);
        list.appendChild(linkElement);
        
        // 如果不是最后一个链接，添加分隔线
        if (i < categoryData.links.length - 1) {
            var divider = document.createElement('li');
            divider.className = 'mdui-divider-inset mdui-m-y-0';
            list.appendChild(divider);
        }
    }
    
    card.appendChild(list);
    return card;
}