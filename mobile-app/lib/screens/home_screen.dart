import 'package:flutter/material.dart';

import '../services/sync_service.dart';

import 'finca_list_screen.dart';
import 'create_finca_screen.dart';

class HomeScreen extends StatefulWidget {

  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() =>
      _HomeScreenState();

}

class _HomeScreenState
    extends State<HomeScreen> {

  final SyncService syncService =
      SyncService();

  @override
  void initState() {

    super.initState();

    syncService.syncPendingData();

  }

  @override
  Widget build(BuildContext context) {

    return Scaffold(

      appBar: AppBar(
        title: const Text(
          'Sistema de Fincas'
        ),
      ),

      body: Column(

        children: [

          const SizedBox(height: 20),

          ElevatedButton(

            onPressed: () {

              Navigator.push(
                context,
                MaterialPageRoute(
                  builder: (_) =>
                    const CreateFincaScreen(),
                ),
              );

            },

            child: const Text(
              'Registrar Finca'
            ),

          ),

          const SizedBox(height: 20),

          ElevatedButton(

            onPressed: () {

              Navigator.push(
                context,
                MaterialPageRoute(
                  builder: (_) =>
                    const FincaListScreen(),
                ),
              );

            },

            child: const Text(
              'Ver Fincas'
            ),

          ),

        ],

      ),

    );

  }

}