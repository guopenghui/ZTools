import { describe, expect, it } from 'vitest'
import {
  ALL_PROVIDER_TYPES,
  BUILTIN_PROVIDER_PREFIX,
  buildBuiltinProviderId,
  buildPluginProviderId,
  normalizeProviderSettings
} from '@shared/providerShared'

describe('providerShared', () => {
  describe('buildPluginProviderId', () => {
    it('builds a stable id from plugin name and type', () => {
      expect(buildPluginProviderId('my-plugin', 'translation')).toBe('plugin:my-plugin:translation')
      expect(buildPluginProviderId('ocr-x', 'ocr')).toBe('plugin:ocr-x:ocr')
    })
  })

  describe('buildBuiltinProviderId', () => {
    it('prefixes the name with the builtin marker', () => {
      const id = buildBuiltinProviderId('bergamot')
      expect(id).toBe(`${BUILTIN_PROVIDER_PREFIX}bergamot`)
      expect(id.startsWith(BUILTIN_PROVIDER_PREFIX)).toBe(true)
    })
  })

  describe('normalizeProviderSettings', () => {
    it('returns an empty structure for non-object input', () => {
      const result = normalizeProviderSettings(null)
      expect(result).toEqual({ enabled: {}, defaultId: {}, params: {} })
      expect(normalizeProviderSettings(undefined)).toEqual({
        enabled: {},
        defaultId: {},
        params: {}
      })
      expect(normalizeProviderSettings('string')).toEqual({
        enabled: {},
        defaultId: {},
        params: {}
      })
    })

    it('preserves provided enabled / defaultId / params', () => {
      const input = {
        enabled: { translation: ['plugin:a:translation'] },
        defaultId: { ocr: 'plugin:b:ocr' },
        params: { 'plugin:a:translation': { key: 'secret' } }
      }
      const result = normalizeProviderSettings(input)
      expect(result.enabled.translation).toEqual(['plugin:a:translation'])
      expect(result.defaultId.ocr).toBe('plugin:b:ocr')
      expect(result.params['plugin:a:translation']).toEqual({ key: 'secret' })
    })

    it('does not mutate the original input object', () => {
      const input = { enabled: { translation: ['x'] } }
      const result = normalizeProviderSettings(input)
      result.enabled.translation!.push('y')
      // 原始输入不应被影响（深拷贝语义）
      expect(input.enabled.translation).toEqual(['x'])
    })
  })

  describe('ALL_PROVIDER_TYPES', () => {
    it('includes translation and ocr', () => {
      expect(ALL_PROVIDER_TYPES).toContain('translation')
      expect(ALL_PROVIDER_TYPES).toContain('ocr')
      expect(ALL_PROVIDER_TYPES).not.toContain('ai')
    })
  })
})
