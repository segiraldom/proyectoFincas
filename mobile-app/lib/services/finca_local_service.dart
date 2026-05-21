import '../database/sqlite_helper.dart';
import '../models/finca_model.dart';

class FincaLocalService {

  Future<void> insertFinca(
    Finca finca
  ) async {

    final db =
        await SQLiteHelper.instance.database;

    await db.insert(
      'fincas',
      finca.toMap(),
    );

  }

  Future<List<Finca>> getFincas() async {

    final db =
        await SQLiteHelper.instance.database;

    final maps =
        await db.query('fincas');

    return maps.map(
      (map) => Finca.fromMap(map)
    ).toList();

  }

  Future<List<Finca>>
  getPendingFincas() async {

    final db =
        await SQLiteHelper.instance.database;

    final maps = await db.query(

      'fincas',

      where: 'sincronizado = ?',

      whereArgs: [0],

    );

    return maps.map(
      (map) => Finca.fromMap(map)
    ).toList();

  }

  Future<void> markAsSynced(
    String id
  ) async {

    final db =
        await SQLiteHelper.instance.database;

    await db.update(

      'fincas',

      {
        'sincronizado': 1
      },

      where: 'id = ?',

      whereArgs: [id],

    );

  }

}