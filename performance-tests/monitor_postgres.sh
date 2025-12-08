#!/bin/bash
# Script para monitorear PostgreSQL durante pruebas de carga

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuración
DB_NAME="kapatortas_db"
DB_USER="postgres"
INTERVAL=5  # Intervalo de monitoreo en segundos

echo "=========================================="
echo "🔍 MONITOREO DE POSTGRESQL - KAPATORTAS"
echo "=========================================="
echo ""
echo "Base de datos: $DB_NAME"
echo "Intervalo: ${INTERVAL}s"
echo "Presiona Ctrl+C para detener"
echo ""

# Función para obtener conexiones activas
get_connections() {
    psql -d $DB_NAME -t -c "SELECT count(*) FROM pg_stat_activity WHERE state = 'active';"
}

# Función para obtener conexiones totales
get_total_connections() {
    psql -d $DB_NAME -t -c "SELECT count(*) FROM pg_stat_activity;"
}

# Función para obtener max_connections
get_max_connections() {
    psql -d $DB_NAME -t -c "SELECT setting::int FROM pg_settings WHERE name='max_connections';"
}

# Función para obtener queries lentas
get_slow_queries() {
    psql -d $DB_NAME -t -c "
        SELECT count(*)
        FROM pg_stat_activity
        WHERE state = 'active'
        AND now() - query_start > interval '1 second';
    "
}

# Función para obtener locks
get_locks() {
    psql -d $DB_NAME -t -c "
        SELECT count(*)
        FROM pg_locks
        WHERE NOT granted;
    "
}

# Loop de monitoreo
while true; do
    clear
    echo "=========================================="
    echo "🔍 POSTGRESQL - $(date '+%H:%M:%S')"
    echo "=========================================="
    echo ""

    # Obtener métricas
    active=$(get_connections)
    total=$(get_total_connections)
    max=$(get_max_connections)
    slow=$(get_slow_queries)
    locks=$(get_locks)

    # Calcular porcentaje de uso
    usage_percent=$((total * 100 / max))

    # Mostrar conexiones
    echo "📊 CONEXIONES:"
    echo "   Activas:  $active"
    echo "   Totales:  $total / $max"

    # Color según porcentaje
    if [ $usage_percent -lt 50 ]; then
        echo -e "   Uso:      ${GREEN}${usage_percent}%${NC}"
    elif [ $usage_percent -lt 80 ]; then
        echo -e "   Uso:      ${YELLOW}${usage_percent}%${NC}"
    else
        echo -e "   Uso:      ${RED}${usage_percent}%${NC}"
    fi

    echo ""
    echo "⏱️  QUERIES LENTAS (> 1s): $slow"

    # Locks
    if [ $locks -gt 0 ]; then
        echo -e "${RED}🔒 LOCKS NO RESUELTOS: $locks${NC}"
    else
        echo -e "${GREEN}🔒 LOCKS: 0${NC}"
    fi

    echo ""
    echo "----------------------------------------"

    # Mostrar top 5 queries más lentas
    echo "🐌 TOP 5 QUERIES MÁS LENTAS:"
    psql -d $DB_NAME -c "
        SELECT
            pid,
            EXTRACT(EPOCH FROM (now() - query_start))::int AS segundos,
            left(query, 60) AS query
        FROM pg_stat_activity
        WHERE state = 'active'
        AND query NOT LIKE '%pg_stat_activity%'
        ORDER BY query_start
        LIMIT 5;
    " 2>/dev/null || echo "   (ninguna)"

    echo ""
    echo "Actualizando en ${INTERVAL}s..."
    sleep $INTERVAL
done
