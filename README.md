# 🔐 密码生成器

> 100 项目挑战 · 项目 #004 · 方案由 Andy 自己撰写（Day 4 练习）

本地生成随机密码：长度 6–32 可调，小写/大写/数字/符号四组开关自由组合，一键复制（含 file:// 环境降级方案）。纯前端实现，密码不经任何网络传输。

## 文件结构

```
password-generator/
├── index.html   页面结构
├── style.css    样式
└── script.js    逻辑（crypto 安全随机 + 剪贴板 API）
```

## 技术点

- **crypto.getRandomValues**：安全随机数（密码场景不用 Math.random）
- **每组保底一字符 + Fisher-Yates 洗牌**：勾选的类型一定出现，且位置随机
- **剪贴板主备方案**：navigator.clipboard 失败时降级 execCommand

## 本地预览

双击 `index.html` 即可。

## 在线地址

https://liuandi-dev.github.io/password-generator/
