#!/bin/bash
# Script de inicio rápido para pruebas de carga

# Colores
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo ""
echo "=========================================="
echo "🚀 INICIO RÁPIDO - PRUEBAS DE CARGA"
echo "   KapaTortas Performance Testing"
echo "=========================================="
echo ""

# Verificar que estamos en el directorio correcto
if [ ! -f "locustfile.py" ]; then
    echo -e "${RED}❌ Error: Ejecuta este script desde el directorio performance-tests/${NC}"
    exit 1
fi

# Función para verificar si un comando existe
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Verificar dependencias
echo -e "${BLUE}📦 Verificando dependencias...${NC}"

if ! command_exists python3; then
    echo -e "${RED}❌ Python 3 no está instalado${NC}"
    exit 1
fi

if ! command_exists psql; then
    echo -e "${YELLOW}⚠️  psql no está instalado (opcional, solo para monitoreo de BD)${NC}"
fi

# Verificar Locust
if ! python3 -c "import locust" 2>/dev/null; then
    echo -e "${YELLOW}⚠️  Locust no está instalado. Instalando...${NC}"
    pip3 install locust requests
fi

echo -e "${GREEN}✅ Dependencias verificadas${NC}"
echo ""

# Menú principal
echo "Selecciona una opción:"
echo ""
echo "1. 📊 Cargar datos de prueba (PRIMERO)"
echo "2. 🧪 CASO 1: Carga Normal (100 usuarios, 30 min)"
echo "3. 💥 CASO 2: Estrés en BD (incremental hasta colapso)"
echo "4. 🖼️  CASO 3: Carga de Imágenes (200 usuarios, 20 min)"
echo "5. 📄 CASO 4: PDFs y Emails (50 usuarios, 15 min)"
echo "6. ⚡ CASO 5: Race Conditions (50 usuarios, 1 min)"
echo "7. 🔍 Verificar consistencia de datos"
echo "8. 🗑️  Resetear datos de prueba"
echo "9. 📈 Monitorear PostgreSQL (en tiempo real)"
echo "0. ❌ Salir"
echo ""
read -p "Opción: " option

case $option in
    1)
        echo ""
        echo -e "${BLUE}📊 Cargando datos de prueba...${NC}"
        cd ../backend
        python3 scripts/load_test_data.py
        echo ""
        echo -e "${GREEN}✅ Datos cargados. Ahora puedes ejecutar las pruebas.${NC}"
        ;;

    2)
        echo ""
        echo -e "${BLUE}🧪 Iniciando CASO 1: Carga Normal${NC}"
        echo ""
        echo "Configuración:"
        echo "  - 100 usuarios concurrentes"
        echo "  - Duración: 30 minutos"
        echo "  - Host: http://localhost:8000"
        echo ""
        echo "Abriendo interfaz web en http://localhost:8089"
        echo ""
        locust -f locustfile.py --host=http://localhost:8000
        ;;

    3)
        echo ""
        echo -e "${BLUE}💥 Iniciando CASO 2: Estrés en BD${NC}"
        echo ""
        echo "Se ejecutarán 5 fases incrementales:"
        echo "  Fase 1: 50 usuarios"
        echo "  Fase 2: 100 usuarios"
        echo "  Fase 3: 200 usuarios"
        echo "  Fase 4: 400 usuarios"
        echo "  Fase 5: 600 usuarios"
        echo ""
        read -p "¿Continuar? (s/n): " confirm
        if [ "$confirm" = "s" ]; then
            echo -e "${YELLOW}Fase 1: 50 usuarios...${NC}"
            locust -f locustfile_stress_db.py --host=http://localhost:8000 \
                   --users 50 --spawn-rate 10 --run-time 5m --headless --csv=results_fase1

            echo -e "${YELLOW}Fase 2: 100 usuarios...${NC}"
            locust -f locustfile_stress_db.py --host=http://localhost:8000 \
                   --users 100 --spawn-rate 20 --run-time 5m --headless --csv=results_fase2

            echo -e "${YELLOW}Fase 3: 200 usuarios...${NC}"
            locust -f locustfile_stress_db.py --host=http://localhost:8000 \
                   --users 200 --spawn-rate 40 --run-time 5m --headless --csv=results_fase3

            echo -e "${YELLOW}Fase 4: 400 usuarios...${NC}"
            locust -f locustfile_stress_db.py --host=http://localhost:8000 \
                   --users 400 --spawn-rate 80 --run-time 5m --headless --csv=results_fase4

            echo -e "${YELLOW}Fase 5: 600 usuarios...${NC}"
            locust -f locustfile_stress_db.py --host=http://localhost:8000 \
                   --users 600 --spawn-rate 100 --run-time 5m --headless --csv=results_fase5

            echo ""
            echo -e "${GREEN}✅ Prueba de estrés completada${NC}"
            echo "Resultados guardados en results_fase*.csv"
        fi
        ;;

    4)
        echo ""
        echo -e "${BLUE}🖼️  Iniciando CASO 3: Carga de Imágenes${NC}"
        echo ""
        locust -f locustfile_images.py --host=http://localhost:8000 \
               --users 200 --spawn-rate 50 --run-time 20m --headless --csv=results_images
        echo ""
        echo -e "${GREEN}✅ Prueba completada. Resultados en results_images*.csv${NC}"
        ;;

    5)
        echo ""
        echo -e "${BLUE}📄 Iniciando CASO 4: PDFs y Emails${NC}"
        echo ""
        locust -f locustfile_pdf_email.py --host=http://localhost:8000 \
               --users 50 --spawn-rate 10 --run-time 15m --headless --csv=results_pdf_email
        echo ""
        echo -e "${GREEN}✅ Prueba completada. Resultados en results_pdf_email*.csv${NC}"
        ;;

    6)
        echo ""
        echo -e "${BLUE}⚡ Iniciando CASO 5: Race Conditions${NC}"
        echo ""
        echo "Preparando: Configurando stock inicial..."
        psql -d kapatortas_db -c "UPDATE presentaciones SET stock = 10 WHERE id = 1;" 2>/dev/null

        echo "Ejecutando prueba..."
        locust -f locustfile_race_condition.py --host=http://localhost:8000 \
               --users 50 --spawn-rate 50 --run-time 1m --headless --csv=results_race

        echo ""
        echo "Verificando stock final..."
        psql -d kapatortas_db -c "SELECT id, stock FROM presentaciones WHERE id = 1;" 2>/dev/null

        echo ""
        echo -e "${GREEN}✅ Prueba completada. Verificando consistencia...${NC}"
        cd ../backend
        python3 scripts/verify_data_consistency.py
        ;;

    7)
        echo ""
        echo -e "${BLUE}🔍 Verificando consistencia de datos...${NC}"
        cd ../backend
        python3 scripts/verify_data_consistency.py
        ;;

    8)
        echo ""
        echo -e "${YELLOW}🗑️  Resetear datos de prueba${NC}"
        cd ../backend
        python3 scripts/reset_database.py
        ;;

    9)
        echo ""
        echo -e "${BLUE}📈 Iniciando monitor de PostgreSQL...${NC}"
        echo "Presiona Ctrl+C para detener"
        echo ""
        ./monitor_postgres.sh
        ;;

    0)
        echo ""
        echo -e "${GREEN}👋 ¡Hasta luego!${NC}"
        exit 0
        ;;

    *)
        echo ""
        echo -e "${RED}❌ Opción inválida${NC}"
        exit 1
        ;;
esac

echo ""
echo -e "${BLUE}=========================================${NC}"
echo -e "${BLUE}Prueba finalizada$(NC}"
echo -e "${BLUE}=========================================${NC}"
