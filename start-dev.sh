#!/bin/bash
cd /home/z/my-project
# Matar instancias previas
pkill -9 -f "next dev" 2>/dev/null
sleep 1
# Iniciar next dev (sin pipe tee que causa problemas)
exec bun node_modules/.bin/next dev -p 3000
