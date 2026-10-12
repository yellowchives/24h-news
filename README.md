# 24小时要闻（Vue 3）

原 `index.html`（单文件 934 行，样式 + 原生 JS 全内联）重构为 Vue 3 + Vite + TypeScript 项目。
旧文件保留在 [`legacy/index.html`](legacy/index.html)，确认新版无误后可删除。

## 开发

```bash
pnpm install   # 或 npm install
pnpm dev       # 启动开发服务器
```

## 构建

```bash
pnpm build     # vue-tsc 类型检查 + vite build，产物在 dist/
pnpm preview   # 预览构建结果
```

`vite.config.ts` 里 `base: './'`，`dist/` 可部署到任意子目录，直接用静态服务器托管即可。

## 目录结构

```
src/
├─ App.vue                    # 页面骨架：顶栏 + 栏目 + 资讯流 + 榜单
├─ main.ts                    # 入口
├─ config.ts                  # 频道、分页、刷新间隔、配色等常量
├─ types.ts                   # NewsItem 等数据类型
├─ assets/main.css            # 全局样式（原 <style> 抽出）
├─ components/
│  ├─ TopBar.vue              # 顶栏：品牌 + 自动刷新倒计时 + 手动刷新
│  ├─ ChannelChips.vue        # 栏目筛选（多选，至少保留一个）
│  ├─ NewsFeed.vue            # 资讯流列表 + 加载更多
│  └─ RankList.vue            # 最热要闻排行
├─ composables/useNewsFeed.ts # 共享状态与业务逻辑（列表、筛选、倒计时、刷新）
├─ services/news.ts           # 频道脚本拉取（跨域 GBK）、去重排序
└─ utils/format.ts            # 时间格式化 / 排序键
```

## 行为说明

- 数据源是同花顺公开频道脚本（`https://stock.10jqka.com.cn/thsgd/<频道>.js`），跨域且为 GBK 编码，
  只能用 `<script>` 注入方式加载，故保留在 `services/news.ts` 中。
- 走 https 是必须的：GitHub Pages 是 https，若用 http 数据源会被浏览器按混合内容拦截。
- 60 秒自动刷新，切换栏目或点「立即刷新」会重置倒计时并重新拉取；拉取做了串行化，
  进行中再触发会排队补拉一次。
- 单条失败不报错，只有全部频道失败才提示「拉取失败」；5 秒超时后先用已拿到的数据渲染。
