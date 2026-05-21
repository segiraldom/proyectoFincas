import 'package:flutter/material.dart';

import '../models/finca_model.dart';

import '../services/finca_local_service.dart';

import 'finca_detail_screen.dart';

class FincaListScreen extends StatefulWidget {

  const FincaListScreen({super.key});

  @override
  State<FincaListScreen> createState() =>
      _FincaListScreenState();

}

class _FincaListScreenState
    extends State<FincaListScreen> {

  final fincaService =
      FincaLocalService();

  List<Finca> fincas = [];

  @override
  void initState() {

    super.initState();

    loadFincas();

  }

  Future<void> loadFincas() async {

    final data =
        await fincaService.getFincas();

    setState(() {

      fincas = data;

    });

  }

  @override
  Widget build(BuildContext context) {

    return Scaffold(

      appBar: AppBar(
        title: const Text(
          'Listado de Fincas'
        ),
      ),

      body: ListView.builder(

        itemCount: fincas.length,

        itemBuilder: (context, index) {

          final finca = fincas[index];

          return ListTile(

            title: Text(finca.nombre),

            subtitle: Text(
              finca.municipio
            ),

            trailing: Icon(

              finca.sincronizado
                  ? Icons.cloud_done
                  : Icons.cloud_off,

              color:
                finca.sincronizado
                  ? Colors.green
                  : Colors.red,

            ),

            onTap: () {

              Navigator.push(

                context,

                MaterialPageRoute(

                  builder: (_) =>
                    FincaDetailScreen(
                      finca: finca,
                    ),

                ),

              );

            },

          );

        },

      ),

    );

  }

}