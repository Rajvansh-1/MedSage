@echo off
echo ===================================================
echo     MedGemma Copilot - Local Edge Setup Script
echo ===================================================
echo.
echo Step 1: Downloading the base Gemma model (gemma:2b)...
ollama pull gemma:2b

echo.
echo Step 2: Injecting Clinical Triage System Prompt (Creating medgemma-copilot)...
cd %~dp0
ollama create medgemma-copilot -f Modelfile

echo.
echo Step 3 (Optional): Do you want to download the Vision model for X-Rays?
echo Note: The 'llava' model is ~4.7GB. If you skip this, vision analysis will throw an error in the UI.
set /p download_vision="Download Vision Model (Y/N)? "
if /I "%download_vision%"=="Y" (
    echo Downloading Llava...
    ollama pull llava
)

echo.
echo ===================================================
echo SETUP COMPLETE!
echo You can now run 'python local_triage.py' to start the backend.
echo ===================================================
pause
