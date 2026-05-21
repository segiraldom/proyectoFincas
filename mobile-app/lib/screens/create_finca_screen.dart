import 'package:flutter/material.dart';

import 'package:uuid/uuid.dart';

import '../models/finca_model.dart';

import '../services/finca_local_service.dart';

class CreateFincaScreen extends StatefulWidget {

  const CreateFincaScreen({super.key});

  @override
  State<CreateFincaScreen> createState() =>
      _CreateFincaScreenState();

}

class _CreateFincaScreenState
    extends State<CreateFincaScreen> {

  final _formKey = GlobalKey<FormState>();

  final nombreController =
      TextEditingController();

  final departamentoController =
      TextEditingController();

  final municipioController =
      TextEditingController();

  final areaController =
      TextEditingController();

  final latitudController =
      TextEditingController();

  final longitudController =
      TextEditingController();

  final fincaService =
      FincaLocalService();

  Future<void> saveFinca() async {

    final finca = Finca(

      id: const Uuid().v4(),

      nombre: nombreController.text,

      departamento:
          departamentoController.text,

      municipio:
          municipioController.text,

      areaTotalHectareas:
          double.parse(areaController.text),

      latitud:
          double.parse(latitudController.text),

      longitud:
          double.parse(longitudController.text),

      sincronizado: false,

    );

    await fincaService.insertFinca(finca);

    if (!mounted) return;

    ScaffoldMessenger.of(context)
        .showSnackBar(

      const SnackBar(
        content: Text(
          'Finca guardada offline'
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
          'Registrar Finca'
        ),
      ),

      body: Padding(

        padding: const EdgeInsets.all(16),

        child: Form(

          key: _formKey,

          child: ListView(

            children: [

              TextFormField(
                controller: nombreController,
                decoration: const InputDecoration(
                  labelText: 'Nombre'
                ),
              ),

              TextFormField(
                controller:
                    departamentoController,
                decoration: const InputDecoration(
                  labelText: 'Departamento'
                ),
              ),

              TextFormField(
                controller: municipioController,
                decoration: const InputDecoration(
                  labelText: 'Municipio'
                ),
              ),

              TextFormField(
                controller: areaController,
                decoration: const InputDecoration(
                  labelText: 'Área'
                ),
              ),

              TextFormField(
                controller: latitudController,
                decoration: const InputDecoration(
                  labelText: 'Latitud'
                ),
              ),

              TextFormField(
                controller: longitudController,
                decoration: const InputDecoration(
                  labelText: 'Longitud'
                ),
              ),

              const SizedBox(height: 20),

              ElevatedButton(

                onPressed: saveFinca,

                child: const Text(
                  'Guardar'
                ),

              )

            ],

          ),

        ),

      ),

    );

  }

}