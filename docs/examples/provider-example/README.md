# Provider 示例插件

这是一个最小可参考的 provider 插件骨架，演示如何通过 `providers` 声明 + `ztools.registerProvider` 接入「翻译」与「OCR」能力。

> 此目录为文档示例，handler 使用 mock 实现，不可作为正式插件直接安装运行。真实接入请参考 `docs/provider-development-guide.md` 替换 handler 逻辑。

## 文件说明

- `plugin.json` —— 声明了 `providers.translation` 与 `providers.ocr`。
- `preload.js` —— 调用 `ztools.registerProvider` 注册两个 provider 的 mock 实现。

## 接入后会怎样

安装声明了 `providers` 的插件后：

1. 「设置 → 提供商」的「翻译」「OCR」tab 会自动列出该 provider。
2. 用户可启用 / 设为默认。
3. 消费方（如超级面板选中翻译）调用 `providerManager.invoke(type, input)` 时会路由到默认 provider。
