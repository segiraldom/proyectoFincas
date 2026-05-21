import 'package:connectivity_plus/connectivity_plus.dart';

import 'api_service.dart';

import 'finca_local_service.dart';
import 'actividad_local_service.dart';
import 'propietario_local_service.dart';

class SyncService {

  final ApiService apiService =
      ApiService();

  final FincaLocalService
      fincaLocalService =
          FincaLocalService();

  final ActividadLocalService
      actividadLocalService =
          ActividadLocalService();

  final PropietarioLocalService
      propietarioLocalService =
          PropietarioLocalService();

  Future<void> syncPendingData() async {

    final connectivityResult =
        await Connectivity()
            .checkConnectivity();

    if (connectivityResult ==
        ConnectivityResult.none) {

      return;

    }

    // PROPIETARIOS

    final propietarios =
        await propietarioLocalService
            .getPendingPropietarios();

    for (var propietario
        in propietarios) {

      final success =
          await apiService
              .syncPropietario(
                  propietario);

      if (success) {

        await propietarioLocalService
            .markAsSynced(
                propietario.id);

      }

    }

    // FINCAS

    final fincas =
        await fincaLocalService
            .getPendingFincas();

    for (var finca in fincas) {

      final success =
          await apiService
              .syncFinca(finca);

      if (success) {

        await fincaLocalService
            .markAsSynced(
                finca.id);

      }

    }

    // ACTIVIDADES

    final actividades =
        await actividadLocalService
            .getPendingActividades();

    for (var actividad
        in actividades) {

      final success =
          await apiService
              .syncActividad(
                  actividad);

      if (success) {

        await actividadLocalService
            .markAsSynced(
                actividad.id);

      }

    }

  }

}