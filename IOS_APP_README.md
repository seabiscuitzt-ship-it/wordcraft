# WordCraft 变身 iOS App 指南

`vocab.html` 已经被改造成 PWA(渐进式 Web 应用),并附带一个 Capacitor 项目骨架。
有两条路可以在 iPhone 上"像 app 一样"使用它,二者可以同时拥有。

---

## 路线 A:最快 — 添加到主屏幕(PWA)

适合:**今天就想用**,无需 Mac,无需开发者账号,无需上架。

### 操作

1. **PC 端**:在 `c:\2\pythonexce` 目录下打开 PowerShell,运行:

   ```powershell
   python serve.py
   ```

   控制台会打印两个地址,例如:

   ```
   本机访问:    http://localhost:8000/vocab.html
   iPhone 访问: http://192.168.1.23:8000/vocab.html
   ```

2. **iPhone 端**:确保 iPhone 和 PC 在 **同一个 Wi-Fi**,用 Safari 打开上面 *iPhone 那行* 的地址。

3. 点击 Safari 底部的 **分享** 按钮 → **添加到主屏幕** → 确认。

4. 主屏幕上会出现 **WordCraft** 图标,点开就是 **全屏 app** 体验:
   - 没有 Safari 顶栏底栏
   - 状态栏融入暗色背景
   - 支持横竖屏(已锁竖屏可改 `manifest.webmanifest`)
   - 适配刘海 / Home Indicator 安全区

### 限制

- 只要 PC 端 `serve.py` 在运行,iPhone 就能用。**关机或换网络** 后那台 PC 不再可达。
- iOS 在纯 HTTP 下**不允许注册 Service Worker**,因此**没有 PC 时无法离线启动**(图标点开会显示"无法连接")。
- 想要"装一次,永远离线可用",走 **路线 B**。

### 让 iPhone 永远在线的简单办法

把这台 PC 当作家用"小服务器":
- 关闭 PC 自动休眠;
- `python serve.py` 改成开机自启(任务计划程序);
- 把 iPhone 上的"添加到主屏幕"指向 PC 的固定 IP(在路由器中给这台 PC 配静态 IP)。

---

## 路线 B:打包成真正的 .ipa(Capacitor + Xcode)

适合:**想要离线用、不依赖任何服务器、像 App Store 上的真应用一样**。

> 这一步必须在 **macOS** 上完成,因为只有 macOS 才能运行 Xcode 编译 iOS 应用。

### 一次性准备(macOS)

1. 安装 **Node.js 18+**(`node -v` 验证)
2. 安装 **Xcode**(App Store 搜索免费安装,体积 ~15 GB)
3. 安装 **CocoaPods**:`sudo gem install cocoapods`
4. 把整个 `c:\2\pythonexce` 文件夹拷贝到 Mac(用 U 盘 / iCloud / SMB 都行)

### 初始化 Capacitor 项目

在 Mac 终端进入项目目录:

```bash
cd 你拷贝过去的路径/capacitor
npm run init       # 等价于:npm install + sync-www + npx cap add ios
```

完成后会多出 `capacitor/ios/` 文件夹,里面是一个完整的 Xcode 项目。

### 构建 & 打开 Xcode

```bash
npm run build      # 同步最新的 vocab.html 到 ios 工程
npm run open       # 打开 Xcode
```

Xcode 打开后:

1. **配置签名**:左侧选 `App` target → 顶部 *Signing & Capabilities* → 选你的 Apple ID(免费 Apple ID 也行,7 天有效期;付费开发者账号 $99/年 可长期使用)。
2. **改 Bundle Identifier**:把 `com.wordcraft.app` 改成你自己的,例如 `com.你的名字.wordcraft`(全球唯一即可)。
3. **改 App 名称 / 图标**:`App/App/Assets.xcassets/AppIcon.appiconset` 可以替换图标(把 `icon.svg` 转成各尺寸 PNG 后拖入)。
4. **选设备**:顶部选你的 iPhone(用数据线连接,并在 iPhone 上信任此电脑;或者选模拟器先跑起来看看)。
5. **点 ▶ Run**:Xcode 会编译并安装到 iPhone。第一次安装后,要在 iPhone *设置 → 通用 → VPN 与设备管理* 里信任你自己的开发者证书。

### 以后修改了 `vocab.html` 怎么办?

每次改动 `vocab.html` 后,在 `capacitor/` 目录里:

```bash
npm run build
```

然后回到 Xcode 重新 Run 即可。

### 上架 App Store(可选)

- 付费 Apple Developer 账号 $99/年
- Xcode → *Product → Archive* → *Distribute App* → *App Store Connect*
- 在 [appstoreconnect.apple.com](https://appstoreconnect.apple.com) 提交审核

---

## 文件清单

```
c:\2\pythonexce
├── vocab.html              # 主应用(已注入 PWA + iOS meta)
├── manifest.webmanifest    # PWA 清单
├── sw.js                   # Service Worker(离线缓存)
├── icon.svg                # 主图标(用于主屏幕、PWA、Capacitor)
├── icon-maskable.svg       # Android maskable 图标
├── serve.py                # 路线 A 的本地服务器
├── IOS_APP_README.md       # 本文件
└── capacitor/              # 路线 B 的打包工程
    ├── package.json
    ├── capacitor.config.json
    ├── sync-www.js
    └── (ios/  ← 在 Mac 上跑 npm run init 后会自动生成)
```

---

## 常见问题

**Q: 我没有 Mac,怎么打包 .ipa?**
A: Capacitor / Xcode 强制要求 macOS。变通方案:
  - 借用一台 Mac 编译一次(以后改 vocab.html 也要每次重新编译);
  - 租用云 Mac(如 [MacinCloud](https://www.macincloud.com/),按小时计费);
  - 或者就用路线 A,把"添加到主屏幕"的 PWA 当 app 用,体验已经很接近。

**Q: 添加到主屏幕后,会自动锁定竖屏吗?**
A: 是的。`manifest.webmanifest` 里 `"orientation": "portrait"` 已锁。想要支持横屏,把它改成 `"any"` 或删掉即可。

**Q: 数据(已掌握的单词、自定义词库)会保留吗?**
A: 应用使用 `localStorage` 存数据,且按 origin 区分:
  - PWA 模式:绑定到那台 PC 的 IP,清缓存或换设备会丢;
  - Capacitor 模式:绑定到 app 自己,卸载才会丢。
  建议定期在应用内 *设置 → 导出数据* 备份。

**Q: 怎么改图标?**
A: 编辑 `icon.svg`(SVG 矢量,任意编辑器或 Figma / Illustrator 都行),
然后:
  - 路线 A:刷新主屏幕图标(可能需要重新"添加到主屏幕");
  - 路线 B:在 capacitor 目录跑 `npm run build`,然后用 [appicon.co](https://appicon.co) 等工具把 SVG 转成 PNG 套件,替换 Xcode 工程里的 `AppIcon.appiconset`。
