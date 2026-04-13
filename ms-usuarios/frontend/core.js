angular.module('UsuariosApp', [])
  .controller('usuariosController', function($scope, $http) {

    $scope.nuevoUsuario = {
      nombre: '',
      rol: ''
    };

    $scope.baja = {
      idObjetivo: '',
      solicitanteId: ''
    };

    $scope.consultaRol = {
      id: ''
    };

    $scope.filtro = {
      adminId: '',
      rol: ''
    };

    $scope.usuarios = [];
    $scope.usuarioSeleccionado = null;
    $scope.selectedId = null;
    $scope.resultadoRol = null;

    $scope.mensaje = '';
    $scope.error = '';

    const jsonConfig = {
      headers: { 'Content-Type': 'application/json' }
    };

    function limpiarMensajes() {
      $scope.mensaje = '';
      $scope.error = '';
    }

    function mostrarError(err, mensajePorDefecto) {
      if (err && err.data && err.data.error) {
        $scope.error = err.data.error;
      } else {
        $scope.error = mensajePorDefecto || 'Ha ocurrido un error en la operación.';
      }
    }

    $scope.crearUsuario = function() {
      limpiarMensajes();
      $scope.resultadoRol = null;

      const data = {
        nombre: $scope.nuevoUsuario.nombre,
        rol: $scope.nuevoUsuario.rol
      };

      $http.post('/api/usuarios', data, jsonConfig)
        .then(function(res) {
          $scope.mensaje = 'Usuario creado correctamente. ID: ' + res.data._id;
          $scope.nuevoUsuario = { nombre: '', rol: '' };

          if ($scope.filtro.adminId) {
            $scope.consultarUsuarios();
          }
        })
        .catch(function(err) {
          mostrarError(err, 'Error al crear usuario.');
        });
    };

    $scope.eliminarUsuario = function() {
      limpiarMensajes();
      $scope.resultadoRol = null;

      const idObjetivo = ($scope.baja.idObjetivo || '').trim();
      const solicitanteId = ($scope.baja.solicitanteId || '').trim();

      if (!idObjetivo || !solicitanteId) {
        $scope.error = 'Debes indicar el ID a eliminar y el ID del solicitante.';
        return;
      }

      $http.delete('/api/usuarios/' + idObjetivo, {
        params: { userId: solicitanteId }
      })
        .then(function(res) {
          $scope.mensaje = res.data.mensaje || 'Usuario eliminado correctamente.';

          if ($scope.usuarioSeleccionado && $scope.usuarioSeleccionado._id === idObjetivo) {
            $scope.usuarioSeleccionado = null;
            $scope.selectedId = null;
          }

          $scope.baja = {
            idObjetivo: '',
            solicitanteId: ''
          };

          if ($scope.filtro.adminId) {
            $scope.consultarUsuarios();
          } else {
            $scope.usuarios = [];
          }
        })
        .catch(function(err) {
          mostrarError(err, 'Error al eliminar usuario.');
        });
    };

    $scope.consultarRol = function() {
      limpiarMensajes();

      const id = ($scope.consultaRol.id || '').trim();

      if (!id) {
        $scope.error = 'Debes indicar un ID de usuario.';
        return;
      }

      $http.get('/api/usuarios/' + id + '/rol')
        .then(function(res) {
          $scope.resultadoRol = res.data;
          $scope.mensaje = 'Rol consultado correctamente.';
        })
        .catch(function(err) {
          $scope.resultadoRol = null;
          mostrarError(err, 'Error al consultar el rol.');
        });
    };

    $scope.consultarUsuarios = function() {
      limpiarMensajes();
      $scope.resultadoRol = null;

      const adminId = ($scope.filtro.adminId || '').trim();

      if (!adminId) {
        $scope.error = 'Debes indicar el ID del administrador.';
        return;
      }

      const params = {
        userId: adminId
      };

      if ($scope.filtro.rol) {
        params.rol = $scope.filtro.rol;
      }

      $http.get('/api/usuarios', { params: params })
        .then(function(res) {
          $scope.usuarios = res.data;

          if (res.data.length === 0) {
            $scope.mensaje = 'No se encontraron usuarios.';
          } else {
            $scope.mensaje = 'Consulta realizada correctamente.';
          }
        })
        .catch(function(err) {
          $scope.usuarios = [];
          $scope.usuarioSeleccionado = null;
          $scope.selectedId = null;
          mostrarError(err, 'Error al consultar usuarios.');
        });
    };

    $scope.limpiarConsulta = function() {
      limpiarMensajes();

      $scope.filtro = {
        adminId: '',
        rol: ''
      };

      $scope.usuarios = [];
      $scope.usuarioSeleccionado = null;
      $scope.selectedId = null;
      $scope.resultadoRol = null;
    };

    $scope.seleccionarUsuario = function(usuario) {
      limpiarMensajes();
      $scope.usuarioSeleccionado = angular.copy(usuario);
      $scope.selectedId = usuario._id;
    };

  });