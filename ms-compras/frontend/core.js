angular.module('ComprasApp', [])
  .controller('comprasController', function($scope, $http) {
    $scope.acceso = { userId: '' };
    $scope.userIdValido = false;
    $scope.errorAcceso = '';
    $scope.mensajeAcceso = '';

    $scope.mensaje = '';
    $scope.error = '';

    $scope.filtroArticulos = {
      id: '',
      nombre: '',
      color: '',
      disponible: 'SI'
    };

    $scope.nuevaCompra = {
      articuloId: '',
      cantidad: 1,
      nombreComprador: '',
      direccionEnvio: ''
    };

    $scope.filtroCompras = {
      id: '',
      articuloId: '',
      nombreComprador: ''
    };

    $scope.edicionCompra = {
      id: '',
      nombreComprador: '',
      direccionEnvio: ''
      // fechaEnvio: ''
    };

    $scope.articulos = [];
    $scope.compras = [];
    $scope.selectedCompraId = null;

    function limpiarMensajes() {
      $scope.mensaje = '';
      $scope.error = '';
    }

    function limpiarMensajesAcceso() {
      $scope.errorAcceso = '';
      $scope.mensajeAcceso = '';
    }

    function getUserId() {
      return ($scope.acceso.userId || '').trim();
    }

    function getParamsBase() {
      return { userId: getUserId() };
    }

    /*
    function formatearFechaInput(fecha) {
      if (!fecha) return '';
      const d = new Date(fecha);
      if (isNaN(d.getTime())) return '';
      return d.toISOString().split('T')[0];
    }
    */

    function reiniciarDatosPantalla() {
      $scope.articulos = [];
      $scope.compras = [];
      $scope.selectedCompraId = null;

      $scope.nuevaCompra = {
        articuloId: '',
        cantidad: 1,
        nombreComprador: '',
        direccionEnvio: ''
      };

      $scope.filtroCompras = {
        id: '',
        articuloId: '',
        nombreComprador: ''
      };

      $scope.edicionCompra = {
        id: '',
        nombreComprador: '',
        direccionEnvio: ''
        // fechaEnvio: ''
      };
    }

    function mostrarError(err, textoDefecto) {
      if (err.data && err.data.error) {
        $scope.error = err.data.error;
      } else {
        $scope.error = textoDefecto || 'Ha ocurrido un error.';
      }
    }

    $scope.validarIdCliente = function() {
      limpiarMensajesAcceso();
      limpiarMensajes();
      reiniciarDatosPantalla();

      const userId = getUserId();

      if (!userId) {
        $scope.userIdValido = false;
        $scope.errorAcceso = 'Debes introducir un ID de usuario.';
        return;
      }

      $http.get('http://localhost:3001/api/usuarios/' + userId + '/rol')
        .then(function(res) {
          if (res.data.rol === 'cliente') {
            $scope.userIdValido = true;
            $scope.mensajeAcceso = 'ID de cliente válido.';
            $scope.buscarArticulos();
            $scope.buscarCompras();
          } else {
            $scope.userIdValido = false;
            $scope.errorAcceso = 'El usuario indicado no tiene rol cliente.';
          }
        })
        .catch(function(err) {
          $scope.userIdValido = false;
          if (err.data && err.data.error) {
            $scope.errorAcceso = err.data.error;
          } else {
            $scope.errorAcceso = 'Usuario no válido o error al consultar el rol.';
          }
        });
    };

    $scope.cambiarId = function() {
      $scope.userIdValido = false;
      limpiarMensajes();
      limpiarMensajesAcceso();
      reiniciarDatosPantalla();
    };

    $scope.limpiarId = function() {
      $scope.acceso.userId = '';
      $scope.userIdValido = false;
      limpiarMensajes();
      limpiarMensajesAcceso();
      reiniciarDatosPantalla();
    };

    $scope.buscarArticulos = function() {
      limpiarMensajes();

      if (!$scope.userIdValido) {
        $scope.error = 'Primero debes validar un ID de cliente.';
        return;
      }

      const params = getParamsBase();

      if ($scope.filtroArticulos.id) params.id = $scope.filtroArticulos.id;
      if ($scope.filtroArticulos.nombre) params.nombre = $scope.filtroArticulos.nombre;
      if ($scope.filtroArticulos.color) params.color = $scope.filtroArticulos.color;
      if ($scope.filtroArticulos.disponible) params.disponible = $scope.filtroArticulos.disponible;

      $http.get('/api/articulos', { params: params })
        .then(function(res) {
          $scope.articulos = res.data;
          if (!res.data.length) {
            $scope.mensaje = 'No se encontraron artículos.';
          }
        })
        .catch(function(err) {
          $scope.articulos = [];
          mostrarError(err, 'Error al consultar artículos.');
        });
    };

    $scope.seleccionarArticulo = function(articulo) {
      limpiarMensajes();
      if (!$scope.userIdValido) {
        $scope.error = 'Primero debes validar un ID de cliente.';
        return;
      }
      $scope.nuevaCompra.articuloId = articulo._id;
    };

    $scope.crearCompra = function() {
      limpiarMensajes();

      if (!$scope.userIdValido) {
        $scope.error = 'Primero debes validar un ID de cliente.';
        return;
      }

      const payload = {
        userId: getUserId(),
        articuloId: $scope.nuevaCompra.articuloId,
        cantidad: $scope.nuevaCompra.cantidad,
        nombreComprador: $scope.nuevaCompra.nombreComprador,
        direccionEnvio: $scope.nuevaCompra.direccionEnvio
      };

      $http.post('/api/compras', payload)
        .then(function(res) {
          $scope.mensaje = res.data.mensaje + ' ID de compra: ' + res.data.compraId;
          $scope.nuevaCompra = {
            articuloId: '',
            cantidad: 1,
            nombreComprador: '',
            direccionEnvio: ''
          };
          $scope.buscarArticulos();
          $scope.buscarCompras();
        })
        .catch(function(err) {
          mostrarError(err, 'Error al realizar la compra.');
        });
    };

    $scope.buscarCompras = function() {
      limpiarMensajes();

      if (!$scope.userIdValido) {
        $scope.error = 'Primero debes validar un ID de cliente.';
        return;
      }

      const params = getParamsBase();

      if ($scope.filtroCompras.id) params.id = $scope.filtroCompras.id;
      if ($scope.filtroCompras.articuloId) params.articuloId = $scope.filtroCompras.articuloId;
      if ($scope.filtroCompras.nombreComprador) params.nombreComprador = $scope.filtroCompras.nombreComprador;

      $http.get('/api/compras', { params: params })
        .then(function(res) {
          console.log('Compras obtenidas:', res.data);
          $scope.compras = res.data;
          if (!res.data.length) {
            $scope.mensaje = 'No se encontraron compras.';
          }
        })
        .catch(function(err) {
          $scope.compras = [];
          mostrarError(err, 'Error al consultar compras.');
        });
    };

    $scope.seleccionarCompra = function(compra) {
      limpiarMensajes();

      if (!$scope.userIdValido) {
        $scope.error = 'Primero debes validar un ID de cliente.';
        return;
      }

      $scope.selectedCompraId = compra._id;
      $scope.edicionCompra = {
        id: compra._id,
        nombreComprador: compra.nombreComprador,
        direccionEnvio: compra.direccionEnvio
        // fechaEnvio: formatearFechaInput(compra.fechaEnvio)
      };
    };

    $scope.actualizarCompra = function() {
      limpiarMensajes();

      if (!$scope.userIdValido) {
        $scope.error = 'Primero debes validar un ID de cliente.';
        return;
      }

      const payload = {
        userId: getUserId(),
        nombreComprador: $scope.edicionCompra.nombreComprador,
        direccionEnvio: $scope.edicionCompra.direccionEnvio
        // fechaEnvio: $scope.edicionCompra.fechaEnvio
      };

      $http.put('/api/compras/' + $scope.edicionCompra.id, payload)
        .then(function(res) {
          $scope.mensaje = res.data.mensaje;
          $scope.buscarCompras();
        })
        .catch(function(err) {
          mostrarError(err, 'Error al modificar la compra.');
        });
    };

    $scope.eliminarCompra = function(id) {
      limpiarMensajes();

      if (!$scope.userIdValido) {
        $scope.error = 'Primero debes validar un ID de cliente.';
        return;
      }

      if (!id) return;

      $http.delete('/api/compras/' + id, {
        params: { userId: getUserId() }
      })
        .then(function(res) {
          $scope.mensaje = res.data.mensaje;
          if ($scope.selectedCompraId === id) {
            $scope.selectedCompraId = null;
            $scope.edicionCompra = {
              id: '',
              nombreComprador: '',
              direccionEnvio: ''
              // fechaEnvio: ''
            };
          }
          $scope.buscarArticulos();
          $scope.buscarCompras();
        })
        .catch(function(err) {
          mostrarError(err, 'Error al eliminar la compra.');
        });
    };
  });