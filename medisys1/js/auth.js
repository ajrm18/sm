// ===================================================
// MediSys – auth.js  (autenticación + datos base)
// ===================================================

const USERS = {
  medicos: [
    { usuario: 'drroserob', password: '1234', nombre: 'Dr. Brayan Rosero', especialidad: 'Médico General', id: 'M001' },
    { usuario: 'dr.lopez', password: '1234', nombre: 'Dr. Ana López', especialidad: 'Cardiología', id: 'M002' },
    { usuario: 'dr.ruiz', password: '1234', nombre: 'Dr. Carlos Ruiz', especialidad: 'Dermatología', id: 'M003' },
    { usuario: 'dr.gonzalez', password: '1234', nombre: 'Dr. María González', especialidad: 'Pediatría', id: 'M004' }
  ],
  pacientes: [
    { usuario: '1712345678', password: '1234', nombre: 'Orlando Rosero', cedula: '1712345678', id: 'P001', email: 'orlando@example.com', fechaNac: '1990-01-01', sexo: 'Masculino', tipoSangre: 'O+', alergias: '', ocupacion: '' },
    { usuario: '1787654321', password: '1234', nombre: 'Rocío Malquín', cedula: '1787654321', id: 'P002', email: 'rocio@example.com', fechaNac: '2005-05-15', sexo: 'Femenino', tipoSangre: 'A+', alergias: '', ocupacion: '' }
  ]
};

function login(usuario, password, rol) {
  let lista = [];
  if (rol === 'medico') {
    lista = USERS.medicos;
  } else {
    lista = [...USERS.pacientes, ...getPacientes()];
  }
  const user = lista.find(u => u.usuario === usuario && u.password === password);
  if (user) {
    const userRol = rol === 'medico' ? 'medico' : 'paciente';
    sessionStorage.setItem('medisys_user', JSON.stringify({ ...user, rol: userRol }));
    return { ok: true };
  }
  return { ok: false, msg: 'Usuario o contraseña incorrectos. Verifique sus credenciales e intente nuevamente.' };
}

function updateSessionPassword(newPassword) {
  const session = getSession();
  if (session) {
    session.password = newPassword;
    sessionStorage.setItem('medisys_user', JSON.stringify(session));
  }
}

function generarUsuario(nombre, rol = 'paciente') {
  const partes = nombre.trim().split(' ');
  const apellido = partes.length > 1 ? partes[partes.length - 1].toLowerCase() : nombre.toLowerCase();
  const inicialNombre = partes.length > 1 ? partes[0][0].toLowerCase() : '';
  
  const apellidoLimpio = apellido.replace(/[^a-z]/g, '');
  const inicialLimpia = inicialNombre.replace(/[^a-z]/g, '');
  
  if (rol === 'medico') {
    return 'dr' + apellidoLimpio + inicialLimpia;
  } else {
    return 'p' + apellidoLimpio + inicialLimpia;
  }
}

function signup(nombres, apellidos, fechaNac, email, cedula) {
  // Validaciones
  if (!nombres.trim()) {
    return { ok: false, msg: 'El campo "Nombres Completos" no puede estar vacío.' };
  }
  if (!apellidos.trim()) {
    return { ok: false, msg: 'El campo "Apellidos Completos" no puede estar vacío.' };
  }
  if (!validarCedula(cedula)) {
    return { ok: false, msg: 'Cédula inválida. Debe contener exactamente 10 dígitos numéricos.' };
  }
  if (!email.trim()) {
    return { ok: false, msg: 'El campo "Correo Electrónico" no puede estar vacío.' };
  }
  if (!validarEmail(email)) {
    return { ok: false, msg: 'Correo inválido. Debe contener un formato válido (ej: usuario@dominio.com).' };
  }
  if (!validarSoloLetrasYEspacios(nombres)) {
    return { ok: false, msg: 'Los nombres deben contener solo letras y espacios.' };
  }
  if (!validarSoloLetrasYEspacios(apellidos)) {
    return { ok: false, msg: 'Los apellidos deben contener solo letras y espacios.' };
  }
  const hoy = new Date();
  const nacimiento = new Date(fechaNac);
  if (nacimiento > hoy) {
    return { ok: false, msg: 'La fecha de nacimiento no puede ser una fecha futura.' };
  }
  const edad = calcularEdad(fechaNac);
  if (edad < 0 || edad > 150) {
    return { ok: false, msg: 'Fecha de nacimiento inválida. Verifique que la fecha sea correcta.' };
  }

  const pacientes = getPacientes();
  const todasCedulas = [...USERS.pacientes.map(p => p.cedula), ...pacientes.map(p => p.cedula)];
  const todosEmails = [...USERS.pacientes.map(p => p.email), ...pacientes.map(p => p.email)];
  
  if (todasCedulas.includes(cedula)) {
    return { ok: false, msg: '❌ Ya existe un paciente registrado con esta cédula.' };
  }
  if (todosEmails.includes(email)) {
    return { ok: false, msg: '❌ Ya existe una cuenta registrada con este correo electrónico.' };
  }
  
  const nombreCompleto = nombres.trim() + ' ' + apellidos.trim();
  const usuario = cedula; // Usuario es la cédula
  const password = '1234'; // Contraseña temporal
  const newPac = {
    id: genId(),
    nombre: nombreCompleto,
    email: email.trim(),
    cedula,
    password,
    usuario,
    fechaNac,
    sexo: 'No especificado',
    tipoSangre: 'No definido',
    alergias: '',
    ocupacion: ''
  };
  savePaciente(newPac);
  return { ok: true, usuario, password };
}

function cambiarPassword(userId, passwordActual, passwordNueva) {
  const session = getSession();
  if (!session || session.id !== userId) {
    return { ok: false, msg: 'No autorizado.' };
  }
  
  if (session.password !== passwordActual) {
    return { ok: false, msg: 'Contraseña actual incorrecta.' };
  }
  
  if (session.rol === 'paciente') {
    const pac = getPacienteById(userId);
    if (pac) {
      pac.password = passwordNueva;
      savePaciente(pac);
      session.password = passwordNueva;
      sessionStorage.setItem('medisys_user', JSON.stringify(session));
      return { ok: true, msg: 'Contraseña actualizada exitosamente.' };
    }
  }
  return { ok: false, msg: 'No se pudo actualizar la contraseña.' };
}

function getSession() {
  const s = sessionStorage.getItem('medisys_user');
  return s ? JSON.parse(s) : null;
}

function requireAuth(rolRequerido) {
  const s = getSession();
  if (!s) { window.location.href = '../index.html'; return null; }
  if (rolRequerido && s.rol !== rolRequerido) { window.location.href = '../index.html'; return null; }
  return s;
}

function logout() {
  sessionStorage.removeItem('medisys_user');
  window.location.href = '../index.html';
}

// ─── LocalStorage helpers ────────────────────────
function getData(key) {
  const d = localStorage.getItem('medisys_' + key);
  return d ? JSON.parse(d) : [];
}
function setData(key, val) {
  localStorage.setItem('medisys_' + key, JSON.stringify(val));
}
function genId() { return Date.now().toString(36) + Math.random().toString(36).slice(2, 6); }

// ─── Médicos ───────────────────────────────────
function getMedicos() { return USERS.medicos; }
function getPacientes() { return getData('pacientes'); }
function savePaciente(p) {
  const list = getPacientes();
  const idx = list.findIndex(x => x.id === p.id);
  if (idx >= 0) list[idx] = p; else list.push(p);
  setData('pacientes', list);
}
function deletePaciente(id) {
  setData('pacientes', getPacientes().filter(p => p.id !== id));
}
function getPacienteById(id) { return getPacientes().find(p => p.id === id); }

// ─── Historias clínicas ──────────────────────────
function getHistorias() { return getData('historias'); }
function saveHistoria(h) {
  const list = getHistorias();
  const idx = list.findIndex(x => x.id === h.id);
  if (idx >= 0) list[idx] = h; else list.push(h);
  setData('historias', list);
}
function getHistoriaPorPaciente(pacId) { return getHistorias().find(h => h.pacienteId === pacId); }

// ─── Consultas ───────────────────────────────────
function getConsultas() { return getData('consultas'); }
function saveConsulta(c) {
  const list = getConsultas();
  const idx = list.findIndex(x => x.id === c.id);
  if (idx >= 0) list[idx] = c; else list.push(c);
  setData('consultas', list);
}
function getConsultasPorPaciente(pacId) {
  return getConsultas().filter(c => c.pacienteId === pacId).sort((a,b) => b.fecha.localeCompare(a.fecha));
}

// ─── Citas ───────────────────────────────────────
function getCitas() { return getData('citas'); }
function saveCita(c) {
  const list = getCitas();

  // Validar que la fecha y hora sean futuras
  const now = new Date();
  const citaFecha = new Date(c.fecha + 'T' + c.hora);
  if (citaFecha <= now) {
    throw new Error('No se puede agendar una cita en una fecha u hora pasada.');
  }

  // Validar que no haya citas duplicadas para el mismo médico
  const isDuplicateMed = list.some(x => x.id !== c.id && x.medicoId === c.medicoId && x.fecha === c.fecha && x.hora === c.hora);
  if (isDuplicateMed) {
    throw new Error('Ya existe una cita agendada para este médico en la misma fecha y hora. Seleccione otro horario.');
  }

  // Validar que el mismo paciente no tenga otra cita en el mismo horario
  const isDuplicatePac = list.some(x => x.id !== c.id && x.pacienteId === c.pacienteId && x.fecha === c.fecha && x.hora === c.hora);
  if (isDuplicatePac) {
    throw new Error('Ya tiene otra cita agendada en la misma fecha y hora.');
  }

  // Guardar o actualizar la cita
  const idx = list.findIndex(x => x.id === c.id);
  if (idx >= 0) list[idx] = c; else list.push(c);
  setData('citas', list);
}
function deleteCita(id) {
  setData('citas', getCitas().filter(c => c.id !== id));
}
function getCitasPorPaciente(pacId) {
  return getCitas().filter(c => c.pacienteId === pacId).sort((a,b) => a.fecha.localeCompare(b.fecha));
}

// ─── Datos demo ──────────────────────────────────
function resetDemoData() {
  // Limpiar todos los datos
  localStorage.removeItem('medisys_pacientes');
  localStorage.removeItem('medisys_historias');
  localStorage.removeItem('medisys_consultas');
  localStorage.removeItem('medisys_citas');
  initDemoData();
}

function initDemoData() {
  if (getPacientes().length > 0) return;

  const pacientes = [
    { id: 'P001', usuario: '1712345678', password: '1234', cedula: '1712345678', nombre: 'Orlando Rosero', fechaNac: '1964-03-15', sexo: 'Masculino', telefono: '0991234567', email: 'orlando@email.com', tipoSangre: 'O+', alergias: 'Ninguna conocida', ocupacion: 'Chofer profesional', fechaRegistro: '2025-01-10' },
    { id: 'P002', usuario: '1787654321', password: '1234', cedula: '1787654321', nombre: 'Rocío Malquín',  fechaNac: '1968-07-22', sexo: 'Femenino',  telefono: '0997654321', email: 'rocio@email.com',  tipoSangre: 'A+', alergias: 'Penicilina',      ocupacion: 'Ama de casa',       fechaRegistro: '2025-01-10' },
  ];
  pacientes.forEach(p => savePaciente(p));

  const historias = [
    { id: 'H001', pacienteId: 'P001', antecedentesPersonales: 'Hipertensión controlada desde 2019.', antecedentesFamiliares: 'Padre con diabetes tipo 2.', enfermedadesCronicas: 'Hipertensión arterial', cirugiasPrevias: 'Ninguna', medicamentosActuales: 'Losartán 50mg diario', vacunas: 'Influenza 2024', fechaCreacion: '2025-01-10', ultimaActualizacion: '2025-03-20' },
    { id: 'H002', pacienteId: 'P002', antecedentesPersonales: 'Gastritis crónica diagnosticada en 2021.', antecedentesFamiliares: 'Madre con hipertensión.', enfermedadesCronicas: 'Gastritis', cirugiasPrevias: 'Apendicectomía 2005', medicamentosActuales: 'Omeprazol 20mg', vacunas: 'COVID-19 completa', fechaCreacion: '2025-01-10', ultimaActualizacion: '2025-04-01' },
  ];
  historias.forEach(h => saveHistoria(h));

  const consultas = [
    { id: 'C001', pacienteId: 'P001', fecha: '2025-03-20', motivo: 'Control de presión arterial', diagnostico: 'Hipertensión arterial controlada', tratamiento: 'Continuar con Losartán 50mg. Dieta baja en sodio.', medicamentos: 'Losartán 50mg – 1 vez al día', observaciones: 'Presión 130/85. Paciente estable.', medicoNombre: 'Dr. Brayan Rosero' },
    { id: 'C002', pacienteId: 'P002', fecha: '2025-04-01', motivo: 'Dolor abdominal recurrente', diagnostico: 'Gastritis crónica en fase activa', tratamiento: 'Reposo gástrico, dieta blanda por 7 días.', medicamentos: 'Omeprazol 20mg – en ayunas por 14 días\nSucralfato 1g – 3 veces al día antes de comidas', observaciones: 'Control en 2 semanas.', medicoNombre: 'Dr. Brayan Rosero' },
    { id: 'C003', pacienteId: 'P001', fecha: '2025-01-15', motivo: 'Dolor de cabeza persistente', diagnostico: 'Cefalea tensional secundaria a HTA', tratamiento: 'Ajuste de medicación antihipertensiva.', medicamentos: 'Losartán 50mg – continuar', observaciones: 'Se recomienda monitoreo diario de presión en casa.', medicoNombre: 'Dr. Brayan Rosero' },
  ];
  consultas.forEach(c => saveConsulta(c));

  const hoy = new Date();
  const f1 = new Date(hoy); f1.setDate(hoy.getDate() + 5);
  const f2 = new Date(hoy); f2.setDate(hoy.getDate() + 12);
  const f3 = new Date(hoy); f3.setDate(hoy.getDate() + 3);
  const citas = [
    { id: 'CT001', pacienteId: 'P001', fecha: f1.toISOString().split('T')[0], hora: '09:00', motivo: 'Control de presión arterial', estado: 'Programada', medicoNombre: 'Dr. Brayan Rosero' },
    { id: 'CT002', pacienteId: 'P002', fecha: f2.toISOString().split('T')[0], hora: '10:30', motivo: 'Control de gastritis', estado: 'Programada', medicoNombre: 'Dr. Brayan Rosero' },
  ];
  citas.forEach(c => saveCita(c));
}

function validarCedula(cedula) {
  if (!/^\d{10}$/.test(cedula)) return false;
  const resultado = validarCedulaEcuador(cedula);
  return resultado.valida;
}

function validarSoloLetrasYEspacios(texto) {
  return /^[a-zA-Z\s]+$/.test(texto.trim());
}

function validarEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

function calcularEdad(fechaNac) {
  const hoy = new Date();
  const nacimiento = new Date(fechaNac);
  let edad = hoy.getFullYear() - nacimiento.getFullYear();
  const mes = hoy.getMonth() - nacimiento.getMonth();
  if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
    edad--;
  }
  return edad;
}

// ─── Manejadores de eventos ──────────────────────
function handleLogin(event) {
  event.preventDefault();
  const usuario = document.getElementById('usuario').value.trim();
  const password = document.getElementById('password').value;
  // Intentar login como paciente
  let result = login(usuario, password, 'paciente');
  if (!result.ok) {
    // Intentar como médico
    result = login(usuario, password, 'medico');
  }
  if (result.ok) {
    const session = getSession();
    if (session.rol === 'medico') {
      window.location.href = 'medico/dashboard.html';
    } else {
      window.location.href = 'paciente/dashboard.html';
    }
  } else {
    document.getElementById('loginError').textContent = result.msg;
    document.getElementById('loginError').style.display = 'block';
  }
}

function handleSignup(event) {
  event.preventDefault();
  const nombres = document.getElementById('signupNombres').value.trim();
  const apellidos = document.getElementById('signupApellidos').value.trim();
  const fechaNac = document.getElementById('signupFechaNac').value;
  const email = document.getElementById('signupEmail').value.trim();
  const cedula = document.getElementById('signupCedula').value.trim();
  
  const result = signup(nombres, apellidos, fechaNac, email, cedula);
  if (result.ok) {
    document.getElementById('newUsername').textContent = result.usuario;
    document.getElementById('signupFormContainer').style.display = 'none';
    document.getElementById('signupSuccess').style.display = 'block';
  } else {
    document.getElementById('signupError').textContent = result.msg;
    document.getElementById('signupError').style.display = 'block';
  }
}

function irAlLogin() {
  setAuthMode('login');
  document.getElementById('signupSuccess').style.display = 'none';
  document.getElementById('signupFormContainer').style.display = 'block';
}

// Inicializar datos de demo (sin limpiar registros existentes)
initDemoData();
