import 'package:flutter/material.dart';

import '../models/finca_model.dart';

import 'create_activity_screen.dart';

class FincaDetailScreen
    extends StatelessWidget {

  final Finca finca;

  const FincaDetailScreen({
    super.key,
    required this.finca,
  });

  @override
  Widget build(BuildContext context) {

    return Scaffold(

      appBar: AppBar(
        title: Text(finca.nombre),
      ),

      body: Padding(

        padding: const EdgeInsets.all(16),

        child: Column(

          crossAxisAlignment:
              CrossAxisAlignment.start,

          children: [

            Text(
              'Departamento: ${finca.departamento}'
            ),

            Text(
              'Municipio: ${finca.municipio}'
            ),

            Text(
              'Área: ${finca.areaTotalHectareas}'
            ),

            const SizedBox(height: 20),

            ElevatedButton(

              onPressed: () {

                Navigator.push(
                  context,
                  MaterialPageRoute(
                    builder: (_) =>
                      CreateActivityScreen(
                        finca: finca,
                      ),
                  ),
                );

              },

              child: const Text(
                'Agregar Actividad'
              ),

            )

          ],

        ),

      ),

    );

  }

}