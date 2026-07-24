#!/bin/bash
# Watchdog que mantiene EducaPlay corriendo
# Se ejecuta en background y reinicia los servicios si se caen

LOG=/home/z/my-project/watchdog.log
echo "[$(date)] Watchdog iniciado" > $LOG

while true; do
  # Verificar frontend
  FE=$(curl -s -o /dev/null -w "%{http_code}" --max-time 3 http://127.0.0.1:3000/ 2>/dev/null)
  # Verificar backend
  BE=$(curl -s -o /dev/null -w "%{http_code}" --max-time 3 http://127.0.0.1:3001/api 2>/dev/null)

  echo "[$(date)] FE=$FE BE=$BE" >> $LOG

  # Si el frontend no responde, reiniciarlo
  if [ "$FE" != "200" ] && [ "$FE" != "307" ]; then
    echo "[$(date)] Frontend caído (HTTP $FE), reiniciando..." >> $LOG
    pkill -9 -f "next dev" 2>/dev/null
    sleep 2
    cd /home/z/my-project
    setsid nohup bun node_modules/.bin/next dev -p 3000 >> /home/z/my-project/dev.log 2>&1 &
    disown
    sleep 8
  fi

  # Si el backend no responde, reiniciarlo
  if [ "$BE" = "000" ] || [ "$BE" = "" ]; then
    echo "[$(date)] Backend caído (HTTP $BE), reiniciando..." >> $LOG
    pkill -9 -f "node dist/src/main" 2>/dev/null
    sleep 2
    cd /home/z/my-project/Proyecto-De-Modalidad/backend
    setsid nohup node dist/src/main.js >> /tmp/backend.log 2>&1 &
    disown
    sleep 5
  fi

  sleep 10
done
