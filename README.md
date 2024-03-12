
<h1 align="center"> Halo Theme Stack  </h1>

---

<div align="center">  

一款 [Halo2.0](https://github.com/halo-dev/halo) 的博客主题  
移植于 Hugo  [hugo-theme-stack](https://github.com/CaiJimmy/hugo-theme-stack)同名主题

</div>

<p class="badge-row" align="center">
  <a href="https://halo.run" target="_blank">
    <img src="https://img.shields.io/badge/dynamic/yaml?label=Halo&query=%24.spec.requires&url=https://raw.githubusercontent.com/jiewenhuang/halo-theme-stack/main/theme.yaml&color=113,195,71" alt="Halo"/>
  </a>
  <a href="https://github.com/jiewenhuang/halo-theme-stack" target="_blank">
    <img src="https://img.shields.io/github/v/release/jiewenhuang/halo-theme-stack" alt="Release"/>
  </a>
  <a href="https://github.com/jiewenhuang/halo-theme-stack/blob/main/LICENSE" target="_blank">
<img src="https://img.shields.io/badge/License-GPL%20v3.0-green.svg" alt="GPL-3.0 License">
  </a>  </a>
</p>

### 预览：[Jiewen's Blog](https://www.jiewen.run/?preview-theme=theme-Stack2)
![image](https://user-images.githubusercontent.com/5889006/190859441-141b5f81-8483-40d2-bd96-ebf85616a46d.png)
### 文档：[Stack 使用文档](https://www.jiewen.run/docs/stack)
### 版本说明
在结构上：考虑到之前的版本并非正常的构建，导致无法修改js和css，不利于用户二次开发，于是重构了2.x版本，此版本与1.x并不通用，因此你可以把它当成一个新的主题来使用。  
在样式上：此版本几乎不加入个性化样式，保留原来主题样式，如果您需要进行二次开发，可以在`src/styles/custom.scss`中添加，样式可以参考[L1nSn0w 's Blog-Hugo主题魔改](https://blog.linsnow.cn/p/modify-hugo/)  
原版本：原1.x版本已经移入1.x分支，需要的可以在此分支下载使用。
### 安裝
直接通过后台应用市场安装或者下载[releases](https://github.com/jiewenhuang/halo-theme-stack/releases)，通过 Halo Console 后台主题安装处上传即可。

### 插件支持
stack 主题支持以下 Halo 插件：

- [X] 友情链接（/links）：https://halo.run/store/apps/app-hfbQg
- [X] 图库（/photos）：https://halo.run/store/apps/app-BmQJW
- [X] 瞬间（/moments）：https://halo.run/store/apps/app-SnwWD  

为了获得更好的体验，你还可以安装以下插件（如果需要）：

- highlight.js 代码高亮：https://halo.run/store/apps/app-sqpgf
- lightgallery.js 灯箱：https://halo.run/store/apps/app-OoggD


### 使用说明
> 1、部分功能是使用插件进行支持  
> 2、导航icon 推荐使用iconfont  
> 3、使用搜索请安装插件后新建页面选择search模板，别名为‘search’
- [x] 卡片化设计
- [x] 响应式主题
- [x] 深色模式
- [X] 文章目录
- [X] [代码高亮/语言/复制](https://github.com/halo-sigs/plugin-highlightjs)（插件）
- [x] [文章搜索](https://github.com/halo-sigs/plugin-search-widget)（插件）
- [x] 显示字数统计
- [x] 显示相关文章
- [x] [waline评论](https://waline.js.org/)
- [X] [评论系统](https://github.com/halo-sigs/plugin-comment-widget)（插件）
- [x] [友情链接](https://github.com/halo-sigs/plugin-links)
- [x] i18n国际化
- [x] 其他功能

### TODO
- [ ] 细节优化

### 开发
dev为开发版本，无特殊需求请拉取此版本进行开发，如果想奉献您的代码，也是拉取并提交到此分支，main分支不做合并。

```bash
cd ~/halo2-dev/themes/theme-stack
```

```bash
pnpm install 
```

```bash
pnpm dev
```

### 🏭 贡献

> 如果你想帮助完善 `stack` 主题，请：

- 点 `star`
- 提 `issue`
- 修 `bugs`
- 推 `pr`

<br>

### 🙆‍♂️ 感谢

在此感谢以下项目提供的支持：

- [Halo](https://halo.run)
- [hugo-theme-stack](https://github.com/CaiJimmy/hugo-theme-stack)
- [theme-starter](https://github.com/halo-dev/theme-starter)
- [Halo-theme-hao](https://github.com/liuzhihang/halo-theme-hao)
- [Halo-theme-sakura](https://github.com/LIlGG/halo-theme-sakura/tree/next)
- [plugin-links](https://github.com/halo-sigs/plugin-links)
- [plugin-comment-widget](https://github.com/halo-sigs/plugin-comment-widget)
- [plugin-search-widget](https://github.com/halo-sigs/plugin-search-widget)

- ......

<br>