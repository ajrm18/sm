/**
 * validador-cedula-ecuador.js
 * Validador de cédulas ecuatorianas usando algoritmo Módulo 10
 * Basado en especificación oficial del Registro Civil ecuatoriano
 */

// Mapa de provincias por código
const PROVINCIAS_ECUADOR = {
  '01': 'Azuay',
  '02': 'Bolívar',
  '03': 'Carchi',
  '04': 'Cotopaxi',
  '05': 'Chimborazo',
  '06': 'El Oro',
  '07': 'Esmeraldas',
  '08': 'Guayas',
  '09': 'Pichincha',
  '10': 'Imbabura',
  '11': 'Loja',
  '12': 'Los Ríos',
  '13': 'Manabí',
  '14': 'Morona Santiago',
  '15': 'Napo',
  '16': 'Pastaza',
  '17': 'Tungurahua',
  '18': 'Zamora Chinchipe',
  '19': 'Galápagos',
  '20': 'Sucumbíos',
  '21': 'Orellana',
  '22': 'Santo Domingo',
  '23': 'Santa Elena',
  '24': 'Zonas no Delimitadas',
  '30': 'Ecuatorianos en Exterior'
};

/**
 * Valida si una cédula ecuatoriana es válida usando Módulo 10
 * @param {string} cedula - Número de cédula a validar
 * @returns {object} { valida: boolean, mensaje: string, provincia: string }
 */
function validarCedulaEcuador(cedula) {
  // Validación básica
  if (!cedula) {
    return { valida: false, mensaje: 'Cédula vacía', provincia: null };
  }

  cedula = cedula.toString().trim();

  if (!/^\d{10}$/.test(cedula)) {
    return { valida: false, mensaje: 'La cédula debe tener 10 dígitos numéricos', provincia: null };
  }

  // Extraer código de provincia
  const codigoProvinciaStr = cedula.substring(0, 2);
  const codigoProvinciaNum = parseInt(codigoProvinciaStr);

  if (codigoProvinciaNum < 1 || codigoProvinciaNum > 30) {
    return { valida: false, mensaje: 'Código de provincia inválido', provincia: null };
  }

  const provincia = PROVINCIAS_ECUADOR[codigoProvinciaStr];

  // Algoritmo Módulo 10 para validar dígito verificador
  const coeficientes = [2, 1, 2, 1, 2, 1, 2, 1, 2];
  let suma = 0;

  for (let i = 0; i < 9; i++) {
    let digito = parseInt(cedula[i]) * coeficientes[i];
    // Si el resultado es mayor a 9, se resta 9
    digito = digito > 9 ? digito - 9 : digito;
    suma += digito;
  }

  // Dígito verificador es el resultado de (10 - (suma % 10)) % 10
  const digitoVerificador = (10 - (suma % 10)) % 10;
  const digitoIngresado = parseInt(cedula[9]);

  if (digitoVerificador !== digitoIngresado) {
    return { valida: false, mensaje: 'Dígito verificador inválido', provincia: provincia };
  }

  return { valida: true, mensaje: 'Cédula válida', provincia: provincia };
}

/**
 * Genera datos automáticos para una cédula válida
 * @param {string} cedula - Cédula válida
 * @returns {object} Datos generados
 */
function generarDatosAutomaticos(cedula) {
  const resultado = validarCedulaEcuador(cedula);
  
  if (!resultado.valida) {
    return null;
  }

  // Generar datos fictíciosbásicos basados en la cédula
  const nombres = generarNombres(cedula);
  const apellidos = generarApellidos(cedula);
  const fechaNac = generarFechaNacimiento(cedula);
  const email = generarEmail(nombres, apellidos);
  const sexo = generarSexo(cedula);
  const tipoSangre = generarTipoSangre(cedula);

  return {
    nombres,
    apellidos,
    cedula,
    email,
    fechaNac,
    sexo,
    telefono: `099${Math.random().toString().slice(2, 9)}`,
    tipoSangre,
    alergias: 'No especificadas',
    ocupacion: 'No especificada',
    provincia: resultado.provincia
  };
}

/**
 * Genera nombres based en cedula
 */
function generarNombres(cedula) {
  const nombresM = ['Juan', 'Carlos', 'Antonio', 'Roberto', 'Francisco', 'Manuel', 'Jose', 'Luis'];
  const nombresF = ['Maria', 'Sandra', 'Rocio', 'Patricia', 'Ana', 'Rosa', 'Lucia', 'Sofia'];
  const dobles = ['Juan Carlos', 'Jose Luis', 'Maria Alejandra', 'Maria Jose', 'Ana Maria', 'Rosa Elena'];

  const sexo = generarSexo(cedula);
  const lista = sexo === 'Masculino' ? nombresM : nombresF;
  
  if (Math.random() > 0.7) {
    return dobles[parseInt(cedula.slice(4, 6)) % dobles.length];
  }

  return lista[parseInt(cedula.slice(3, 5)) % lista.length];
}

/**
 * Genera apellidos based en cedula
 */
function generarApellidos(cedula) {
  const apellidos = ['García', 'López', 'Rodríguez', 'Martínez', 'Hernández', 'Pérez', 
                     'Sánchez', 'Ramírez', 'Torres', 'Flores', 'Rivera', 'Vargas', 
                     'Moreno', 'Zambrano', 'Vega', 'Santos', 'Soto', 'Cruz'];
  
  const apellido1 = apellidos[parseInt(cedula.slice(4, 6)) % apellidos.length];
  const apellido2 = apellidos[parseInt(cedula.slice(6, 8)) % apellidos.length];
  
  return `${apellido1} ${apellido2}`;
}

/**
 * Genera fecha de nacimiento based en cedula
 */
function generarFechaNacimiento(cedula) {
  const anno = parseInt(cedula.slice(0, 2));
  const mes = parseInt(cedula.slice(2, 4)) % 12 + 1;
  const dia = parseInt(cedula.slice(4, 6)) % 28 + 1;

  // Determinar siglo (si anno > 30 es 1900s, si no es 2000s)
  const annoCompleto = anno > 30 ? 1900 + anno : 2000 + anno;

  const mesStr = mes.toString().padStart(2, '0');
  const diaStr = dia.toString().padStart(2, '0');

  return `${annoCompleto}-${mesStr}-${diaStr}`;
}

/**
 * Genera email
 */
function generarEmail(nombres, apellidos) {
  const nombre = nombres.split(' ')[0].toLowerCase();
  const apellido = apellidos.split(' ')[0].toLowerCase();
  return `${nombre}.${apellido}@email.com`;
}

/**
 * Genera sexo based en cedula
 */
function generarSexo(cedula) {
  const sexoCode = parseInt(cedula.slice(5, 6));
  return sexoCode % 2 === 0 ? 'Femenino' : 'Masculino';
}

function generarTipoSangre(cedula) {
  return 'No definido';
}

// Exportar para usar en Node.js
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    validarCedulaEcuador,
    generarDatosAutomaticos,
    PROVINCIAS_ECUADOR
  };
}
