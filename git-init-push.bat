@echo off
REM 在 extensions/cocos-copilot 目录下执行，或 cd 到该目录后运行此脚本
cd /d "%~dp0"

git init
git add .
git commit -m "first commit"
git branch -M main
git remote add origin https://github.com/JlikSenior/cocos-copilot.git
git push -u origin main

pause
