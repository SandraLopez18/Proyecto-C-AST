angular.module('UsuariosApp', [])
  .controller('usuariosController', function($scope, $http) {

    $scope.nuevoUsuario = {
      rol: ''
    };

    $scope.baja = {
      idObjetivo: '',
    };

    $scope.filtro = {
      adminId: '',
      rol: ''
    };

    $scope.usuarios = [];
    $scope.usuarioSeleccionado = null;
    $scope.selectedId = null;

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
      if(err && err.status === 403) {
        $scope.error = 'No tienes permisos para realizar esta acción.';
        return;
      }else if (err && err.data && err.data.error) {
        $scope.error = err.data.error;
      } else {
        $scope.error = mensajePorDefecto || 'Ha ocurrido un error en la operación.';
      }
    }

    $scope.crearUsuario = function() {
      limpiarMensajes();

      const data = {
        rol: $scope.nuevoUsuario.rol
      };

      $http.post('/api/usuarios', data, jsonConfig)
        .then(function(res) {
          $scope.mensaje = 'Usuario creado correctamente. ID: ' + res.data._id;
          $scope.nuevoUsuario = { rol: '' };

          if ($scope.filtro.adminId) {
            $scope.consultarUsuarios();
          }
        })
        .catch(function(err) {
          mostrarError(err, 'Error al crear usuario.');
        });
    };

    $scope.eliminarUsuario = function() {
      console.log('CLICK en eliminarUsuario');
      limpiarMensajes();

      const idObjetivo = ($scope.baja.idObjetivo || '').trim();
      console.log('ID objetivo a eliminar:', idObjetivo);
      
      if (!idObjetivo) {
        $scope.error = 'Debes indicar el ID del usuario a eliminar.';
        return;
      }

      $http.delete('/api/usuarios/' + idObjetivo)
        .then(function(res) {
          console.log('DELETE OK', res);
          $scope.mensaje = res.data.mensaje || 'Usuario eliminado correctamente.';
          $scope.baja = { idObjetivo: ''};
        })
        .catch(function(err) {
          mostrarError(err, 'Error al eliminar usuario.');
        });
    };

    $scope.consultarUsuarios = function() {
      limpiarMensajes();

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
    };

    $scope.seleccionarUsuario = function(usuario) {
      limpiarMensajes();
      $scope.usuarioSeleccionado = angular.copy(usuario);
      $scope.selectedId = usuario._id;
    };

  });