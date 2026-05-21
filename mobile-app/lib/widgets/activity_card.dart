import 'package:flutter/material.dart';

import '../models/actividad_model.dart';

class ActivityCard
    extends StatelessWidget {

  final Actividad actividad;

  const ActivityCard({
    super.key,
    required this.actividad,
  });

  @override
  Widget build(BuildContext context) {

    return Card(

      margin: const EdgeInsets.all(10),

      child: ListTile(

        title: Text(
          actividad.tipo
        ),

        subtitle: Text(
          actividad.descripcion
        ),

        trailing: Icon(

          actividad.sincronizado
              ? Icons.cloud_done
              : Icons.cloud_off,

          color:
            actividad.sincronizado
              ? Colors.green
              : Colors.red,

        ),

      ),

    );

  }

}