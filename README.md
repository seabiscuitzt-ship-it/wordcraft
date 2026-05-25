# WordCraft · 背单词 PWA

一个**单文件**(零依赖、零后端)的英语背单词网页应用,支持闪卡 / 听写 / 选择三种模式,
内置剑桥少儿 L1-L5、YLE Starters/Movers/Flyers、人教 PEP 三上~六下、CET4 等约 **1400+ 单词**,
每词带音标、词性、中文释义、英文例句、中文例句翻译。

## 在线试用

> 部署到 GitHub Pages 后,在浏览器(尤其是 iPhone Safari)中打开:
>
> `https://<你的用户名>.github.io/<仓库名>/vocab.html`
>
> Safari 底部 **分享 → 添加到主屏幕** 即可全屏 app 体验,SW 缓存后可完全离线使用。

## 特性

- 三种学习模式:闪卡 / 听写 / 选择题
- 离线 TTS 朗读(浏览器原生 Web Speech API)
- 自定义词库 + JSON 导入导出
- 学习进度持久化(localStorage)
- 暗色 / 亮色主题
- iOS 全屏 PWA(添加到主屏幕)
- 适配刘海 / Home Indicator

## 文件结构

```
vocab.html              # 主应用(单文件,HTML+CSS+JS 全在里头)
manifest.webmanifest    # PWA 清单
sw.js                   # Service Worker 离线缓存
icon.svg                # 主图标
icon-maskable.svg       # Android maskable 图标
serve.py                # 本地局域网调试服务器(可选)
capacitor/              # 打包为 iOS .ipa 的工程骨架(可选)
IOS_APP_README.md       # 在 iPhone 上作为 app 使用的完整指南
```

## License

MIT
