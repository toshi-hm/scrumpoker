import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { includeIgnoreFile } from '@eslint/compat'
import importPlugin from 'eslint-plugin-import'
import eslintConfigPrettier from 'eslint-config-prettier'
import eslintPluginPrettierRccommended from 'eslint-plugin-prettier/recommended'
import pluginVue from 'eslint-plugin-vue'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const gitignorePath = path.resolve(__dirname, '.gitignore')

export default [
    includeIgnoreFile(gitignorePath),
    ...pluginVue.configs['flat/recommended'],
    eslintConfigPrettier,
    eslintPluginPrettierRccommended,
    importPlugin.flatConfigs.recommended
]
