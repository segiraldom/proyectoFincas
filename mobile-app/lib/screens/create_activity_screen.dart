import 'package:flutter/material.dart';

import 'package:uuid/uuid.dart';

import '../models/finca_model.dart';
import '../models/actividad_model.dart';

import '../services/actividad_local_service.dart';

class CreateActivityScreen
    extends StatefulWidget {

  final Finca finca;

  const CreateActivityScreen({
    super.key,
    required this.finca,
  });

  @override
  State<CreateActivityScreen> createState() =>
      _CreateActivityScreenState();

}

class _CreateActivityScreenState
    extends State<CreateActivityScreen> {

  final tipoController =
      TextEditingController();

  final descripcionController =
      TextEditingController();

  final cantidadController =
      TextEditingController();

  final unidadController =
      TextEditingController();

  final produccionController =
      TextEditingController();

  final unidadProduccionController =
      TextEditingController();

  final areaController =
      TextEditingController();

  final actividadService =
      ActividadLocalService();

  Future<void> saveActivity() async {

    final actividad = Actividad(

      id: const Uuid().v4(),

      fincaId: widget.finca.id,

      tipo: tipoController.text,

      descripcion:
          descripcionController.text,

      cantidad:
          double.parse(cantidadController.text),

      unidad:
          unidadController.text,

      produccion:
          double.parse(produccionController.text),

      unidadProduccion:
          unidadProduccionController.text,

      areaHectareas:
          double.parse(areaController.text),

      sincronizado: false,

    );

    await actividadService.insertActividad(
      actividad,
    );

    if (!mounted) return;

    ScaffoldMessenger.of(context)
        .showSnackBar(

      const SnackBar(
        content: Text(
          'Actividad guardada offline'
        ),
      ),

    );

    Navigator.pop(context);

  }

  @override
  Widget build(BuildContext context) {

    return Scaffold(

      appBar: AppBar(
        title: const Text(
          'Registrar Actividad'
        ),
      ),

      body: Padding(

        padding: const EdgeInsets.all(16),

        child: ListView(

          children: [

            TextField(
              controller: tipoController,
              decoration:
                const InputDecoration(
                  labelText: 'Tipo'
                ),
            ),

            TextField(
              controller:
                  descripcionController,
              decoration:
                const InputDecoration(
                  labelText: 'Descripción'
                ),
            ),

            TextField(
              controller:
                  cantidadController,
              decoration:
                const InputDecoration(
                  labelText: 'Cantidad'
                ),
            ),

            TextField(
              controller:
                  unidadController,
              decoration:
                const InputDecoration(
                  labelText: 'Unidad'
                ),
            ),

            TextField(
              controller:
                  produccionController,
              decoration:
                const InputDecoration(
                  labelText: 'Producción'
                ),
            ),

            TextField(
              controller:
                  unidadProduccionController,
              decoration:
                const InputDecoration(
                  labelText:
                    'Unidad Producción'
                ),
            ),

            TextField(
              controller:
                  areaController,
              decoration:
                const InputDecoration(
                  labelText:
                    'Área Hectáreas'
                ),
            ),

            const SizedBox(height: 20),

            ElevatedButton(

              onPressed: saveActivity,

              child: const Text(
                'Guardar'
              ),

            )

          ],

        ),

      ),

    );

  }

}