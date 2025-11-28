# 📦 APK 打包指南

## 🎯 打包方式选择

### **方法一：EAS Build（推荐）**
- ✅ **优点**：官方推荐，简单快捷，云端构建
- ✅ **缺点**：需要 Expo 账号，免费版每月有构建次数限制
- ✅ **适合**：大多数用户，快速发布测试

### **方法二：Expo Classic Build（已过时）**
- ⚠️ 不推荐，Expo 已弃用

### **方法三：本地构建**
- ✅ **优点**：无限制，完全控制
- ❌ **缺点**：需要配置 Android Studio 和环境
- ✅ **适合**：有经验的开发者

---

## 🚀 方法一：使用 EAS Build（推荐）

### **第一步：安装 EAS CLI**

```bash
npm install -g eas-cli
```

### **第二步：登录 Expo 账号**

```bash
eas login
```

**如果没有账号：**
1. 访问 https://expo.dev/signup
2. 注册一个免费账号
3. 回到终端运行 `eas login`
4. 输入邮箱和密码

### **第三步：配置项目**

```bash
cd c:/test/psw
eas build:configure
```

这会：
- ✅ 生成/更新 `eas.json` 文件
- ✅ 创建项目 ID
- ✅ 自动配置构建设置

### **第四步：构建 APK**

#### **构建预览版 APK（测试用）**

```bash
eas build --platform android --profile preview
```

#### **构建生产版 APK**

```bash
eas build --platform android --profile production
```

### **第五步：等待构建完成**

- ⏱️ 构建时间：约 10-20 分钟
- 📊 可以在浏览器查看进度：https://expo.dev/accounts/[your-username]/projects/psw-app/builds
- 🔔 构建完成后会收到邮件通知

### **第六步：下载 APK**

构建完成后：
1. 终端会显示下载链接
2. 或访问 https://expo.dev 查看构建历史
3. 点击下载 APK 文件
4. 传输到 Android 手机安装

---

## 📱 安装 APK 到 Android 手机

### **方法一：直接在手机下载**

1. 在手机浏览器打开 EAS 提供的下载链接
2. 下载 APK 文件
3. 点击安装（需要允许未知来源）

### **方法二：通过电脑传输**

1. 下载 APK 到电脑
2. 用数据线连接手机
3. 将 APK 复制到手机
4. 在手机上找到 APK 文件并安装

### **方法三：通过二维码**

1. EAS 构建完成后会生成二维码
2. 用手机扫描二维码
3. 直接下载安装

---

## 🔧 故障排除

### **问题 1：构建失败 - "Invalid credentials"**

**解决方案：**
```bash
# 重新登录
eas logout
eas login
```

### **问题 2：构建失败 - "Missing package.json fields"**

**解决方案：**
- 确保 `app.json` 中有 `android.package` 和 `version`
- 已在本项目中配置好

### **问题 3：构建失败 - "Firebase configuration error"**

**解决方案：**
- 确保 Firebase 配置正确
- 检查 `config/firebaseConfig.js`

### **问题 4：免费构建次数用完**

**解决方案：**
- 免费版每月有构建次数限制
- 升级到付费版：https://expo.dev/pricing
- 或使用本地构建

---

## 💰 EAS Build 定价

### **免费版（Hobby）**
- ✅ 每月 30 次构建
- ✅ 适合个人项目
- ✅ 基础功能完整

### **付费版（Production）**
- 💵 $29/月起
- ✅ 无限构建
- ✅ 优先队列
- ✅ 更快构建速度

对于你的密码管家项目，**免费版完全够用**！

---

## 📋 完整命令流程

```bash
# 1. 安装 EAS CLI
npm install -g eas-cli

# 2. 登录
eas login

# 3. 配置项目
cd c:/test/psw
eas build:configure

# 4. 构建 APK（预览版）
eas build --platform android --profile preview

# 5. 等待构建完成（10-20分钟）
# 构建完成后会显示下载链接

# 6. 下载并安装到手机
```

---

## 🎨 自定义图标和启动画面（可选）

如果想要自定义应用图标：

### **1. 准备图标文件**

创建以下文件：
- `assets/icon.png` - 1024x1024 像素
- `assets/splash.png` - 2048x2048 像素

### **2. 更新 app.json**

```json
{
  "expo": {
    "icon": "./assets/icon.png",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#667eea"
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#667eea"
      }
    }
  }
}
```

### **3. 重新构建**

```bash
eas build --platform android --profile preview
```

---

## 🔒 应用签名（生产发布）

### **自动管理（推荐）**

EAS 会自动为你生成和管理签名密钥：

```bash
eas build --platform android --profile production
```

### **手动管理**

如果需要自己的签名密钥：

```bash
# 生成密钥
keytool -genkeypair -v -storetype PKCS12 -keystore my-upload-key.keystore -alias my-key-alias -keyalg RSA -keysize 2048 -validity 10000

# 配置 eas.json
{
  "build": {
    "production": {
      "android": {
        "buildType": "apk",
        "credentialsSource": "local"
      }
    }
  }
}
```

---

## 📊 构建配置说明

### **eas.json 配置文件**

```json
{
  "build": {
    "preview": {
      "distribution": "internal",  // 内部分发
      "android": {
        "buildType": "apk"         // 构建 APK
      }
    },
    "production": {
      "android": {
        "buildType": "app-bundle"  // 构建 AAB（用于 Play Store）
      }
    }
  }
}
```

### **构建类型说明**

| 类型 | 文件格式 | 用途 |
|-----|---------|------|
| **preview** | APK | 测试分发，直接安装 |
| **production** | AAB | 上传到 Google Play Store |

---

## 🎯 推荐工作流程

### **开发阶段**
```bash
npm start  # 使用 Expo Go 测试
```

### **测试阶段**
```bash
eas build --platform android --profile preview  # 构建 APK 测试
```

### **发布阶段**
```bash
eas build --platform android --profile production  # 构建 AAB 上传商店
eas submit --platform android  # 自动提交到 Play Store
```

---

## 📱 最终产物

构建成功后你会得到：

- 📦 **APK 文件**：`app-release.apk`（约 50-80 MB）
- 🔗 **下载链接**：有效期 30 天
- 📊 **构建报告**：包含版本信息、依赖等

---

## ✨ 快速开始（5 分钟）

```bash
# 1. 安装 CLI
npm install -g eas-cli

# 2. 登录（如果没账号先注册）
eas login

# 3. 构建
cd c:/test/psw
eas build --platform android --profile preview

# 4. 等待并下载
# 完成后复制链接到手机浏览器下载安装
```

---

## 🎉 恭喜！

完成以上步骤后，你就拥有了一个可以独立安装的 APK 文件！

**分享给朋友：**
1. 发送 APK 文件
2. 或分享 EAS 下载链接
3. 在手机上安装即可使用

**注意事项：**
- ⚠️ 首次安装需要允许"未知来源"
- ⚠️ APK 未签名需要在设置中允许
- ✅ 安装后可以正常使用所有功能

---

## 📞 需要帮助？

如果遇到问题：
1. 查看 EAS 文档：https://docs.expo.dev/build/introduction/
2. Expo 论坛：https://forums.expo.dev/
3. 告诉我具体错误信息，我会帮你解决！

**现在就开始构建你的第一个 APK 吧！** 🚀✨
