# PowerShell скрипт для деплоя с полной очисткой кеша
# Использование: .\deploy.ps1

Write-Host "🧹 Очистка кеша и старых файлов..." -ForegroundColor Yellow

# Удаление папки dist
if (Test-Path "dist") {
    Remove-Item -Recurse -Force "dist"
    Write-Host "✓ Папка dist удалена" -ForegroundColor Green
}

# Удаление кеша node_modules
if (Test-Path "node_modules\.cache") {
    Remove-Item -Recurse -Force "node_modules\.cache"
    Write-Host "✓ Кеш node_modules удален" -ForegroundColor Green
}

# Удаление tsconfig.tsbuildinfo
if (Test-Path "tsconfig.tsbuildinfo") {
    Remove-Item -Force "tsconfig.tsbuildinfo"
    Write-Host "✓ tsconfig.tsbuildinfo удален" -ForegroundColor Green
}

Write-Host "📦 Установка зависимостей..." -ForegroundColor Yellow
npm install

Write-Host "🔨 Сборка проекта..." -ForegroundColor Yellow
npm run build

Write-Host "✅ Деплой завершен! Запустите сервер командой: npm run start:prod" -ForegroundColor Green
Write-Host "Или используйте: npm run restart:prod для автоматического перезапуска" -ForegroundColor Cyan

