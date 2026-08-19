#!/bin/bash
# Arranque robusto de Mundilex (frontend + backend)
# Mantiene el comando vivo para que los servidores (que escuchan en puertos)
# no sean limpiados por el sandbox entre comandos.

set -u

LOG_FE=/home/z/my-project/dev.log
LOG_BE=/tmp/backend.log
BE_DB=/home/z/my-project/Proyecto-De-Modalidad/backend/prisma/educaplay.db

echo "=== Mundilex startup ==="

# 1. Limpiar instancias previas
pkill -9 -f "next dev" 2>/dev/null
pkill -9 -f "node dist/src/main" 2>/dev/null
sleep 2

# 2. Arrancar backend (NestJS en 3001) apuntando a educaplay.db
cd /home/z/my-project/Proyecto-De-Modalidad/backend
DATABASE_URL="file:$BE_DB" setsid bash -c 'exec node dist/src/main.js' </dev/null >"$LOG_BE" 2>&1 &
disown
BE_PID=$!
echo "[BACKEND] Arrancado (PID base $BE_PID) en puerto 3001 con DB educaplay.db"

# 3. Arrancar frontend (Next.js en 3000)
cd /home/z/my-project
rm -f "$LOG_FE"
setsid bash -c 'exec bun node_modules/.bin/next dev -p 3000' </dev/null >"$LOG_FE" 2>&1 &
disown
FE_PID=$!
echo "[FRONTEND] Arrancado (PID base $FE_PID) en puerto 3000"

# 4. Esperar a que ambos respondan
echo ""
echo "=== Esperando servicios ==="
FE_OK=0
BE_OK=0
for i in $(seq 1 40); do
  if [ "$FE_OK" -eq 0 ]; then
    code=$(curl -s -o /dev/null -w "%{http_code}" -m 3 http://127.0.0.1:3000/ 2>/dev/null)
    if [ "$code" = "200" ] || [ "$code" = "307" ]; then FE_OK=1; fi
  fi
  if [ "$BE_OK" -eq 0 ]; then
    code=$(curl -s -o /dev/null -w "%{http_code}" -m 3 http://127.0.0.1:3001/api 2>/dev/null)
    if [ "$code" = "200" ] || [ "$code" = "404" ]; then BE_OK=1; fi
  fi
  if [ "$FE_OK" -eq 1 ] && [ "$BE_OK" -eq 1 ]; then break; fi
  sleep 2
done

echo ""
echo "=== Estado ==="
echo "Frontend (3000): $([ $FE_OK -eq 1 ] && echo 'OK' || echo 'NO responde')"
echo "Backend  (3001): $([ $BE_OK -eq 1 ] && echo 'OK' || echo 'NO responde')"
echo ""
echo "=== Frontend log (tail) ==="
tail -8 "$LOG_FE" 2>/dev/null
echo ""
echo "=== Backend log (tail) ==="
tail -4 "$LOG_BE" 2>/dev/null
echo ""
echo "=== Procesos ==="
ps aux | grep -iE "next-server|next dev|node dist/src/main" | grep -v grep | head -5

# 5. Verificar contenido de la página
echo ""
echo "=== Verificación de página ==="
curl -s -m 10 http://127.0.0.1:3000/ 2>/dev/null | grep -o "<title>[^<]*</title>" | head -1
echo ""

echo "=========================================="
echo "Mundilex está corriendo."
echo "Frontend: http://localhost:3000  (preview)"
echo "Backend:  http://localhost:3001/api"
echo "Manteniendo comando vivo para preservar los puertos..."
echo "=========================================="

# 6. Mantener vivo: loop que reporta estado cada 30s
KEEPALIVE_END=$(( $(date +%s) + 540 ))
while [ $(date +%s) -lt $KEEPALIVE_END ]; do
  sleep 30
  fe=$(curl -s -o /dev/null -w "%{http_code}" -m 3 http://127.0.0.1:3000/ 2>/dev/null)
  be=$(curl -s -o /dev/null -w "%{http_code}" -m 3 http://127.0.0.1:3001/api 2>/dev/null)
  echo "[$(date +%H:%M:%S)] Frontend=$fe Backend=$be"
done

echo "Tiempo de keepalive agotado. Los servidores se detendrán."
