class Actividad {

  String id;
  String fincaId;

  String tipo;
  String descripcion;

  double cantidad;
  String unidad;

  double produccion;
  String unidadProduccion;

  double areaHectareas;

  bool sincronizado;

  Actividad({
    required this.id,
    required this.fincaId,
    required this.tipo,
    required this.descripcion,
    required this.cantidad,
    required this.unidad,
    required this.produccion,
    required this.unidadProduccion,
    required this.areaHectareas,
    required this.sincronizado,
  });

  Map<String, dynamic> toMap() {

    return {
      'id': id,
      'finca_id': fincaId,
      'tipo': tipo,
      'descripcion': descripcion,
      'cantidad': cantidad,
      'unidad': unidad,
      'produccion': produccion,
      'unidad_produccion': unidadProduccion,
      'area_hectareas': areaHectareas,
      'sincronizado': sincronizado ? 1 : 0
    };

  }

  factory Actividad.fromMap(Map<String, dynamic> map) {

    return Actividad(
      id: map['id'],
      fincaId: map['finca_id'],
      tipo: map['tipo'],
      descripcion: map['descripcion'],
      cantidad: map['cantidad'],
      unidad: map['unidad'],
      produccion: map['produccion'],
      unidadProduccion: map['unidad_produccion'],
      areaHectareas: map['area_hectareas'],
      sincronizado: map['sincronizado'] == 1,
    );

  }

}