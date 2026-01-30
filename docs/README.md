# 🌦️ Aplicación del Clima (Open-Meteo)

## 📌 Resumen del Proyecto
Esta es una aplicación web sencilla que permite consultar el **clima actual de cualquier ciudad**.  
El usuario ingresa el nombre de la ciudad y la aplicación:

1. Obtiene sus coordenadas usando la **API de Geocodificación de Open-Meteo**
2. Consulta la **API de Pronóstico de Open-Meteo**
3. Muestra de forma clara:
   - Ciudad y país  
   - Temperatura actual  
   - Humedad  
   - Velocidad del viento  
   - Precipitación  
   - Hora de observación  

El proyecto está pensado **especialmente para estudiantes y programadores principiantes**, priorizando:
- Código claro y fácil de entender  
- Manejo de errores consistente  
- Separación básica de la lógica  
- Pruebas ejecutadas directamente en el navegador  

---

## 🛠️ Tecnologías Utilizadas
- **HTML5** – estructura del contenido  
- **CSS3** – estilos y diseño  
- **JavaScript (Vanilla JS)** – lógica de la aplicación  
- **Fetch API** – consumo de APIs externas  
- **Open-Meteo APIs** (Geocoding y Forecast)  
- **Pruebas en navegador** con mocks de `fetch`  

---

## ⚙️ Instrucciones de Instalación
No requiere Node.js ni configuraciones complejas.

1. Clona o descarga este repositorio en tu equipo.
2. Abre el archivo `index.html` en un navegador moderno.
3. Para ejecutar las pruebas, abre `tests/test-runner.html`.

🔹 **Opcional**  
Puedes usar un servidor estático como **Live Server (VS Code)** para:
- Probar la aplicación en dispositivos móviles  
- Evitar restricciones del navegador al usar `fetch`  

---

## 🚀 Guía de Uso
1. Abre `index.html` en tu navegador.
2. Escribe el nombre de una ciudad (ejemplos: `Lima`, `Madrid`, `México, MX`).
3. Presiona el botón **Buscar** o la tecla **Enter**.
4. Si la búsqueda es exitosa, verás:
   - El nombre de la ciudad y su país  
   - La temperatura actual (°C)  
   - La humedad relativa (%)  
   - La velocidad del viento (km/h)  
   - La precipitación (mm)  
   - La hora de observación (formato ISO)  
5. Si ocurre un error (campo vacío, ciudad no encontrada o problema de red), se mostrará un mensaje claro en la interfaz.

---

## 🧪 Pruebas
La aplicación incluye una **suite básica de pruebas en el navegador**, pensada para principiantes:

- No requiere conexión a internet
- Usa mocks de `fetch`
- Permite validar:
  - Manejo de errores
  - Respuestas válidas de la API
  - Flujo general de la aplicación

Para ejecutarlas:
- Abre el archivo `tests/test-runner.html` en el navegador.

---

## 📊 Ejemplo de Resultado
Búsqueda: **"Lima"**

Lugar: Lima, PE
Temperatura: 24 °C
Humedad: 55 %
Viento: 12 km/h
Precipitación: 0.0 mm
Actualizado: 2024-05-01T10:00

---

## 🧩 Funcionalidades
- 🔍 Búsqueda de ciudades por nombre  
- 🌍 Geocodificación con soporte en español  
- 🌡️ Consulta del clima actual en tiempo real  
- ⏱️ Hora de observación automática  
- ⚠️ Manejo de errores claro para el usuario  
- 🧪 Pruebas sin dependencias externas  

---

## ❌ Manejo de Errores
La aplicación comunica los errores de forma clara y consistente:

- **ValidationError**: entrada inválida (por ejemplo, campo vacío)  
- **NotFoundError**: ciudad no encontrada  
- **NetworkError**: problemas de conexión  
- **AppError**: errores HTTP o respuestas inesperadas  

Cuando ocurre un error:
- No se muestran datos antiguos
- El usuario puede realizar una nueva búsqueda sin recargar la página

---

## 🌐 Información de la API
La aplicación utiliza dos endpoints de **Open-Meteo**:

### 1️⃣ Geocoding API
- URL base: `https://geocoding-api.open-meteo.com/v1/search`
- Parámetros principales:
  - `name` (ciudad)
  - `count=1`
  - `language=es`
  - `format=json`

### 2️⃣ Forecast API
- URL base: `https://api.open-meteo.com/v1/forecast`
- Parámetros principales:
  - `latitude`
  - `longitude`
  - `current_weather=true`
  - `hourly=relativehumidity_2m,windspeed_10m,precipitation`
  - `timezone=auto`

📚 Documentación oficial: https://open-meteo.com/

---

## 📚 Documentación de Funciones (Resumen)

### `getCoordinates(city)`
Obtiene la latitud y longitud de una ciudad usando la API de Geocodificación de Open-Meteo.

### `getCurrentTemperature(lat, lon)`
Obtiene la temperatura actual, humedad, velocidad del viento, precipitación y hora de observación.

Ambas funciones incluyen validaciones y manejo de errores pensados para aprendizaje.

---

## 🤖 Uso de Inteligencia Artificial
Este proyecto fue desarrollado **con apoyo de Inteligencia Artificial** como herramienta educativa para:

- Comprender el flujo de consumo de APIs
- Organizar la lógica del proyecto
- Implementar manejo de errores
- Mejorar la claridad del código

Todo el código fue **revisado, comprendido y adaptado** por la autora con fines de aprendizaje.

---

## 🎓 Aprendizajes y Desafíos
**Aprendizajes:**
- Consumo de APIs reales
- Manejo de errores y validaciones
- Importancia de las pruebas
- Organización básica del código

**Desafíos:**
- Identificar y manejar distintos tipos de errores
- Mostrar mensajes claros al usuario
- Mantener el código simple y legible

---

## ⭐ Logro Personal
Estoy orgullosa de haber construido una aplicación funcional que:
- Consume datos reales desde una API
- Maneja errores correctamente
- Puede ser entendida por otros estudiantes principiantes

---

## 🔮 Mejoras Futuras
- 📱 Mejorar el diseño responsive
- 🎨 Refinar la interfaz visual
- 📅 Agregar pronóstico de próximos días
- 📍 Permitir búsqueda de múltiples ciudades
- 🌙 Implementar modo oscuro
- 🌎 Soporte multilenguaje
- 💾 Guardar ciudades favoritas

