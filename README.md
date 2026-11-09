# 阡陌 · PS Vita 部分移植作品展

作品导航首页与各移植项目的独立宣传站。

| 路径 | 内容 |
| --- | --- |
| `index.html`、`hub.css` | 公共作品导航 |
| `mofa-vita/` | 魔法使之夜的网页、图片、脚本与项目文档 |
| `tsik-vita/` | 原有作品占位目录，保留待完善 |
| `.github/workflows/pages.yml` | 统一 GitHub Pages 部署 |
| `scripts/build_site.py` | 生成纯静态部署目录 |

每部作品的文件必须留在自己的目录。根目录只放公共导航、部署工具与仓库说明。新增作品时创建独立目录和 `index.html`，再更新导航；构建脚本自动收录有首页的作品目录，不发布占位目录和技术文档。

本地预览：在根目录运行 `python -m http.server 4174 --bind 127.0.0.1`，打开 `http://127.0.0.1:4174/`。

Pages 使用 **GitHub Actions** 作为发布来源。推送 `main` 后自动构建、上传静态文件并部署，也可手动运行 workflow。构建输出 `_site/` 已忽略，不提交 Git。

- 作品导航：https://atspwang618.github.io/myvita.github.io/
- 魔法使之夜：https://atspwang618.github.io/myvita.github.io/mofa-vita/

项目站点部署在 `/myvita.github.io/` 子路径下。内部导航使用相对路径；更换域名时同时更新各项目的分享图片地址。


导航首页与魔夜宣传页支持中文 / English 即时切换，默认中文并保存访客的语言选择。公共切换逻辑在 `language.js`，首页译文在 `hub-i18n.js`，魔夜译文与循环 BGM 均保存在 `mofa-vita/`。构建脚本包含这些静态文件；没有新增运行时服务或框架。
