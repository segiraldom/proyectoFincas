import '../database/sqlite_helper.dart';
import '../models/propietario_model.dart';

class PropietarioLocalService {

  Future<void> insertPropietario(
    Propietario propietario
  ) async {

    final db =
        await SQLiteHelper.instance.database;

    await db.insert(
      'propietarios',
      propietario.toMap(),
    );

  }

  Future<List<Propietario>>
  getPropietarios() async {

    final db =
        await SQLiteHelper.instance.database;

    final maps =
        await db.query('propietarios');

    return maps.map(
      (map) =>
          Propietario.fromMap(map)
    ).toList();

  }

  Future<List<Propietario>>
  getPendingPropietarios() async {

    final db =
        await SQLiteHelper.instance.database;

    final maps = await db.query(

      'propietarios',

      where: 'sincronizado = ?',

      whereArgs: [0],

    );

    return maps.map(
      (map) =>
          Propietario.fromMap(map)
    ).toList();

  }

  Future<void> markAsSynced(
    String id
  ) async {

    final db =
        await SQLiteHelper.instance.database;

    await db.update(

      'propietarios',

      {
        'sincronizado': 1
      },

      where: 'id = ?',

      whereArgs: [id],

    );

  }

}