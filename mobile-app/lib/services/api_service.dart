import 'dart:convert';

import 'package:http/http.dart' as http;

import '../models/finca_model.dart';
import '../models/actividad_model.dart';
import '../models/propietario_model.dart';

class ApiService {

  static const String baseUrl =
      'http://10.0.2.2:3000/api';

  Future<bool> syncFinca(
    Finca finca
  ) async {

    try {

      final response = await http.post(

        Uri.parse('$baseUrl/fincas'),

        headers: {
          'Content-Type': 'application/json'
        },

        body: jsonEncode({

          'id': finca.id,

          'nombre': finca.nombre,

          'departamento':
              finca.departamento,

          'municipio':
              finca.municipio,

          'area_total_hectareas':
              finca.areaTotalHectareas,

          'latitud':
              finca.latitud,

          'longitud':
              finca.longitud

        }),

      );

      return response.statusCode == 201;

    } catch (e) {

      return false;

    }

  }

  Future<bool> syncActividad(
    Actividad actividad
  ) async {

    try {

      final response = await http.post(

        Uri.parse('$baseUrl/actividades'),

        headers: {
          'Content-Type': 'application/json'
        },

        body: jsonEncode({

          'id': actividad.id,

          'finca_id':
              actividad.fincaId,

          'tipo':
              actividad.tipo,

          'descripcion':
              actividad.descripcion,

          'cantidad':
              actividad.cantidad,

          'unidad':
              actividad.unidad,

          'produccion':
              actividad.produccion,

          'unidad_produccion':
              actividad.unidadProduccion,

          'area_hectareas':
              actividad.areaHectareas

        }),

      );

      return response.statusCode == 201;

    } catch (e) {

      return false;

    }

  }

  Future<bool> syncPropietario(
    Propietario propietario
  ) async {

    try {

      final response = await http.post(

        Uri.parse('$baseUrl/propietarios'),

        headers: {
          'Content-Type': 'application/json'
        },

        body: jsonEncode({

          'id': propietario.id,

          'nombre':
              propietario.nombre,

          'documento':
              propietario.documento,

          'telefono':
              propietario.telefono,

          'correo':
              propietario.correo

        }),

      );

      return response.statusCode == 201;

    } catch (e) {

      return false;

    }

  }

}