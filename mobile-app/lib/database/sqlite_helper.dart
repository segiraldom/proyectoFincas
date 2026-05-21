import 'package:path/path.dart';
import 'package:sqflite/sqflite.dart';

class SQLiteHelper {

  static final SQLiteHelper instance = SQLiteHelper._init();

  static Database? _database;

  SQLiteHelper._init();

  Future<Database> get database async {

    if (_database != null) return _database!;

    _database = await _initDB('fincas.db');

    return _database!;

  }

  Future<Database> _initDB(String filePath) async {

    final dbPath = await getDatabasesPath();

    final path = join(dbPath, filePath);

    return await openDatabase(
      path,
      version: 1,
      onCreate: _createDB,
    );

  }

  Future _createDB(Database db, int version) async {

    await db.execute('''
      CREATE TABLE propietarios (
        id TEXT PRIMARY KEY,
        nombre TEXT,
        documento TEXT,
        telefono TEXT,
        correo TEXT,
        sincronizado INTEGER
      )
    ''');

    await db.execute('''
      CREATE TABLE fincas (
        id TEXT PRIMARY KEY,
        nombre TEXT,
        propietario TEXT,
        departamento TEXT,
        municipio TEXT,
        area_total_hectareas REAL,
        latitud REAL,
        longitud REAL,
        sincronizado INTEGER
      )
    ''');

    await db.execute('''
      CREATE TABLE finca_propietario (
        finca_id TEXT,
        propietario_id TEXT
      )
    ''');

    await db.execute('''
      CREATE TABLE actividades (
        id TEXT PRIMARY KEY,
        finca_id TEXT,
        tipo TEXT,
        descripcion TEXT,
        cantidad REAL,
        unidad TEXT,
        produccion REAL,
        unidad_produccion TEXT,
        area_hectareas REAL,
        sincronizado INTEGER
      )
    ''');

  }

}