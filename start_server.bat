@echo off
echo Iniciando Payo Backend Server...
cd /d D:\Projects\payo\backend
call venv\Scripts\activate.bat
python -c "
from app.main import app
import uvicorn
print('🚀 Payo Backend Server iniciándose...')
print('📍 URL: http://127.0.0.1:8070')
print('📊 Health check: http://127.0.0.1:8070/health')
print('📋 API Docs: http://127.0.0.1:8070/docs')
print('')
uvicorn.run(app, host='127.0.0.1', port=8070, log_level='info')
"
pause
