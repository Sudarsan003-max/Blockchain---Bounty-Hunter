# Bug Bounty Platform - PowerShell Startup Script

Write-Host "========================================" -ForegroundColor Cyan
Write-Host " Bug Bounty Platform - Starting All Services" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "[1/3] Starting Blockchain Node..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd blockchain; npx hardhat node"
Start-Sleep -Seconds 3

Write-Host "[2/3] Starting Backend API..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd backend; python run.py"
Start-Sleep -Seconds 3

Write-Host "[3/3] Starting Frontend..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd frontend; npm start"
Start-Sleep -Seconds 3

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host " All Services Started!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Frontend:     http://localhost:3000" -ForegroundColor Magenta
Write-Host "Backend API:  http://localhost:5000" -ForegroundColor Magenta
Write-Host "Blockchain:   http://localhost:8545" -ForegroundColor Magenta
Write-Host ""
Write-Host "Press any key to exit..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")


