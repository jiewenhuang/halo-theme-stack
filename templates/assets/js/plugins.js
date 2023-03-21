tocbot.init({
    // Where to render the table of contents.
    // 把目录显示在那个区域
    tocSelector: '#TableOfContents',
    // Where to grab the headings to build the table of contents.
    // 生成目录的文本源在哪儿
    contentSelector: '.article-content',
    // Which headings to grab inside of the contentSelector element.
    // 生成那些标题的级别
    headingSelector: 'h1,h2,h3,h4,h5,h6',
    linkClass: '',
    listClass: '',
    listItemClass: '',
    // For headings inside relative or absolute positioned containers within content.
    hasInnerContainers: true,
});
// 创建XMLHttpRequest对象
var xhr = new XMLHttpRequest();

// 设置请求方法和请求地址
xhr.open("GET", "https://www.aapi.icu/call/hot/weibo/?item=6", true);

// 发送请求
xhr.send();

// 监听状态改变事件
xhr.onreadystatechange = function() {
    if (this.readyState === 4 && this.status === 200) {
        // 将响应数据转换为JSON格式
        var response = JSON.parse(this.responseText);

        // 获取热搜数据
        var hotData = response.data;

        // 创建ul元素
        var ul = document.createElement("ul");
        ul.className = "hot-ranking-list";

        // 遍历热搜数据，创建li元素
        for (var i = 0; i < hotData.length; i++) {
            var hot = hotData[i];

            // 创建li元素
            var li = document.createElement("li");
            li.className = "hot-ranking-list_item";

            // 创建a元素
            var a = document.createElement("a");
            a.href = hot.hot_url;
            a.target = "_blank";
            a.title = hot.hot_title;

            // 创建span元素
            var spanOrder = document.createElement("span");
            spanOrder.className = "hot-ranking_order hot-ranking_order-" + hot.hot_rank;
            spanOrder.textContent = hot.hot_rank;

            var spanText = document.createElement("span");
            spanText.className = "hot-ranking_text";

            var spanTitle = document.createElement("span");
            spanTitle.className = "hot-ranking_title";
            spanTitle.textContent = hot.hot_title;

            var spanNumber = document.createElement("span");
            spanNumber.className = "hot-ranking_number";
            spanNumber.textContent = hot.hot_value;

            var spanHot = document.createElement("span");
            spanHot.className = "hot-ranking_hot";
            spanHot.textContent = "热";

            // 将span元素添加到a元素中
            spanText.appendChild(spanTitle);
            spanText.appendChild(spanNumber);
            a.appendChild(spanOrder);
            a.appendChild(spanText);
            a.appendChild(spanHot);

            // 将a元素添加到li元素中
            li.appendChild(a);

            // 将li元素添加到ul元素中
            ul.appendChild(li);
        }

        // 将ul元素添加到页面中
        document.getElementById("weibo_hot").appendChild(ul);
    }
};
