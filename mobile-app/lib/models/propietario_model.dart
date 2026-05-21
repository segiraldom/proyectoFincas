class Propietario {

  String id;

  String nombre;

  String documento;

  String telefono;

  String correo;

  bool sincronizado;

  Propietario({
    required this.id,
    required this.nombre,
    required this.documento,
    required this.telefono,
    required this.correo,
    required this.sincronizado,
  });

  Map<String, dynamic> toMap() {

    return {
      'id': id,
      'nombre': nombre,
      'documento': documento,
      'telefono': telefono,
      'correo': correo,
      'sincronizado': sincronizado ? 1 : 0
    };

  }

  factory Propietario.fromMap(Map<String, dynamic> map) {

    return Propietario(
      id: map['id'],
      nombre: map['nombre'],
      documento: map['documento'],
      telefono: map['telefono'],
      correo: map['correo'],
      sincronizado: map['sincronizado'] == 1,
    );

  }

}