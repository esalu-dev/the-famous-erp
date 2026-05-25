# 🍕 Guía del Estudiante: Variables y Secretos en GitHub Actions

Esta guía explica detalladamente el funcionamiento y la configuración del flujo de trabajo de integración continua (CI) en **The Famous Pizza & Beer ERP**. Ha sido diseñada para servirte como material de apoyo y defensa para tu tarea escolar.

---

## 💡 Concepto Principal: Las Variables en DevOps

En las metodologías de desarrollo modernas (DevOps), **nunca** se deben escribir credenciales o configuraciones rígidas en el código de nuestros flujos de trabajo (lo que se conoce como *hardcoding*). En su lugar, se utilizan **variables**, lo que hace que los pipelines sean flexibles, reutilizables y seguros.

En nuestro archivo `.github/workflows/ci.yml` hemos implementado **6 tipos de variables** diferentes. A continuación, se detalla qué hace cada una y cómo funciona:

---

## 🛠️ Los 6 Tipos de Variables Implementados

### 1. Variables de Entorno Globales (Nivel de Workflow)
*   **Qué son:** Variables constantes definidas en la cabecera del archivo que están disponibles para todos los trabajos (`jobs`) y pasos (`steps`).
*   **En nuestro código:**
    ```yaml
    env:
      NODE_VERSION: '20'
      GLOBAL_LOG_LEVEL: 'info'
      DEFAULT_DATABASE_NAME: 'the_famous_erp_test'
    ```
*   **Cómo se consumen:** Se accede a ellas con la sintaxis `${{ env.NOMBRE_VARIABLE }}` o en comandos shell directamente como `$NOMBRE_VARIABLE`.
    *   *Ejemplo en el código:*
        ```yaml
        node-version: ${{ env.NODE_VERSION }}
        ```

### 2. Variables de Entorno a Nivel de Job
*   **Qué son:** Variables que solo existen dentro de un trabajo específico. Son ideales para modularizar la configuración de un servicio en particular.
*   **En nuestro código:**
    ```yaml
    jobs:
      e2e-and-deploy-mock:
        env:
          ENVIRONMENT: 'staging'
    ```
*   **Cómo se consumen:** Igual que las globales, pero solo son válidas en los pasos que pertenecen al job `e2e-and-deploy-mock`.

### 3. Variables de Contexto de la Plataforma (Automatic Variables)
*   **Qué son:** Información que la plataforma de GitHub proporciona automáticamente sobre la ejecución del pipeline (quién lo inició, qué commit es, qué rama, etc.).
*   **En nuestro código:**
    *   `${{ github.actor }}`: Nombre del usuario de GitHub que disparó el pipeline (ej. `esalu-dev`).
    *   `${{ github.run_number }}`: Número secuencial del build (ej. `#1`, `#2`).
    *   `${{ github.sha }}`: El hash identificador del commit de Git.

### 4. Variables Dinámicas de Flujo (Outputs de Pasos y Jobs)
*   **Qué son:** Variables calculadas dinámicamente *durante* la ejecución de un paso, que luego se transmiten a otros pasos u otros trabajos. Es muy útil para versionamiento automático.
*   **En nuestro código:**
    1. El paso `generate_tag` calcula una etiqueta de versión combinando el número de ejecución y la fecha actual, registrándola en `$GITHUB_OUTPUT`:
        ```bash
        echo "TAG=v1.0.${{ github.run_number }}-$(date +'%Y%m%d')" >> $GITHUB_OUTPUT
        ```
    2. El trabajo `build-and-lint` declara este valor como una salida oficial (`output`):
        ```yaml
        outputs:
          release_tag: ${{ steps.generate_tag.outputs.TAG }}
        ```
    3. El trabajo `e2e-and-deploy-mock` indica que necesita al anterior (`needs: build-and-lint`) y accede a ese valor mediante:
        ```yaml
        APP_VERSION: ${{ needs.build-and-lint.outputs.release_tag }}
        ```

### 5. Variables de Repositorio No Sensibles (`vars`)
*   **Qué son:** Configuraciones de texto plano que se definen en la plataforma web de GitHub para no exponerlas en el código.
*   **En nuestro código:** `${{ vars.DEPLOY_REGION }}`.
*   **Valor por defecto:** En el código agregamos un operador de respaldo `|| 'us-east-1'` para que funcione incluso si aún no has configurado la variable en la web de GitHub.

### 6. Secretos Encriptados del Repositorio (`secrets`)
*   **Qué son:** Valores sumamente confidenciales (como contraseñas, tokens de API o claves de AWS). Se encriptan y se almacenan de forma segura.
*   **En nuestro código:** `${{ secrets.PROD_API_KEY }}`.
*   **🛡️ Regla de Oro (Enmascaramiento de Seguridad):** Cuando GitHub Actions ejecuta un paso que imprime un secreto, la plataforma intercepta los logs y reemplaza automáticamente el valor del secreto por `***`. Esto previene que se exponga información sensible en los registros de auditoría.

---

## 🖥️ Cómo configurar las variables en la Web de GitHub (Paso a Paso)

Para que tu demostración esté completa, debes mostrarle a tu maestro cómo configurar estas variables en tu repositorio remoto de GitHub:

### Paso 1: Configurar la Variable de Repositorio (`vars`)
1. Ve a tu repositorio en GitHub.
2. Haz clic en la pestaña **Settings** (Configuración) en la barra superior.
3. En el menú lateral izquierdo, busca la sección **Secrets and variables** y haz clic en **Actions**.
4. Selecciona la pestaña **Variables** (al lado de Secrets).
5. Haz clic en el botón verde **New repository variable**.
6. En **Name**, escribe exactamente: `DEPLOY_REGION`
7. En **Value**, escribe una región de tu preferencia, por ejemplo: `us-west-2` o `eu-west-1`.
8. Haz clic en **Add variable**.

### Paso 2: Configurar el Secreto de Repositorio (`secrets`)
1. En la misma pantalla anterior (**Settings** -> **Secrets and variables** -> **Actions**), selecciona la pestaña **Secrets**.
2. Haz clic en el botón verde **New repository secret**.
3. En **Name**, escribe exactamente: `PROD_API_KEY`
4. En **Value**, escribe una contraseña secreta ficticia (por ejemplo: `SuperSecretoPizza123!`).
5. Haz clic en **Add secret**.

---

## 🚀 Cómo probar y defender tu tarea

1. **Sube los cambios a tu repositorio:**
   ```bash
   git add .
   git commit -m "chore(infra): add github actions workflow demonstrating variables"
   git push origin develop
   ```
2. **Observa el flujo:**
   * Ve a la pestaña **Actions** en tu repositorio de GitHub.
   * Verás que se ha iniciado un flujo llamado `"🍕 Famous ERP - CI & Variables Pipeline"`.
   * Entra a la ejecución. Verás los dos trabajos secuenciales: `🛠️ Compilación y Calidad de Código` y `🚀 Despliegue Simulado y Uso de Secretos`.
3. **Muestra los logs al maestro:**
   * Entra al trabajo de despliegue simulado.
   * Expande el paso `"Simular Despliegue en Servidores"`.
   * **¡Observa la magia!** La consola mostrará:
     ```text
     Región de AWS (desde vars.DEPLOY_REGION): us-west-2
     Llave de API (desde secrets.PROD_API_KEY): ***
     ```
   * Explícale al maestro que la API KEY se muestra como `***` gracias al motor de seguridad de secretos de GitHub, garantizando un estándar profesional de seguridad.
