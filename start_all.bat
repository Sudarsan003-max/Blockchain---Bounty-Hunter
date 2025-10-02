@echo off
echo ========================================
echo  Bug Bounty Platform - Starting All Services
echo ========================================
echo.

echo [1/3] Starting Blockchain Node...
start "Blockchain Node" cmd /k "cd blockchain && npx hardhat node"
timeout /t 3 /nobreak > nul

echo [2/3] Starting Backend API...
start "Backend API" cmd /k "cd backend && python run.py"
timeout /t 3 /nobreak > nul

echo [3/3] Starting Frontend...
start "Frontend" cmd /k "cd frontend && npm start"
timeout /t 3 /nobreak > nul

echo.
echo ========================================
echo  All Services Started!
echo ========================================
echo.
echo Frontend:     http://localhost:3000
echo Backend API:  http://localhost:5000
echo Blockchain:   http://localhost:8545
echo.
echo Press any key to exit...
pause > nul
