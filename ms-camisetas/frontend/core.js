angular.module('MainApp', [])
  .controller('mainController', function($scope, $http) {

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

    function mostrarError(err) {
      if (err.data && err.data.error) {
        $scope.error = err.data.error;
      } else {
        $scope.error = 'Ha ocurrido un error en la operación.';
      }
    }

    function cargarCamisetas() {
      limpiarMensajes();

      $http.get('/api/camisetas')
        .then(function(res) {
          $scope.camisetas = res.data;
        })
        .catch(function(err) {
          mostrarError(err);
        });
    }

    cargarCamisetas();

    $scope.buscarCamisetas = function() {
      limpiarMensajes();

      const params = {};

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
      $scope.busqueda = { id: '', nombre: '', color: '' };
      cargarCamisetas();
    };

    $scope.registrarCamiseta = function() {
      limpiarMensajes();

      $http.post('/api/camisetas', $scope.newCamiseta, jsonConfig)
        .then(function(res) {
          $scope.newCamiseta = {};
          $scope.selected = false;
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

      $http.put('/api/camisetas/' + c._id, c, jsonConfig)
        .then(function(res) {
          $scope.newCamiseta = {};
          $scope.selected = false;
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

      $http.delete('/api/camisetas/' + c._id)
        .then(function(res) {
          $scope.newCamiseta = {};
          $scope.selected = false;
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