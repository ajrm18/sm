# MediSys - Sistema de Gestión Clínica

## 🚀 Inicio Rápido

### Opción 1: Servidor Local
```bash
python -m http.server 8000
```
O si usas Node.js:
```bash
npx http-server
```

### Opción 2: GitHub Pages
Sube el repositorio a GitHub y habilita GitHub Pages en Settings > Pages, seleccionando la rama main y carpeta root.

---

## 📋 Cuentas Disponibles

### Pacientes:
- **Usuario**: `1712345678` / **Contraseña**: `1234` (Orlando Rosero)
- **Usuario**: `1787654321` / **Contraseña**: `1234` (Rocío Malquín)
- Regístrate manualmente con cédula válida (10 dígitos) y datos personales.
- Usuario = Cédula, Contraseña temporal = `1234`

### Médicos:
- **Usuario**: `droserob` / **Contraseña**: `1234` (Dr. Brayan Rosero - Médico General)
- **Usuario**: `dlopeza` / **Contraseña**: `1234` (Dra. Ana López - Cardiología)
- **Usuario**: `druizc` / **Contraseña**: `1234` (Dr. Carlos Ruiz - Dermatología)
- **Usuario**: `dgonzalezm` / **Contraseña**: `1234` (Dra. María González - Pediatría)

---

## ✨ Características

- **Registro Manual**: Ingresa datos personales, valida cédula ecuatoriana.
- **Tema Oscuro**: Interruptor para cambiar entre tema claro y oscuro.
- **Responsive**: Adaptado a móvil, tablet y desktop.
- **Validaciones**: Campos seguros, sin basura permitida.
- **Emojis**: Iconos en formularios y características.

---

## 🔧 Desarrollo

Archivos principales:
- `index.html`: Página de login/registro
- `js/auth.js`: Lógica de autenticación
- `css/style.css`: Estilos con tema oscuro
- `validador-cedula-ecuador.js`: Validación de cédula

3. Si no existe, puedes **llenar manualmente**

---

## 📁 Estructura de Archivos

```
medisys1/
├── index.html                 # Página de login
├── db.json                    # Base de datos JSON Server
├── package.json               # Dependencias
├── start-server.bat           # Script para iniciar servidor
├── css/
│   └── style.css             # Estilos
├── js/
│   └── auth.js               # Lógica de autenticación
├── paciente/
│   └── dashboard.html        # Portal del paciente
└── medico/
    └── dashboard.html        # Portal del médico
```

---

## 🔧 Instalación (Primera vez)

```bash
npm install
```

Esto instala `json-server` automáticamente.

---

## 💡 Notas

- JSON Server es una API fake REST basada en `db.json`
- Perfect para prototipos y demostraciones
- No requiere código backend real
- Ideal para la demostración a tu profesor
