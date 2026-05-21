class Finca {

  String id;

  String nombre;

  String departamento;

  String municipio;

  double areaTotalHectareas;

  double latitud;

  double longitud;

  bool sincronizado;

  Finca({
    required this.id,
    required this.nombre,
    required this.departamento,
    required this.municipio,
    required this.areaTotalHectareas,
    required this.latitud,
    required this.longitud,
    required this.sincronizado,
  });

  Map<String, dynamic> toMap() {

    return {
      'id': id,
      'nombre': nombre,
      'departamento': departamento,
      'municipio': municipio,
      'area_total_hectareas': areaTotalHectareas,
      'latitud': latitud,
      'longitud': longitud,
      'sincronizado': sincronizado ? 1 : 0
    };

  }

  factory Finca.fromMap(Map<String, dynamic> map) {

    return Finca(
      id: map['id'],
      nombre: map['nombre'],
      departamento: map['departamento'],
      municipio: map['municipio'],
      areaTotalHectareas: map['area_total_hectareas'],
      latitud: map['latitud'],
      longitud: map['longitud'],
      sincronizado: map['sincronizado'] == 1,
    );

  }

}