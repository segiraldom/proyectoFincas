import 'package:flutter/material.dart';

import '../models/finca_model.dart';

class FincaCard
    extends StatelessWidget {

  final Finca finca;

  const FincaCard({
    super.key,
    required this.finca,
  });

  @override
  Widget build(BuildContext context) {

    return Card(

      margin: const EdgeInsets.all(10),

      child: ListTile(

        title: Text(finca.nombre),

        subtitle: Column(

          crossAxisAlignment:
              CrossAxisAlignment.start,

          children: [

            Text(
              finca.municipio
            ),

            Text(
              finca.departamento
            ),

          ],

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

      ),

    );

  }

}