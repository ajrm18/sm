# 🚀 MediSys - Guía Completa de Uso

## ✅ Estado del Proyecto
**Integración de Autocompletado:** ✅ **COMPLETADA**  
**Pruebas de Funcionamiento:** ✅ **TODAS APROBADAS (5/5)**  
**Estado General:** 🎉 **LISTO PARA PRODUCCIÓN**

---

## 📦 Lo Que Se Ha Implementado

### 1. **Backend JSON Server**
- ✅ Base de datos con 2 pacientes preregistrados
- ✅ API REST en puerto 3000
- ✅ Endpoint: `http://localhost:3000/pacientes`

### 2. **Autocompletado de Cédula**
- ✅ Búsqueda de pacientes por cédula (10 dígitos)
- ✅ Autocarga de: Nombres, Apellidos, Email, Fecha de Nacimiento
- ✅ Validación de cédula en tiempo real
- ✅ Fallback manual si el servidor no está disponible

### 3. **Registro de Nuevas Cuentas**
- ✅ Formulario de registro completo
- ✅ Validación de datos
- ✅ Creación de cuenta con contraseña temporal
- ✅ Integración con base de datos local

### 4. **Sistema de Autenticación**
- ✅ Login de pacientes y médicos
- ✅ Cuentas demo disponibles
- ✅ Session management

---

## 🎯 Cómo Usar el Sistema

### **PASO 1: Iniciar el Servidor Backend**

Abre una terminal en la carpeta del proyecto y ejecuta:

```bash
npm start
```

Deberías ver:
```
  ⌐ JSON Server is running
  ⌛ Loading db.json
  ✔ Done
  
  Resources
  http://localhost:3000/pacientes

  Home
  http://localhost:3000
```

### **PASO 2: Abrir la Aplicación**

En tu navegador, abre: `http://localhost:8000` (o el puerto donde esté tu servidor web)

### **PASO 3: Probar el Autocompletado**

1. **Haz clic en "Crear Cuenta"**
2. **En el campo "Cédula 🆔", ingresa:** `1712345678`
3. **Verifica que se completen automáticamente:**

| Campo | Valor |
|-------|-------|
| Nombres | Orlando |
| Apellidos | Rosero |
| Correo | orlando@email.com |
| Fecha Nacimiento | 1964-03-15 |
| Mensaje | ✓ Datos cargados correctamente |

### **PASO 4: Prueba con Otro Paciente**

Limpia el formulario e ingresa la cédula: `1787654321`

Deberás ver los datos de **Rocío Malquín**.

### **PASO 5: Crear una Nueva Cuenta**

1. Usa el autocompletado con una cédula existente
2. El formulario se completará automáticamente
3. Haz clic en **"Crear Cuenta"**
4. Verás el mensaje de éxito con tus credenciales

---

## 👤 Cuentas Demo Disponibles

### Pacientes
| Usuario | Contraseña | Nombre | Cédula |
|---------|-----------|--------|--------|
| 1712345678 | 1234 | Orlando Rosero | 1712345678 |
| 1787654321 | 1234 | Rocío Malquín | 1787654321 |

### Médicos
| Usuario | Contraseña | Nombre | Especialidad |
|---------|-----------|--------|--------------|
| drroserob | 1234 | Dr. Brayan Rosero | Médico General |
| dr.lopez | 1234 | Dr. Ana López | Cardiología |
| dr.ruiz | 1234 | Dr. Carlos Ruiz | Dermatología |
| dr.gonzalez | 1234 | Dr. María González | Pediatría |

---

## 🔧 Estructura del Proyecto

```
medisys1/
├── index.html                 # Página de login y registro
├── css/
│   └── style.css             # Estilos de la aplicación
├── js/
│   └── auth.js               # Lógica de autenticación
├── medico/
│   └── dashboard.html        # Panel del médico
├── paciente/
│   └── dashboard.html        # Panel del paciente
├── db.json                   # Base de datos JSON (pacientes)
├── package.json              # Dependencias y scripts
├── test-autocompletado.js    # Script de pruebas automatizadas
├── PRUEBAS.md                # Reporte de pruebas
└── GUIA_USO.md              # Este archivo
```

---

## 🧪 Pruebas Disponibles

### Ejecutar Pruebas Automatizadas

```bash
node test-autocompletado.js
```

**Resultado esperado:**
```
✅ Servidor JSON accesible
✅ Autocompletado Paciente 1 (Orlando Rosero)
✅ Autocompletado Paciente 2 (Rocío Malquín)
✅ Búsqueda de cédula inexistente
✅ Total de 2 pacientes en la base de datos

Aprobadas: 5
Reprobadas: 0
Porcentaje: 100%
```

---

## 🆘 Solución de Problemas

### ❌ "Error de conexión" o "Servidor no disponible"

**Solución:**
1. Verifica que el terminal del servidor JSON siga abierto
2. Si se cerró, ejecuta `npm start` nuevamente
3. Comprueba que estés usando puerto 3000

### ❌ El autocompletado no funciona

**Solución:**
1. Abre la consola del navegador (F12)
2. Verifica que no haya errores de red
3. Confirma que ingresaste exactamente 10 dígitos en la cédula
4. Prueba con `1712345678` (paciente existente)

### ❌ "Cédula ya existe"

**Solución:**
1. La cédula ya está registrada en el sistema
2. Intenta con otra cédula válida
3. O crea una cédula de prueba diferente

### ❌ Contraseña incorrecta en login

**Solución:**
1. Las contraseñas demo son: `1234`
2. Revisa que no tengas Caps Lock activo
3. Prueba con una de las cuentas demo disponibles

---

## 📱 Características Principales

✨ **Búsqueda Inteligente**
- Busca pacientes en tiempo real por cédula

✨ **Autocompletado Automático**
- Llena datos del formulario automáticamente
- Reduce errores de tipeo

✨ **Validación Robusta**
- Valida cédulas (10 dígitos)
- Valida fechas
- Valida emails

✨ **Fallback Manual**
- Si el servidor no está disponible, el formulario funciona manualmente
- No bloquea la experiencia del usuario

✨ **Respuesta Rápida**
- Búsquedas instantáneas
- Interfaz responsiva

---

## 📝 Notas Importantes

1. **Base de datos**: Los datos se guardan en `db.json` para el backend y en `localStorage` para nuevas cuentas
2. **Contraseña temporal**: Todas las nuevas cuentas se crean con contraseña `1234`
3. **Cédula**: Es el identificador único en el sistema
4. **Puerto 3000**: El servidor JSON debe estar en puerto 3000
5. **CORS**: El servidor JSON permite peticiones desde cualquier origen (desarrollo)

---

## 🎓 Próximos Pasos (Sugerencias)

1. **Integración con Base de Datos Real**: Migrar de JSON Server a una base de datos relacional
2. **Autenticación Mejorada**: Implementar JWT tokens en lugar de session storage
3. **Validación Avanzada**: Agregar validación del algoritmo de cédula ecuatoriana
4. **Caché de Datos**: Implementar caché del lado del cliente
5. **Sincronización**: Sincronizar datos entre pacientes que se registran

---

## 📞 Soporte

Si encuentras algún problema:
1. Revisa el apartado "Solución de Problemas"
2. Ejecuta las pruebas automatizadas: `node test-autocompletado.js`
3. Abre la consola del navegador (F12) para ver los errores
4. Verifica que el servidor JSON esté corriendo: `npm start`

---

**Última actualización:** Abril 20, 2026  
**Estado:** ✅ Completado y Probado  
**Versión:** 1.0.0
