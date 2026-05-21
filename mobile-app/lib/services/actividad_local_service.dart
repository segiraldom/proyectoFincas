import '../database/sqlite_helper.dart';
import '../models/actividad_model.dart';

class ActividadLocalService {

  Future<void> insertActividad(
    Actividad actividad
  ) async {

    final db =
        await SQLiteHelper.instance.database;

    await db.insert(
      'actividades',
      actividad.toMap(),
    );

  }

  Future<List<Actividad>>
  getActividadesByFinca(
    String fincaId
  ) async {

    final db =
        await SQLiteHelper.instance.database;

    final maps = await db.query(

      'actividades',

      where: 'finca_id = ?',

      whereArgs: [fincaId],

    );

    return maps.map(
      (map) => Actividad.fromMap(map)
    ).toList();

  }

  Future<List<Actividad>>
  getPendingActividades() async {

    final db =
        await SQLiteHelper.instance.database;

    final maps = await db.query(

      'actividades',

      where: 'sincronizado = ?',

      whereArgs: [0],

    );

    return maps.map(
      (map) => Actividad.fromMap(map)
    ).toList();

  }

  Future<void> markAsSynced(
    String id
  ) async {

    final db =
        await SQLiteHelper.instance.database;

    await db.update(

      'actividades',

      {
        'sincronizado': 1
      },

      where: 'id = ?',

      whereArgs: [id],

    );

  }

}