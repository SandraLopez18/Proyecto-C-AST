angular.module('MainApp', [])
  .controller('mainController', function($scope, $http) {

    $scope.acceso = {
      userId: ''
    };

    $scope.autorizado = false;
    $scope.errorAcceso = '';
    $scope.mensajeAcceso = '';

    $scope.newCamiseta = {};
    $scope.camisetas = [];
    $scope.selected = false;

    $scope.mensaje = '';
    $scope.error = '';

    $scope.busqueda = {
      id: '',
      nombre: '',
      color: '',
      disponible: 'SI'
    };

    const jsonConfig = {
      headers: { 'Content-Type': 'application/json' }
    };

    function limpiarMensajes() {
      $scope.mensaje = '';
      $scope.error = '';
    }

    function limpiarMensajesAcceso() {
      $scope.errorAcceso = '';
      $scope.mensajeAcceso = '';
    }

    function mostrarError(err) {
      if (err.data && err.data.error) {
        $scope.error = err.data.error;
      } else {
        $scope.error = 'Ha ocurrido un error en la operación.';
      }
    }

    function getUserId() {
      return ($scope.acceso.userId || '').trim();
    }

    function getParamsBase() {
      return { userId: getUserId() };
    }

    function cargarCamisetas() {
      limpiarMensajes();

      $http.get('/api/camisetas', {
        params: getParamsBase()
      })
        .then(function(res) {
          $scope.camisetas = res.data;
        })
        .catch(function(err) {
          $scope.camisetas = [];
          mostrarError(err);
        });
    }

    $scope.validarAcceso = function() {
      limpiarMensajesAcceso();
      limpiarMensajes();

      const userId = getUserId();

      if (!userId) {
        $scope.errorAcceso = 'Debes introducir tu ID de usuario.';
        return;
      }

      $http.get('http://localhost:3001/api/usuarios/' + userId + '/rol')
        .then(function(res) {
          if (res.data.rol === 'admin') {
            $scope.autorizado = true;
            $scope.mensajeAcceso = 'Acceso concedido.';
            cargarCamisetas();
          } else {
            $scope.autorizado = false;
            $scope.errorAcceso = 'No tienes permisos para acceder a este microservicio.';
          }
        })
        .catch(function(err) {
          $scope.autorizado = false;
          if (err.data && err.data.error) {
            $scope.errorAcceso = err.data.error;
          } else {
            $scope.errorAcceso = 'Usuario no válido o error al consultar el rol.';
          }
        });
    };

    $scope.cerrarSesion = function() {
      $scope.acceso.userId = '';
      $scope.autorizado = false;
      $scope.errorAcceso = '';
      $scope.mensajeAcceso = '';
      $scope.camisetas = [];
      $scope.newCamiseta = {};
      $scope.selected = false;
      $scope.selectedId = null;
      limpiarMensajes();
    };

    $scope.buscarCamisetas = function() {
      limpiarMensajes();

      const params = getParamsBase();

      if ($scope.busqueda.id) params.id = $scope.busqueda.id;
      if ($scope.busqueda.nombre) params.nombre = $scope.busqueda.nombre;
      if ($scope.busqueda.color) params.color = $scope.busqueda.color;
      if ($scope.busqueda.disponible) params.disponible = $scope.busqueda.disponible;

      $http.get('/api/camisetas', { params: params })
        .then(function(res) {
          $scope.camisetas = res.data;

          if (res.data.length === 0) {
            $scope.mensaje = 'No se encontraron camisetas.';
          } else {
            $scope.mensaje = 'Búsqueda realizada correctamente.';
          }
        })
        .catch(function(err) {
          $scope.camisetas = [];
          mostrarError(err);
        });
    };

    $scope.mostrarTodas = function() {
      $scope.busqueda = {
        id: '',
        nombre: '',
        color: '',
        disponible: 'SI'
      };
      cargarCamisetas();
    };

    $scope.registrarCamiseta = function() {
      limpiarMensajes();

      const data = {
        ...$scope.newCamiseta,
        userId: getUserId()
      };

      $http.post('/api/camisetas', data, jsonConfig)
        .then(function(res) {
          $scope.newCamiseta = {};
          $scope.selected = false;
          $scope.selectedId = null;
          cargarCamisetas();
          $scope.mensaje = 'Camiseta creada correctamente.';
        })
        .catch(function(err) {
          mostrarError(err);
        });
    };

    $scope.modificarCamiseta = function(camiseta) {
      limpiarMensajes();

      const c = camiseta || $scope.newCamiseta;
      if (!c || !c._id) return;

      const data = {
        ...c,
        userId: getUserId()
      };

      $http.put('/api/camisetas/' + c._id, data, jsonConfig)
        .then(function(res) {
          $scope.newCamiseta = {};
          $scope.selected = false;
          $scope.selectedId = null;
          cargarCamisetas();
          $scope.mensaje = 'Camiseta modificada correctamente.';
        })
        .catch(function(err) {
          mostrarError(err);
        });
    };

    $scope.borrarCamiseta = function(camiseta) {
      limpiarMensajes();

      const c = camiseta || $scope.newCamiseta;
      if (!c || !c._id) return;

      $http.delete('/api/camisetas/' + c._id, {
        params: getParamsBase()
      })
        .then(function(res) {
          $scope.newCamiseta = {};
          $scope.selected = false;
          $scope.selectedId = null;
          cargarCamisetas();
          $scope.mensaje = 'Camiseta eliminada correctamente.';
        })
        .catch(function(err) {
          mostrarError(err);
        });
    };

    $scope.selectCamiseta = function(camiseta) {
      limpiarMensajes();
      $scope.newCamiseta = angular.copy(camiseta);
      $scope.selected = true;
      $scope.selectedId = camiseta._id;
    };

    $scope.limpiarFormulario = function() {
      $scope.newCamiseta = {};
      $scope.selected = false;
      $scope.selectedId = null;
      limpiarMensajes();
    };

  });