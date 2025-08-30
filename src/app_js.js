import React, { useState } from 'react';
import { Calculator, Info, RotateCcw, AlertCircle, CheckCircle2 } from 'lucide-react';

const CalculadoraNotas = () => {
  const [formData, setFormData] = useState({
    puntajeIdeal: '',
    porcentajeExigencia: '60',
    notaMaxAprobatoria: '7',
    notaMinAprobatoria: '4',
    puntajeAlumno: ''
  });

  const [decimalesExigencia, setDecimalesExigencia] = useState(0);
  const [decimalesNota, setDecimalesNota] = useState(1);
  const [resultados, setResultados] = useState({
    puntajeExigencia: '',
    nota: '',
    comentario: ''
  });

  const mensajes = {
    msg1: "Obs: el porcentaje de exigencia puede ser menos de 50%, pero esto no es frecuente.",
    msg2: "Error: el porcentaje de exigencia no puede ser más de 100%.",
    msg3: "Error: el porcentaje de exigencia no puede ser negativo.",
    msg4: "Error: La nota máxima aprobatoria no puede ser menor que la nota mínima aprobatoria",
    msg5: "Error: el puntaje del alumno no puede ser mayor que el puntaje ideal.",
    msg6: "Obs.: el valor que ingresaste en puntaje del alumno es negativo; esto puede ser, pero no es frecuente.",
    msg7: "Cálculo realizado correctamente"
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const calcularNota = () => {
    let comentario = "";
    const XId = parseFloat(formData.puntajeIdeal);
    const PorExig = parseFloat(formData.porcentajeExigencia);
    const NMaxAp = parseInt(formData.notaMaxAprobatoria);
    const NMinAp = parseInt(formData.notaMinAprobatoria);
    const Xalum = parseFloat(formData.puntajeAlumno);

    // Validaciones
    if (isNaN(XId) || isNaN(PorExig) || isNaN(NMaxAp) || isNaN(NMinAp) || isNaN(Xalum)) {
      setResultados({
        puntajeExigencia: '0',
        nota: '0',
        comentario: 'Error: Todos los campos deben contener valores numéricos válidos.'
      });
      return;
    }

    if (PorExig < 50) comentario = mensajes.msg1;

    // Calcular puntaje de exigencia
    const numero = (XId * PorExig) / 100;
    const n1 = decimalesExigencia === 0 ? 1 : decimalesExigencia === 1 ? 10 : 100;
    let Xexig = Math.round(numero * n1) / n1;

    let numero2 = 0;

    // Validaciones principales
    if (PorExig > 100) {
      numero2 = 0;
      Xexig = 0;
      comentario = mensajes.msg2;
    } else if (PorExig < 0) {
      numero2 = 0;
      Xexig = 0;
      comentario = mensajes.msg3;
    } else if (NMinAp > NMaxAp) {
      numero2 = 0;
      Xexig = 0;
      comentario = mensajes.msg4;
    } else if (Xalum > XId) {
      numero2 = 0;
      comentario = mensajes.msg5;
    } else if (Xalum < 0) {
      numero2 = 1;
      comentario = mensajes.msg6;
    } else {
      // Cálculo de la nota
      if (Xalum === Xexig) {
        numero2 = NMinAp;
        comentario = mensajes.msg7;
      } else if (Xalum > Xexig) {
        numero2 = (((NMaxAp - NMinAp) / (XId - Xexig)) * (Xalum - Xexig)) + NMinAp;
        comentario = mensajes.msg7;
      } else if (Xalum < Xexig) {
        numero2 = (((NMinAp - 1) / Xexig) * Xalum) + 1;
        comentario = mensajes.msg7;
      }
    }

    // Redondear resultado final
    const n2 = decimalesNota === 0 ? 1 : decimalesNota === 1 ? 10 : 100;
    const notaFinal = Math.round(numero2 * n2) / n2;

    setResultados({
      puntajeExigencia: Xexig.toString(),
      nota: notaFinal.toString(),
      comentario: comentario
    });
  };

  const limpiarFormulario = () => {
    setFormData({
      puntajeIdeal: '',
      porcentajeExigencia: '60',
      notaMaxAprobatoria: '7',
      notaMinAprobatoria: '4',
      puntajeAlumno: ''
    });
    setResultados({
      puntajeExigencia: '',
      nota: '',
      comentario: ''
    });
  };

  const esError = resultados.comentario.toLowerCase().includes('error');
  const esObservacion = resultados.comentario.toLowerCase().includes('obs');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Calculator className="w-8 h-8 text-indigo-600 mr-3" />
            <h1 className="text-3xl font-bold text-gray-800">
              Calculadora de Notas Académicas
            </h1>
          </div>
          <p className="text-gray-600">
            Sistema para calcular calificaciones basado en puntajes y porcentajes de exigencia
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Formulario principal */}
          <div className="grid md:grid-cols-2 gap-8">
            {/* Columna izquierda - Parámetros */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">
                Parámetros del Sistema
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Puntaje ideal
                  </label>
                  <div className="flex">
                    <input
                      type="number"
                      value={formData.puntajeIdeal}
                      onChange={(e) => handleInputChange('puntajeIdeal', e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Ej: 100"
                    />
                    <span className="px-3 py-2 bg-gray-100 border border-l-0 border-gray-300 rounded-r-lg text-sm text-gray-600">
                      puntos
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Porcentaje de exigencia
                  </label>
                  <div className="flex">
                    <input
                      type="number"
                      value={formData.porcentajeExigencia}
                      onChange={(e) => handleInputChange('porcentajeExigencia', e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                    <span className="px-3 py-2 bg-gray-100 border border-l-0 border-gray-300 rounded-r-lg text-sm text-gray-600">
                      %
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nota máxima aprobatoria
                    </label>
                    <input
                      type="number"
                      value={formData.notaMaxAprobatoria}
                      onChange={(e) => handleInputChange('notaMaxAprobatoria', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nota mínima aprobatoria
                    </label>
                    <input
                      type="number"
                      value={formData.notaMinAprobatoria}
                      onChange={(e) => handleInputChange('notaMinAprobatoria', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Columna derecha - Cálculo */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">
                Cálculo de Nota
              </h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Puntaje del alumno
                </label>
                <div className="flex">
                  <input
                    type="number"
                    value={formData.puntajeAlumno}
                    onChange={(e) => handleInputChange('puntajeAlumno', e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Ej: 85"
                  />
                  <span className="px-3 py-2 bg-gray-100 border border-l-0 border-gray-300 rounded-r-lg text-sm text-gray-600">
                    puntos
                  </span>
                </div>
              </div>

              {/* Opciones de decimales */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Decimales para exigencia
                  </label>
                  <select
                    value={decimalesExigencia}
                    onChange={(e) => setDecimalesExigencia(parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value={0}>Sin decimales</option>
                    <option value={1}>Con un decimal</option>
                    <option value={2}>Con dos decimales</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Decimales para nota
                  </label>
                  <select
                    value={decimalesNota}
                    onChange={(e) => setDecimalesNota(parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value={0}>Sin decimales</option>
                    <option value={1}>Con un decimal</option>
                    <option value={2}>Con dos decimales</option>
                  </select>
                </div>
              </div>

              {/* Botones */}
              <div className="flex gap-4">
                <button
                  onClick={calcularNota}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-6 rounded-lg font-semibold transition-colors flex items-center justify-center"
                >
                  <Calculator className="w-5 h-5 mr-2" />
                  Calcular
                </button>
                <button
                  onClick={limpiarFormulario}
                  className="px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-semibold transition-colors flex items-center"
                >
                  <RotateCcw className="w-5 h-5 mr-2" />
                  Limpiar
                </button>
              </div>
            </div>
          </div>

          {/* Resultados */}
          {(resultados.nota || resultados.puntajeExigencia) && (
            <div className="mt-8 pt-8 border-t">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">Resultados</h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-blue-50 rounded-lg p-6">
                  <div className="text-sm text-blue-600 font-medium mb-1">
                    Puntaje de Exigencia
                  </div>
                  <div className="text-2xl font-bold text-blue-800">
                    {resultados.puntajeExigencia} puntos
                  </div>
                </div>
                
                <div className="bg-green-50 rounded-lg p-6">
                  <div className="text-sm text-green-600 font-medium mb-1">
                    NOTA FINAL
                  </div>
                  <div className="text-3xl font-bold text-green-800">
                    {resultados.nota}
                  </div>
                </div>
              </div>

              {/* Comentarios */}
              {resultados.comentario && (
                <div className={`mt-6 p-4 rounded-lg flex items-start ${
                  esError 
                    ? 'bg-red-50 border border-red-200' 
                    : esObservacion 
                    ? 'bg-yellow-50 border border-yellow-200'
                    : 'bg-green-50 border border-green-200'
                }`}>
                  {esError ? (
                    <AlertCircle className="w-5 h-5 text-red-500 mr-3 mt-0.5 flex-shrink-0" />
                  ) : esObservacion ? (
                    <Info className="w-5 h-5 text-yellow-500 mr-3 mt-0.5 flex-shrink-0" />
                  ) : (
                    <CheckCircle2 className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  )}
                  <div className={`text-sm ${
                    esError 
                      ? 'text-red-700' 
                      : esObservacion 
                      ? 'text-yellow-700'
                      : 'text-green-700'
                  }`}>
                    {resultados.comentario}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Fórmulas */}
          <div className="mt-8 pt-8 border-t">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Fórmulas utilizadas</h3>
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="space-y-3 text-sm text-gray-700">
                <div><strong>Puntaje de exigencia:</strong> (Puntaje ideal × Porcentaje de exigencia) ÷ 100</div>
                <div><strong>Nota aprobatoria:</strong> ((Nota máx - Nota mín) ÷ (Puntaje ideal - Puntaje exigencia)) × (Puntaje alumno - Puntaje exigencia) + Nota mín</div>
                <div><strong>Nota reprobatoria:</strong> ((Nota mín - 1) ÷ Puntaje exigencia) × Puntaje alumno + 1</div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t text-center text-sm text-gray-500">
            <p>Basado en el sistema original desarrollado por Hernán Emilio Pérez y Gabriel Díaz - Universidad de Concepción</p>
            <p className="mt-1">Versión modernizada - Agosto 2025</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalculadoraNotas;