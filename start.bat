@echo off
setlocal EnableExtensions

title SAGSS // NUKE
cd /d "%~dp0"
cls
color 0C
echo.
echo  +--------------------------------------------------+
echo  ^|                 S A G S S                      ^|
echo  ^|             NUKE // DISCORD BOT                ^|
echo  ^|          COMMUNITY TOOLS  -  BOOT              ^|
echo  +--------------------------------------------------+
echo.
color 07

where py >nul 2>nul
if errorlevel 1 (
    where python >nul 2>nul
    if errorlevel 1 (
        echo [ERROR] Python no esta instalado.
        echo Instala Python desde python.org y vuelve a ejecutar este archivo.
        pause
        exit /b 1
    )
    set PYTHON_CMD=python
) else (
    set PYTHON_CMD=py
)

if not exist ".venv" (
    echo [SETUP] Creando entorno virtual...
    %PYTHON_CMD% -m venv .venv
)

call ".venv\Scripts\activate.bat"
echo [SETUP] Actualizando pip e instalando dependencias...
python -m pip install --upgrade pip
python -m pip install -r requirements.txt

if not exist ".env" (
    if exist ".env.example" (
        copy ".env.example" ".env" >nul
    ) else (
        echo [ERROR] No se encontro .env.example.
        pause
        exit /b 1
    )
)

findstr /I /C:"TU_TOKEN_DE_BOT" ".env" >nul
if not errorlevel 1 (
    echo [CONFIG] Debes reemplazar TU_TOKEN_DE_BOT en .env con tu token real.
    pause
    exit /b 1
)

findstr /R /C:"^DISCORD_TOKEN=.*[A-Za-z0-9].*" ".env" >nul
if errorlevel 1 (
    echo [CONFIG] .env no contiene un DISCORD_TOKEN valido.
    echo Abre .env y coloca tu token de bot.
    pause
    exit /b 1
)

echo.
echo [BOOT] Iniciando SAGSS NUKE...
python main.py
pause
