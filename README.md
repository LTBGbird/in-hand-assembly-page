# Assembling Two Parts in One Hand

Project website for the manuscript **Assembling Two Parts in One Hand**.

- Website: https://ltbgbird.github.io/in-hand-assembly-page/
- Repository: https://github.com/LTBGbird/in-hand-assembly-page
- Paper: [PDF](assets/papers/paper.pdf)

页面文字依据提供的论文整理；摘要与 Table 1 的实验计数已核对。作者暂时沿用稿件中的 Anonymous Author(s)，未填写未知单位、arXiv 编号或录用信息。

## 本地预览

无需 npm、Jekyll 或构建步骤。可以直接用浏览器打开 index.html，或在本目录运行：

```sh
python3 -m http.server 8000 --bind 127.0.0.1
```

打开 http://127.0.0.1:8000/ 查看；修改后刷新。

## 文件位置

| 文件或目录 | 用途 |
| --- | --- |
| index.html | 论文标题、作者、正文、结果表、链接、媒体路径及 BibTeX |
| assets/style.css | 布局、配色、字体大小及封面图片 |
| assets/main.js | 可选媒体加载和视频切换 |
| assets/images/ | 后续添加封面、总览图和方法图 |
| assets/videos/ | 后续添加 MP4 演示视频 |
| assets/papers/paper.pdf | 用户提供的论文，保留原文件内容 |
| .nojekyll | 直接发布静态网页 |

## 后续添加图片和视频

未填写路径的媒体区域自动隐藏，页面不会显示空白占位框。保留 HTML 中的 data-optional-media 和 hidden 属性即可；脚本会在配置媒体路径后显示相应区域。

### 封面

将封面保存为 assets/images/hero.jpg，然后修改 assets/style.css：

```css
--hero-image: url("images/hero.jpg");
```

这里的路径相对 CSS 文件。

### 总览图和方法图

在 index.html 对应的 figure-slot 上填写 data-image，并修改 data-alt 和图注：

```html
<div class="figure-slot"
     data-image="assets/images/overview.png"
     data-alt="描述图中展示的研究内容">
```

### Bottle / Syringe / Marker 演示与对比视频

在相应的视频组中，为按钮填写 data-src：

```html
<button type="button" class="video-option"
        data-src="assets/videos/bottle.mp4"
        aria-pressed="true">Bottle</button>
```

脚本只显示已填写路径的按钮，自动选择可用视频。首页和实验对比是两个独立的视频组。视频保留播放控件，点击切换按钮后尝试静音播放；滚动到屏幕外会暂停。

### 扰动、手部倾斜与失败案例

在相应的 standalone-video 上填写 data-video：

```html
<div class="standalone-video"
     data-video="assets/videos/bottle-perturbation.mp4"
     data-title="Recovery from bottle-cap misalignment">
```

推荐准备浏览器兼容的 H.264 MP4，并相应更新说明文字。尚未提供的图片和视频没有从其他项目借用。

## 更新论文信息

在 index.html 修改作者、单位、正式论文链接和 BibTeX。当前没有添加未知的算法仓库或 arXiv 链接；拿到真实链接后，可以在 paper-links 中添加按钮。

替换 assets/papers/paper.pdf 可更新下载的论文版本。请按新稿件同步更新网页摘要、结果和引用信息。

## GitHub Pages 发布设置

- Repository visibility: Public
- Source: Deploy from a branch
- Branch: main
- Directory: /(root)

网页直接从 main 分支根目录发布，不需要自定义 Actions 工作流。修改后提交并推送到 main，GitHub Pages 会自动更新。

```sh
git add index.html assets
git commit -m "Update project page"
git push
```

图片或视频文件名区分大小写；HTML 中的资源路径相对仓库根目录，避免以 / 开头，以保持 GitHub 项目子路径兼容。

## Layout reference

The layout is independently implemented with inspiration from [How to Peel with a Knife](https://toruowo.github.io/peel/). This site uses the supplied in-hand assembly manuscript and does not include the reference project's research media.
