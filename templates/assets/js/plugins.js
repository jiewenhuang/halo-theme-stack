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