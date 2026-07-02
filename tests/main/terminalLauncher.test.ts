import { describe, it, expect } from 'vitest'
import {
  getPresetOptions,
  resolvePreset,
  applyPathToArgs,
  parseCustomCommand
} from '../../src/main/utils/terminalLauncher'

// ========== getPresetOptions ==========

describe('getPresetOptions', () => {
  it('macOS 含 系统默认/Ghostty/iTerm2/自定义', () => {
    const opts = getPresetOptions('darwin')
    expect(opts.map((o) => o.value)).toEqual(['default', 'ghostty', 'iterm2', 'custom'])
  })

  it('Linux 含 系统默认/gnome-terminal/konsole/xterm/自定义', () => {
    const opts = getPresetOptions('linux')
    expect(opts.map((o) => o.value)).toEqual([
      'default',
      'gnome-terminal',
      'konsole',
      'xterm',
      'custom'
    ])
  })

  it('Windows 含 系统默认/wt/powershell/cmd/自定义', () => {
    const opts = getPresetOptions('win32')
    expect(opts.map((o) => o.value)).toEqual(['default', 'wt', 'powershell', 'cmd', 'custom'])
  })

  it('未知平台返回空数组', () => {
    expect(getPresetOptions('freebsd')).toEqual([])
  })
})

// ========== resolvePreset ==========

describe('resolvePreset', () => {
  it('空值返回默认预设', () => {
    expect(resolvePreset(undefined, 'darwin')?.id).toBe('default')
  })

  it('custom 返回 null', () => {
    expect(resolvePreset('custom', 'darwin')).toBeNull()
  })

  it('有效 id 返回对应预设', () => {
    expect(resolvePreset('ghostty', 'darwin')?.id).toBe('ghostty')
  })

  it('无效 id 回退默认', () => {
    expect(resolvePreset('nonexistent', 'darwin')?.id).toBe('default')
  })

  it('id 在当前平台不存在时回退默认', () => {
    expect(resolvePreset('ghostty', 'win32')?.id).toBe('default')
  })
})

// ========== applyPathToArgs ==========

describe('applyPathToArgs', () => {
  it('替换 {path} 占位符', () => {
    expect(applyPathToArgs(['--working-directory={path}'], '/Users/x')).toEqual([
      '--working-directory=/Users/x'
    ])
  })

  it('多个占位符都替换', () => {
    expect(applyPathToArgs(['{path}', 'cd {path}'], '/p')).toEqual(['/p', 'cd /p'])
  })

  it('无占位符保持不变', () => {
    expect(applyPathToArgs(['-la'], '/p')).toEqual(['-la'])
  })
})

// ========== parseCustomCommand ==========

describe('parseCustomCommand', () => {
  it('解析命令与参数', () => {
    expect(parseCustomCommand('alacritty --working-directory={path}')).toEqual({
      command: 'alacritty',
      args: ['--working-directory={path}']
    })
  })

  it('处理引号包裹的参数（去除引号）', () => {
    expect(parseCustomCommand('open -na "Ghostty.app"')).toEqual({
      command: 'open',
      args: ['-na', 'Ghostty.app']
    })
  })

  it('空字符串/纯空白返回 null', () => {
    expect(parseCustomCommand('')).toBeNull()
    expect(parseCustomCommand('   ')).toBeNull()
  })
})
