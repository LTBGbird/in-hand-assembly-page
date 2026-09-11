# Assembling Two Parts in One Hand

英文静态项目主页。沉浸式视频封面、七个独立实验播放器，以及一段完整成功率测试；无需 npm、后端或构建步骤。

## 本地预览

在项目目录运行：

```sh
python3 -m http.server 8000 --bind 127.0.0.1
```

访问 http://127.0.0.1:8000/ 。

为了检查 GitHub Pages 的子路径，本轮预览服务器从父目录启动，地址是：
http://127.0.0.1:8000/in-hand-assembly-page/

线上地址：https://ltbgbird.github.io/in-hand-assembly-page/ 。GitHub Pages 从 `main` 分支根目录自动发布；本地检查完成后，提交并推送到 `origin/main`，等待仓库 Actions 中的 `pages build and deployment` 成功即可更新网站。`.nojekyll` 保证静态资源直接发布，无需构建步骤。

## 内容与署名

- `index.html`：英文文案、七项实验、完整成功率测试、论文图、结果表、链接。
- `assets/style.css`：封面、灰白黄配色和响应式布局。
- `assets/main.js`：视频按需加载、离屏暂停、封面播放控制及导航高亮。
- `assets/papers/paper.pdf`：最终版 `2609.10137v1.pdf` 的原样副本。

作者和单位依据项目父目录中的 `2609.10137v1.pdf` 第 1 页填写：Liuao Pei、Tianyue Wu、Hui Zhang、Ping Luo、Jie Song，保留原文顺序、单位编号、共同一作及通讯作者标记。前两位作者按字母顺序排列。

修改署名时，在 `index.html` 搜索 `data-paper-authors`；`.author-list` 管理姓名和上标，`.author-affiliations` 管理完整单位名称，`.author-notes` 管理贡献说明，同时同步页面的 `author` 元数据。已预留的引用区域仍隐藏；填写 `#citation [data-bibtex]` 后可移除 `#citation` 的 `hidden`。作者主页或正式资源链接应使用经过确认的地址。

除 Liuao Pei 外，其余姓名已链接到个人主页：[Tianyue Wu](https://tianyueh8erobot.github.io/)、[Hui Zhang](https://zdchan.github.io/)、[Ping Luo](https://luoping.me/)、[Jie Song](https://facultyprofiles.hkust-gz.edu.cn/faculty-personal-page/SONG-Jie/jsongroas)。封面的 `Code (before November)` 按钮指向待开源仓库 https://github.com/LTBGbird/in-hand-assembly ，计划于 2026 年 11 月前发布三项组装任务的仿真训练代码及真实部署代码。代码公开后在 `.hero-actions` 中更新按钮标签。

封面的 `arXiv` 按钮链接到 https://arxiv.org/abs/2609.10137 。`Paper PDF` 与页脚的论文链接均使用 `assets/papers/paper.pdf?v=2609.10137v1`；以后替换 PDF 时同步更新这两处版本参数，避免浏览器继续使用旧文件缓存。

论文标题、摘要和 Table 1 已核对。页面中的方法图来自 Figure 2、Figure 3，手型比较来自 Figure 4。新论文稿应同步更新网页内容和 PDF。封面标题上方仅显示 `Accepted at CoRL 2026` 黄色标签，网页简介和分享摘要同步包含录用信息。

## 视频维护

所有视频使用 H.264 / yuv420p MP4，包含 faststart 信息。正文保留原音轨，默认静音；封面不含音轨。正文默认由访客启动播放，离屏暂停，播放一个实验时会暂停其他实验。

播放器的两个属性都在 `index.html` 中：

```html
<video controls playsinline muted loop preload="none"
  data-video="assets/videos/bottle.mp4"
  data-poster="assets/images/bottle.jpg"
  aria-label="Bottle-cap assembly"></video>
```

替换同名文件即可更新媒体；修改文件名时同步修改这两个属性、视频出错时的直接链接和无 JavaScript 的链接。没有 JavaScript 时显示直接视频链接。正文视频保持完整 16:9 画幅，封面背景才使用填充裁切。

七段实验以 `main 0604 3.mp4` 为来源，切点按 25 fps 逐帧确认。结束帧不包含在导出中：

| 实验 / 文件名 | 原成片起止时间（秒） | 帧范围 | 时长 |
| --- | --- | --- | --- |
| Bottle / bottle.mp4 | 9.40–28.96 | [235, 724) | 19.56 s |
| Syringe / syringe.mp4 | 28.96–48.64 | [724, 1216) | 19.68 s |
| Marker / marker.mp4 | 48.64–66.28 | [1216, 1657) | 17.64 s |
| Bottle recovery / bottle-recovery.mp4 | 66.28–96.04 | [1657, 2401) | 29.76 s |
| Syringe recovery / syringe-recovery.mp4 | 96.04–124.72 | [2401, 3118) | 28.68 s |
| Bottle tilt / bottle-tilt.mp4 | 124.72–145.32 | [3118, 3633) | 20.60 s |
| Syringe tilt / syringe-tilt.mp4 | 145.40–174.92 | [3635, 4373) | 29.52 s |

保留同一实验内的单次演示和并列多次试验；去掉原成片开头的综合预告、145.32–145.40 秒的两帧黑场及片尾黑场。

结果表后展示 `Uncut Full Success Rate Test`，来源为 `main 0604 2.mp4` 的 180.52–289.40 秒，25 fps 帧范围 `[4513, 7235)`，时长 108.88 秒。输出为 `uncut-success-rate-test.mp4` 和同名 JPG，静态封面取片段第 2 秒。保留三路并列画面、原有播放速度、标题动画、全部试验、重置和计数，仅去掉上一实验、分界处的一帧黑场及片尾纯黑帧。该长视频不循环播放，沿用按需加载和离屏暂停。

录像末尾原字幕为 Bottle 14/20、Syringe 19/20、Marker 16/20；与论文表格不一致，网页在视频下方说明差异，保留两份来源的原始数值。

封面使用项目父目录中的 `cover_v0910.mp4`，保留完整剪辑（视频画面 16.20 秒），转为 H.264 静音循环播放。静态封面取第 1 秒。手机封面会裁切背景以适配竖屏，正文播放器始终显示完整实验画面。

机器可读的素材来源、切点和输出路径记录在 `assets/media-manifest.json`。原始影片与 DaVinci 工程不修改。

## 重新导出

仅媒体处理需要 Python、Pillow、pypdf 和 FFmpeg；运行网站本身不需要这些依赖。

```sh
python3 scripts/prepare_media.py --ffmpeg /path/to/ffmpeg
```

可用 `--source`、`--paper`、`--hero-source` 指定其他素材位置。只重新导出封面：

```sh
python3 scripts/prepare_media.py --ffmpeg /path/to/ffmpeg --only-hero
```

仅重新导出完整成功率测试（可用 `--success-test-source` 指定该成片的位置）：

```sh
python3 scripts/prepare_media.py --ffmpeg /path/to/ffmpeg --only-success-test
```

脚本在 `assets/videos/`、`assets/images/` 中生成网页文件，并更新素材清单。视频时长变化后同步更新播放器下方的时长说明。

## 发布前检查

- 检查 1440px 桌面、768px 平板和 390px 手机布局。
- 八个正文播放器可独立播放、拖动进度及全屏；切点不含其他实验。
- 滚动时暂停离屏视频；手动暂停封面后返回封面不会自行播放。
- 减少动态效果或节省流量偏好下，封面默认显示图片，仍可手动启动。
- 自动播放被拦截时显示封面和播放按钮；媒体损坏时提供直接视频链接。
- 图像可点击打开原尺寸；结果表在窄屏内部横向滚动。
- PDF、图像、视频无失效链接，控制台无错误。

所有内部资源路径都相对于项目目录，不以 `/` 开头，以兼容 GitHub Pages 项目子路径。

## Layout history

The original page credited [How to Peel with a Knife](https://toruowo.github.io/peel/) as a layout reference. This revision uses an independently implemented video-led layout and only the supplied research media.
