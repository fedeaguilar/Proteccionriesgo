// Mostramos los datos del punto de control en el modal

function modal(id, nombre, objetivo, id_objetivo) {



   $('#idControlActulizar').val(id);
   $('#controlActualizar').val(nombre);
   $('#modificarObjetivo').val(id_objetivo);
   $('#optobjetivo').val(objetivo);


   $('#actualizarControlModal').modal('toggle');
}

// Listamos los puntos de control segun el cliente y el objetivo seleccionado [PUNTOS DE CONTROL]

function listarPuntosControlCliente(id = null, objetivo = null) {

   $('#agregarControl').prop('disabled', false);

   if (id == null) {
      var idCliente = $('#cliente').val();
      var objetivocliente = $('#objetivo').val();
   } else {
      var idCliente = id;
      var objetivocliente = objetivo;
   }

   $.ajax({
      type: 'post',
      cache: false,
      dataType: "json",
      url: 'puntocontrol/tablacontrolCliente',
      data: {
         id_cliente: idCliente,
         id_objetivo: objetivocliente
      },
      success: function (data) {

         $("#tabla-control tbody").empty();

         for (var i = 0; i < data.length; i++) {
            var datos = data[i].id + ",'" + data[i].nombre + "','" + data[i].objetivo + "'," + data[i].id_objetivo;
            $("#tabla-control tbody").append('<tr> \
            <td>'+ data[i].id + '</td>\
            <td>'+ data[i].nombre + '</td>\
            <td>'+ data[i].objetivo + '</td>\
            <td><button class="btn btn-warning btn-sm rounded-pill" onclick="modal('+ datos + ')">Editar</button> <button class="ml-4 btn btn-danger btn-sm rounded-pill" onclick="ControlSet(' + datos + ')">Eliminar</button></td>\
            </tr>');
         }
      }
   });
}

// Listamos las rondas segun el cliente seleccionado [RONDAS]

function listarRondasCliente(id = null, objetivo = null, filtro = null, orden) {

   let ordenTabla = orden;

   if (filtro == null) {
      var filtroTabla = "id_objetivo"
   } else {
      var filtroTabla = filtro;
   }

   if (id == null) {
      var idCliente = $('#clienteRondas').val();
   } else {
      var idCliente = id;
   }

   if (objetivo == null) {
      var idObjetivo = $('#clienteRondas').val();
   } else {
      var idObjetivo = objetivo;
   }

   $.ajax({
      type: "post",
      url: "rondacliente",
      data: {
         id: idCliente,
         objetivo: idObjetivo,
         filtro: filtroTabla,
         orden: ordenTabla
      },
      success: function (data) {


         $datos = JSON.parse(data);

         $("#tabla-rondas-cliente tbody").empty();

         $.map($datos, function (e, i) {
            let estilo_estado = (e.estado == 0) ? 'danger' : 'success';
            let estado = (e.estado == 0) ? 'Inactivo' : 'Activo';
            $("#tabla-rondas-cliente tbody").append(`<tr>
            <td id="nombre">${e.nombre}</td> 
            <td>${e.fecha}</td>
            <td><span class="badge badge-pill badge-${estilo_estado}">${estado}</span></td> 
            <td class="text-center"><button id="listarRondaModal" class="btn listarRondaModal" onClick="listarItemsRonda(${e.id},'${e.nombre}')"><i class="fa fa-eye" style="color:#2271B3"></i></button></td>
            <td class="text-center">
            <button class="btn btn-warning btn-sm rounded-pill" onClick="modalEditarRonda(${e.id},'${e.nombre}',${e.estado})">Editar</button>
            <button class="btn btn-danger btn-sm rounded-pill ml-4" onClick="eliminarRonda(${e.id})">Eliminar</button>
            </td>
            </tr>`);
         });
      }
   });
}


// LLenamos la tabla del modal de la ronda con los datos de items de ronda [RONDA]

function listarItemsRonda(id, nombredeRonda) {

   let idRonda = id;
   let nombreRonda = nombredeRonda;
   let idCliente = $('#clienteRondas').val();


   $("#tablaModalItemsRonda tbody").empty();
   $(".modal-title-items").html(nombreRonda);

   $("#idRondaModal").val(idRonda);


   $.ajax({
      type: "post",
      url: "itemsRonda",
      data: {
         idRonda: idRonda
      },
      success: function (data) {

         $datos = JSON.parse(data);

         $.map($datos, function (e, i) {

            let selectObjetivosId = 'objetivostableModal' + i;
            let puntoControlId = 'puntoControlModal' + i;

            $("#tablaModalItemsRonda tbody").append(`<tr">
            <td style="display:none"><input value="${e.id}"></input></td>
            <td style="width:400px">
            <select id="${selectObjetivosId}"> 
            <option value="${e.id_objetivo}" selected=selected>${e.objetivo}</option>
            </select>
            </td> 
            <td style="width:15px"><input value="${e.orden}" name = "orden"></td>
            <td style="width:75px"><input value="${e.tiempo}" name = "tiempo"></td>
            <td>  
            <div class="custom-control custom-checkbox">
            <input type="checkbox" value="${e.qr}" class="custom-control-input" id="qrCheck${i}" ${e.qr == 1 ? 'checked' : ''}>
            <label class="custom-control-label" for="qrCheck${i}"></label>
            </div>
            </td>
            <td>
            <div class="custom-control custom-checkbox">
            <input type="checkbox" value="${e.nfc}" class="custom-control-input" id="nfcCheck${i}" ${e.nfc == 1 ? 'checked' : ''}>
            <label class="custom-control-label" for="nfcCheck${i}"></label>
            </div>
            </td>
            <td>
            <div class="custom-control custom-checkbox">
            <input type="checkbox" value="${e.llegue}" class="custom-control-input" id="llegueCheck${i}" ${e.llegue == 1 ? 'checked' : ''}>
            <label class="custom-control-label" for="llegueCheck${i}"></label>
            </div>
            </td>
            <td style="width:400px"><select id="${puntoControlId}"><option selected=selected value="${e.puntocontrol_id}">${e.nombre}</option></select></td> 
            <td class="text-center">
            <button class="btn btn-danger rounded-pill btn-sm deleteItemModal" onClick="eliminarItemTablaModal(${e.id})">X</button>
            </td>
            </tr>`);

            $('#' + selectObjetivosId + '').prop('disabled', true);

            objetivosModal(idCliente, selectObjetivosId, e.id_objetivo, puntoControlId, e.puntocontrol_id);
            selectPuntosControl(selectObjetivosId, idCliente, puntoControlId, e.puntocontrol_id);

         });

      }
   });

   $('#listarItemRondaModal').modal('toggle');
}


// Eliminamos un item de la tabla items de ronda [RONDA]

$("#tabla-items-ronda").on("click", ".del", function () {
   $(this).parents("tr").remove();

   let contador = document.getElementById("ordenItemRonda").value;

   contador--;

   $('#ordenItemRonda').val(contador);

});



// Guardamos una nueva ronda [NUEVA RONDA]

function guardarRonda() {


   var ordenItemRonda = Array();
   var tiempoItemRonda = Array();
   var itemscontrol = Array();
   var QrCheck = Array();
   var NfcCheck = Array();
   var LlegueCheck = Array();

   var itemsronda = [];
   var itemstiempo = [];
   var itemscontrol = [];
   var qr = [];
   var nfc = [];
   var llegue = [];


   $('#tabla-items-ronda tbody tr td:nth-child(1)').each(function () {
      ordenItemRonda.push($(this).text());
   });

   $('#tabla-items-ronda tbody tr td:nth-child(2)').each(function () {
      tiempoItemRonda.push($(this).text());
   });
   $('#tabla-items-ronda tbody tr td:nth-child(3)').each(function () {
      itemscontrol.push($(this).text());
   });
   $('#tabla-items-ronda tbody tr td:nth-child(5)').each(function () {
      QrCheck.push($(this).attr('value'));
   });
   $('#tabla-items-ronda tbody tr td:nth-child(6)').each(function () {
      NfcCheck.push($(this).attr('value'));
   });
   $('#tabla-items-ronda tbody tr td:nth-child(7)').each(function () {
      LlegueCheck.push($(this).attr('value'));
   });


   qr = QrCheck;
   nfc = NfcCheck;
   llegue = LlegueCheck;
   itemsronda = ordenItemRonda;
   itemstiempo = tiempoItemRonda;
   itemscontrol = itemscontrol;


   $('#clienteNuevaRonda').attr("disabled", false);
   $('#objetivoClienteRonda').attr("disabled", false);

   // Validacion nombre de la Ronda
   let validacionNombre = $("#nombreRonda").val().length === 0 ? false : true;

   // Validacion de la tabla 
   let validacionTabla = $('#tabla-items-ronda tr td').length === 0 ? false : true;

   if (validacionNombre) {
      if (validacionTabla) {
         $.ajax({
            type: 'post',
            cache: false,
            url: '../ronda/guardoronda',
            data: {
               "cliente": $('#clienteNuevaRonda').val(),
               "nombre": $('#nombreRonda').val(),
               "itemsronda": itemsronda,
               "itemstiempo": itemstiempo,
               "itemscontrol": itemscontrol,
               "qrCheck": qr,
               "nfcCheck": nfc,
               "llegueCheck": llegue
            },
            success: function (data) {
               if (data) {
                  alert("Ronda cargada exitosamente");
                  location.href = "rondas";

               } else {
                  alert("Error al generar la ronda");
               }

            }
         });
      } else {
         alert("La tabla no puede quedar sin valores");
      }

   } else {
      alert("El nombre de la ronda no puede estar vacio");
   }

}

// Preguntamos si el control esta sujeto a una ronda antes de eliminarlo [PUNTO DE CONTROL]

function ControlSet(id) {
   let id_control = id;

   $.ajax({
      type: 'post',
      cache: false,
      url: 'puntocontrol/controlset',
      data: {
         id: id_control
      },
      success: function (data) {
         if (data > 0) {
            alert("El punto de control esta asociado a una ronda")
         } else {
            eliminarControl(id_control);
         }
      },
   });
}

// Eliminamos un control [PUNTO DE CONTROL]

function eliminarControl(id) {

   let id_control = id;

   $.ajax({
      type: 'post',
      cache: false,
      url: 'puntocontrol/eliminacontrol',
      data: {
         id: id_control
      },
      success: function (data) {
         alert("Control eliminado correctamente");
         listarPuntosControlCliente();

      },
      error: function (data) {
         alert("Error al eliminar el control");
      },
   });
}

// Cargamos el modal con los datos de la ronda [RONDA]

function modalEditarRonda(id, nombre, estado) {
   let id_ronda = id;
   let nombre_ronda = nombre;
   let estado_ronda = estado;

   $('#idRonda').val(id_ronda);
   $('#nombreRonda').val(nombre_ronda);
   $('#selectEstadosRonda option[value="' + estado_ronda + '"]').prop("selected", true);

   $('#modalRonda').modal('toggle');
}

// Guardamos la ronda editada

function editarRonda() {
   let idRonda = $('#idRonda').val();
   let nombreRonda = $('#nombreRonda').val();
   let estadoRonda = $('#selectEstadosRonda option:selected').val();
   let idCliente = $('#clienteRondas').val();
   let idObjetivo = $('#objetivosClienteAdminRonda').val();

   {
      if (nombreRonda.length > 0) {
         if (confirm('¿Desea modificar esta ronda?')) {
            $.ajax({
               type: "post",
               url: "./editarronda",
               data: {
                  idRonda: idRonda,
                  nombreRonda: nombreRonda,
                  estadoRonda: estadoRonda
               },
               success: function (data) {
                  alert("Se modifico la ronda correctamente");
                  $('#modalRonda').modal('toggle');
                  listarRondasCliente(idCliente,idObjetivo);

               }
            });
         }
      } else {
         alert("Nombre no puede estar vacío")
      }
   }

}

// Eliminamos una ronda 

function eliminarRonda(id) {

   let idRonda = id;

   if (confirm('¿Desea eliminar esta ronda?')) {
      $.ajax({
         type: "post",
         url: "./eliminarRonda",
         data: {
            idRonda: idRonda
         },
         success: function (data) {
            alert("Ronda eliminada satisfactoriamente");
            listarRondasCliente();

         }
      });
   }
}

// Listamos los objetivos del modal segun el cliente y segun el objetivo listo los puntos de control [RONDA]

function objetivosModal(idClienteRonda, selectObjetivosId, idObjetivo, puntoControlId, idPuntoControl) {


   $.ajax({
      type: "post",
      url: "objetivosModal",
      data: {
         id: idClienteRonda
      },
      success: function (data) {
         let datos = JSON.parse(data);
         $.map(datos, function (e, i) {
            if (idObjetivo != e.codigo_objetivo) {
               $("#" + selectObjetivosId + "").append("<option value=" + e.codigo_objetivo + ">" + e.nombre_objetivo + "</option>")

            }

         })
         $("#" + selectObjetivosId + "").on("change", function () {
            $("#" + puntoControlId + "").empty();
            selectPuntosControl(selectObjetivosId, idClienteRonda, puntoControlId, idPuntoControl);
         })
      }
   });
}

// Listamos los puntos de control segun el objetivo y el cliente

function selectPuntosControl(selectObjetivo, idClienteRonda, SelectpuntoControlId, idPuntoControl) {
   let objetivosIdModal = $("#" + selectObjetivo + " option:selected ").val();


   $.ajax({
      type: "post",
      url: "puntoscontrolCliente",
      data: {
         objetivoCliente: objetivosIdModal,
         id_cliente: idClienteRonda
      },
      success: function (data) {

         let datos = JSON.parse(data);
         $.map(datos, function (e, i) {
            // console.log(e.id == idPuntoControl);
            if (idPuntoControl !== e.id) {
               $("#" + SelectpuntoControlId + "").append("<option value=" + e.id + ">" + e.nombre + "</option>")
            }
         });
      }
   });
}


// Capturamos los datos editados de la tabla items de ronda modal [RONDA]

function guardarItemsRonda() {

   var idRondaItems = [];
   var itemsPuntoControl = [];
   var itemsOrdenronda = [];
   var itemstiempo = [];
   var qr = [];
   var nfc = [];
   var llegue = [];
   var itemsObjetivo = [];



   $('#tablaModalItemsRonda tbody tr td:nth-child(1)').each(function () {
      idRondaItems.push($(this).find("input").attr('value'));
   });

   $('#tablaModalItemsRonda tbody tr td:nth-child(8)').each(function () {
      console.log($("option:selected", this).val());
   });

   $('#tablaModalItemsRonda tbody tr td:nth-child(3)').each(function () {
      itemsOrdenronda.push($(this).find("input").val());
   });
   $('#tablaModalItemsRonda tbody tr td:nth-child(4)').each(function () {
      itemstiempo.push($(this).find("input").val());

   });
   $('#tablaModalItemsRonda tbody tr td:nth-child(5)').each(function () {
      if ($(this).find("input").is(":checked")) {
         $(this).find("input").val("1");
      } else {
         $(this).find("input").val("0");
      }
      qr.push($(this).find("input").val());
   });
   $('#tablaModalItemsRonda tbody tr td:nth-child(6)').each(function () {
      if ($(this).find("input").is(":checked")) {
         $(this).find("input").val("1");
      } else {
         $(this).find("input").val("0");
      }
      nfc.push($(this).find("input").val());
   });
   $('#tablaModalItemsRonda tbody tr td:nth-child(7)').each(function () {
      if ($(this).find("input").is(":checked")) {
         $(this).find("input").val("1");
      } else {
         $(this).find("input").val("0");
      }
      llegue.push($(this).find("input").val());
   });

   $.ajax({
      type: 'post',
      cache: false,
      url: '../ronda/guardoItemRondaActualizada',
      data: {
         "idRondaItems": idRondaItems,
         "itemsPuntoControl": itemsPuntoControl,
         "itemsOrdenronda": itemsOrdenronda,
         "itemstiempo": itemstiempo,
         "qrCheck": qr,
         "nfcCheck": nfc,
         "llegueCheck": llegue,
         "itemsObjetivo": itemsObjetivo
      },
      success: function (data) {
         if (confirm('¿Desea modificar esta ronda?')) {
            if (data) {
               alert("Ronda actualizada exitosamente");
               $('#listarItemRondaModal').modal('toggle');
               listarRondasCliente();

            } else {
               alert("Error al actualizar la ronda");
            }
         }


      }
   });
}

// Eliminamos un item de la tabla items de ronda
function eliminarItemTablaModal(idItemRonda) {

   $.ajax({
      type: 'post',
      cache: false,
      url: '../ronda/eliminoItemRondaModal',
      data: {
         idItemRonda: idItemRonda
      },
      success: function (data) {
         alert("Item eliminado correctamente");
      }
   });
}

// Removemos el item eliminado de la tabla items de ronda [RONDA]

$("#tablaModalItemsRonda").on("click", ".deleteItemModal", function () {
   $(this).parents("tr").remove();

});

$("#tablaModalAgregarItemsRonda").on("click", ".cancelNewItemModal", function () {
   $(this).parents("tr").remove();
   document.getElementById("newItemTable").style.display = "none";
   $('#newItemModalButton').attr("disabled", false);

});

$("#cancelModal").on("click", function () {
   $("#tablaModalAgregarItemsRonda").parents("tr").remove();
   document.getElementById("newItemTable").style.display = "none";
   $('#newItemModalButton').attr("disabled", false);

});

// Abrimos los input para cargar un nuevo item a la ronda desde el modal [RONDA]

function agregarItemTablaModal() {

   $('#newItemModalButton').attr("disabled", true);

   document.getElementById("newItemTable").style.display = "inline-block";

   let idObjetivoRonda = $("#objetivostableModal0 option:selected").val();

   let nombrebjetivoRonda = $("#objetivostableModal0 option:selected").text();

   let idCliente = $('#clienteRondas').val();


   $.ajax({
      type: "post",
      url: "../ronda/objetivosRondaCliente",
      data: {
         id_cliente: idCliente
      },
      success: function (data) {
         let datos = JSON.parse(data);
         $.map(datos, function (e, i) {
            $("#selectAgregarObjetivosId").append("<option value=" + idObjetivoRonda + " >" + nombrebjetivoRonda + "</option>")
         })
         selectAgregarPuntosControlId(idCliente);
      }
   });

   let nextOrden = $('#tablaModalItemsRonda tbody tr:last td:nth-child(3)').find('input').attr('value');

   nextOrden++;


   $("#tablaModalAgregarItemsRonda tbody").html(`
      <tr>
      <td style="width:400px">
         <select id="selectAgregarObjetivosId">
         </select>
      </td> 
      <td style="width:400px" data-column-id="puntoControlNewItem" class="newItemsOptions">
         <select id="selectNewPuntosControlId">
         <option selected=selected >Seleccione un punto de control</option>
      </td> 
      <td style="width:15px" class=""><input name="orden" id="ordenNewItem" value="${nextOrden}"></td>
      <td style="width:75px" class=""><input name="tiempo" id="tiempoNewItem"></td>
      <td class="">  
         <div class="custom-control custom-checkbox">
         <input type="checkbox" class="custom-control-input" id="qrCheckNewItem">
         <label class="custom-control-label" for="qrCheckNewItem"></label>
         </div>
      </td>
      <td class="">
         <div class="custom-control custom-checkbox">
         <input type="checkbox" class="custom-control-input" id="nfcCheckNewItem">
         <label class="custom-control-label" for="nfcCheckNewItem"></label>
         </div>
      </td>
      <td class="">
         <div class="custom-control custom-checkbox">
         <input type="checkbox" class="custom-control-input" id="llegueCheckNewItem">
         <label class="custom-control-label" for="llegueCheckNewItem"></label>
         </div>
      </td>
      <td style="width:150px" class="">
         <button class="btn btn-danger btn-sm rounded-pill cancelNewItemModal"><i style="margin-left:0" class="fa fa-times"></i></button> 
         <button class="btn btn-success btn-sm rounded-pill ml-2" onClick="newItemsRonda(this)"><i style="margin-left:0" class="fa fa-check"></i></button>
      </td>
      </tr>
  `);

   $('#selectAgregarObjetivosId').attr("disabled", true);
}

//Cargamos los puntos de control a seleccionar en los campos de nuevo item [RONDA]

function selectAgregarPuntosControlId(idCliente) {

   var selectObjetivosId = $("#selectAgregarObjetivosId").val();

   $.ajax({
      type: "post",
      url: "puntoscontrolCliente",
      data: {
         objetivoCliente: selectObjetivosId,
         id_cliente: idCliente
      },
      success: function (data) {

         let datos = JSON.parse(data);
         $.map(datos, function (e, i) {
            $("#selectNewPuntosControlId").append("<option value=" + e.id + ">" + e.nombre + "</option>")
         });
      }
   });
}

//Guardamos en la ronda el nuevo item generado [RONDA]

function newItemsRonda() {

   let idRondaNewItem = $("#idRondaModal").val();

   let llegueCheckNewItem = $("#llegueCheckNewItem").prop('checked') ? 1 : 0;
   let qrCheckNewItem = $("#qrCheckNewItem").prop('checked') ? 1 : 0;
   let nfcCheckNewItem = $("#nfcCheckNewItem").prop('checked') ? 1 : 0;

   let tiempoNewItem = $("#tiempoNewItem").val();
   let selectNewPuntosControlId = $("#selectNewPuntosControlId option:selected").val();
   let ordenNewItem = $("#ordenNewItem").val();

   // validacion de checkbox
   let validarCheckobox = llegueCheckNewItem || qrCheckNewItem || nfcCheckNewItem;

   // validacion orden 
   let validacionOrden = $("#ordenNewItem").val().length === 0 ? false : true;

   // validacion de tiempo 
   let validacionTiempo = $("#tiempoNewItem").val().length === 0 ? false : true;

   if (validarCheckobox) {
      if (validacionOrden && validacionTiempo) {
         $.ajax({
            type: 'post',
            cache: false,
            url: '../ronda/newItemRondaActualizada',
            data: {
               idRondaNewItem: idRondaNewItem,
               selectNewPuntosControlId: selectNewPuntosControlId,
               ordenNewItem: ordenNewItem,
               tiempoNewItem: tiempoNewItem,
               qrCheckNewItem: qrCheckNewItem,
               nfcCheckNewItem: nfcCheckNewItem,
               llegueCheckNewItem: llegueCheckNewItem
            },
            success: function (data) {
               if (confirm('¿Desea agregar este item a la ronda?')) {
                  if (data) {
                     alert("Item agregado exitosamente");
                     $("#tablaModalAgregarItemsRonda tbody").empty();
                     document.getElementById("newItemTable").style.display = "none";
                     $('#newItemModalButton').attr("disabled", false);
                     $('#listarItemRondaModal').modal('toggle');
                  } else {
                     alert("Error al generar el item");
                  }
               }
            }
         });
      } else {
         alert("No pueden haber campos vacios");
      }
   } else {
      alert("Debe seleccionar al menos un checkbox");
   }
}


//////////////////////************* COMIENZA DOCUMENT READY ***************///////////////////////////



$(document).ready(function () {

   /**************************** COMIENZA SCRIPTS DE PUNTOS DE CONTROL ************************************/

   // Logueamos al usuario

   $('.envialogin').on('click', function () {
      var usuario = $('#usuario').val();
      var pass = $('#password').val();

      $.ajax({
         type: 'post',
         cache: false,
         url: '../login/getlogin',
         data: {
            usuario: usuario,
            pass: pass
         },
         success: function (data) {
            if (data <= 0) {
               alert("Usuario Invalido");
            } else {
               location.href = "../puntocontrol";
            }

         }
      });
   });


   // Cargamos el objetivo segun el cliente seleccionado   

   $('.clienteControl').change(function () {

      var idcliente = $('#cliente').val();

      $("#tabla-control tbody").empty();

      $.ajax({
         type: 'post',
         cache: false,
         url: 'puntocontrol/listarobjetivo',
         data: {
            idcliente: idcliente,
         },
         success: function (data) {
            let datos = JSON.parse(data);
            $.map(datos, function (e, i) {
               $("#objetivo").append("<option value=" + e.codigo_objetivo + ">" + e.nombre_objetivo + "</option>"),
                  $("#modificarObjetivo").append("<option value=" + e.codigo_objetivo + ">" + e.nombre_objetivo + "</option>")
            })
         }
      });
      $("#objetivo option").not(':first').remove();
   })


   // LLenamos la tabla con los controles de cliente seleccionados
   $('.objetivoCliente').change(function () {

      var idcliente = $('#cliente').val();
      var objetivocliente = $('#objetivo').val();


      listarPuntosControlCliente(idcliente, objetivocliente);


   });


   // Mostrar/ocultar botones para generar un nuevo control

   $('.agregarControl').on('click', function (e) {
      e.preventDefault();
      document.getElementById("nombreControl").style.display = "inline-flex";
      document.getElementById("guardarControlbtn").style.display = "inline-flex";
      document.getElementById("cancelarCargaControlbtn").style.display = "inline-flex";
      document.getElementById("agregarControl").style.display = "none";

   });

   $('.cancelarCarga').on('click', function (e) {
      e.preventDefault();
      document.getElementById("nombreControl").style.display = "none";
      document.getElementById("guardarControlbtn").style.display = "none";
      document.getElementById("cancelarCargaControlbtn").style.display = "none";
      document.getElementById("nombre-punto-control").value = '';
      document.getElementById("agregarControl").style.display = "inline-flex";

   });

   // Generamos el alta de un nuevo control 

   $('.guardarControl').on('click', function () {
      var idcliente = $('#cliente').val();
      var nombre = $('#nombre-punto-control').val();
      var codigo_objetivo = $('#objetivo option:selected').val();
      var nombre_objetivo = $('#objetivo option:selected').text();

      let validacionNombrePuntoControl = $("#nombre-punto-control").val().length === 0 ? false : true;

      if (validacionNombrePuntoControl) {
         $.ajax({
            type: 'post',
            cache: false,
            url: 'puntocontrol/cargacontrol',
            data: {
               id: idcliente,
               nombre: nombre,
               id_objetivo: codigo_objetivo,
               objetivo: nombre_objetivo
            },
            success: function (data) {
               alert("Punto de control guardado exitosamente");
               listarPuntosControlCliente();

               document.getElementById("nombreControl").style.display = "none";
               document.getElementById("guardarControlbtn").style.display = "none";
               document.getElementById("cancelarCargaControlbtn").style.display = "none";
               document.getElementById("nombre-punto-control").value = '';
               document.getElementById("agregarControl").style.display = "inline-flex";

            }
         });
      } else {
         alert("El nombre del control no puede estar vacio.");
      }


   });



   // Guardamos un control editado

   $('.modificarControl').on('click', function (e) {
      e.preventDefault();

      var id = $('#idControlActulizar').val();
      var nombre = $('#controlActualizar').val();
      var id_objetivo = $('#modificarObjetivo').val();
      var objetivo = $('#modificarObjetivo option:selected').text();

      let validacionNombrePuntoControlModal = $("#controlActualizar").val().length === 0 ? false : true;

      if (validacionNombrePuntoControlModal) {
         $.ajax({
            type: 'post',
            cache: false,
            url: 'puntocontrol/actualizacontrol',
            data: {
               id: id,
               nombre: nombre,
               id_objetivo: id_objetivo,
               objetivo: objetivo
            },
            success: function (data) {
               alert("Control actualizado correctamente");
               $('#actualizarControlModal').modal('toggle');
               listarPuntosControlCliente();


            },
            error: function (data) {
               alert("Error al actualizar el control");
            }
         });
      } else {
         alert("El nombre del control no puede estar vacio");
      }




   });

   /**************************** FINALIZA SCRIPTS DE PUNTOS DE CONTROL ************************************/


   /**************************** COMIENZA SCRIPTS DE NUEVA RONDA *****************************************/

   // Cargamos el select de puntos de control segun el cliente seleccionado

   $('#objetivoClienteRonda').change(function () {

      let idcliente = $('#clienteNuevaRonda').val();
      let objetivoCliente = $('#objetivoClienteRonda').val();


      $.ajax({
         type: 'post',
         cache: false,
         dataType: "json",
         url: 'puntoscontrolCliente',
         data: {
            id_cliente: idcliente,
            objetivoCliente: objetivoCliente
         },
         success: function (data) {
            for (let i = 0; i < data.length; i++) {
               $("#puntoControlCliente").append('<option value="' + data[i].id + '">' + data[i].nombre + '</option>');
            }
         }
      });
      $("#puntoControlCliente option").not(':first').remove();
   });

   // LLenamos la tabla de items de ronda segun el cliente y el orden 

   $('.agregarItem').on('click', function (e) {

      let secuencia = $('#ordenItemRonda').val();
      let puntoControl = $('#puntoControlCliente option:selected').text();
      let idPuntoControl = $('#puntoControlCliente').val();
      let tiempoItemRonda = $('#tiempoItemRonda').val();

      $('#clienteNuevaRonda').attr("disabled", true);
      $('#objetivoClienteRonda').attr("disabled", true);


      if (document.getElementById('qrCheck').checked) {
         var qrCheck = $('#qrCheck').val();
      } else {
         var qrCheck = $('#qrCheck').value = "0";
      }

      if (document.getElementById('nfcCheck').checked) {
         var nfcCheck = $('#nfcCheck').val();
      } else {
         var nfcCheck = $('#nfcCheck').value = "0";
      }

      if (document.getElementById('llegueCheck').checked) {
         var llegueCheck = $('#llegueCheck').val();
      } else {
         var llegueCheck = $('#llegueCheck').value = "0";
      }



      let qrCheckIcon = (qrCheck == 0) ? '' : '<i class="fa fa-check"></i>';
      let nfcCheckIcon = (nfcCheck == 0) ? '' : '<i class="fa fa-check"></i>';
      let llegueCheckIcon = (llegueCheck == 0) ? '' : '<i class="fa fa-check"></i>';


      let validacionOrdenRonda = $("#tiempoItemRonda").val().length === 0 ? false : true;
      let validacionTiempoRonda = $("#tiempoItemRonda").val().length === 0 ? false : true;
      let validacionCheckoboxs = llegueCheckIcon || qrCheckIcon || nfcCheckIcon;

      if (validacionOrdenRonda && validacionTiempoRonda && validacionCheckoboxs) {

         $("#tabla-items-ronda").append('<tr> \
         <td id="secuencia" class="text-center w-2">'+ secuencia + '</td> \
         <td class="text-center w-2">'+ tiempoItemRonda + '</td> \
         <td style="display: none">'+ idPuntoControl + '</td> \
         <td value='+ idPuntoControl + ' class="text-center" >' + puntoControl + '</td> \
         <td value='+ qrCheck + ' class="text-center" >' + qrCheckIcon + '</td> \
         <td value='+ nfcCheck + ' class="text-center" >' + nfcCheckIcon + '</td> \
         <td value='+ llegueCheck + ' class="text-center" >' + llegueCheckIcon + '</td> \
         <td class="text-center del"><button class="btn btn-danger btn-sm rounded-pill">Eliminar</button></td>\
         </tr>');

         let contador = document.getElementById("ordenItemRonda").value;

         contador++;

         $('#ordenItemRonda').val(contador);


         document.getElementById("puntoControlCliente").value = '';
         document.getElementById("tiempoItemRonda").value = '';
         $('input[type="checkbox"]').prop('checked', false);

      } else {
         alert("No pueden haber campos vacio al agregar un item de ronda");
      }



   });

   // Cargamos el objetivo segun el cliente seleccionado de la ronda

   $('.ClienteRondas').change(function () {

      let idClienteRonda = $('#clienteRondas').val();

      $("#tabla-rondas-cliente tbody").empty();

      $.ajax({
         type: 'post',
         cache: false,
         dataType: "json",
         url: './objetivosClienteAdminRonda',
         data: {
            idClienteRonda: idClienteRonda,
         },
         success: function (data) {
            for (let i = 0; i < data.length; i++) {
               $("#objetivosClienteAdminRonda").append("<option value=" + data[i].codigo_objetivo + ">" + data[i].nombre_objetivo + "</option>")
            }
         }
      });
      $("#objetivosClienteAdminRonda option").not(':first').remove();

   });

   //Cargamos el select de puntos de control segune el cliente seleccionado [RONDAS]

   $('.clienteNuevaRonda').change(function () {

      let idcliente = $('#clienteNuevaRonda').val();


      $.ajax({
         type: 'post',
         cache: false,
         dataType: "json",
         url: './objetivosRondaCliente',
         data: {
            id_cliente: idcliente,
         },
         success: function (data) {
            for (let i = 0; i < data.length; i++) {
               $("#objetivoClienteRonda").append("<option value=" + data[i].codigo_objetivo + ">" + data[i].nombre_objetivo + "</option>")

            }
         }
      });
      $("#objetivoClienteRonda option").not(':first').remove();
   });

   // Habilitamos el boton de agregar item cuando seleccionamos cliente y objetivo [NUEVA RONDA]

   $('#objetivoClienteRonda').change(function () {
      $('#agregarItem').attr("disabled", false);
   });


   // Cargamos el select de puntos de control segun el objetivo seleccionado

   $('.objetivosClienteAdminRonda').change(function () {

      let filtro = null;
      let idClienteAdminRonda = $('#clienteNuevaRonda').val();
      let idObjetivoAdminRonda = $('#objetivosClienteAdminRonda').val();

      $("#tabla-rondas-cliente tbody").empty();
      
      listarRondasCliente(idClienteAdminRonda, idObjetivoAdminRonda, filtro);

   });


   // Filtramos las rondas segun el nombre

   $('.botonFiltroNombre').on('click', function () {

      let idClienteAdminRonda = $('#clienteNuevaRonda').val();
      let idObjetivoAdminRonda = $('#objetivosClienteAdminRonda').val();



      var ordenNombre = $('#spanNombre').attr('value');

      if (ordenNombre == "ASC") {
         ordenNombre == $("#spanNombre").attr("value", "DESC");
      } else {
         if (ordenNombre == "DESC") {
            ordenNombre == $("#spanNombre").attr("value", "ASC");
         }
      }

      console.log(ordenNombre);

      let filtroNombre = $('#botonFiltroNombre').attr("value");

      $("#tabla-rondas-cliente tbody").empty();

      listarRondasCliente(idClienteAdminRonda, idObjetivoAdminRonda, filtroNombre, ordenNombre);

   });

   // Filtramos las rondas segun la fecha

   $('.botonFiltroFecha').on('click', function () {

      let idClienteAdminRonda = $('#clienteNuevaRonda').val();
      let idObjetivoAdminRonda = $('#objetivosClienteAdminRonda').val();


      let ordenFecha = $('#spanFecha').attr('value');

      if (ordenFecha == "ASC") {
         ordenFecha == $("#spanFecha").attr("value", "DESC");
      } else {
         if (ordenFecha == "DESC") {
            ordenFecha == $("#spanFecha").attr("value", "ASC");
         }
      }

      let filtroFecha = $('#botonFiltroFecha').attr("value");

      $("#tabla-rondas-cliente tbody").empty();

      listarRondasCliente(idClienteAdminRonda, idObjetivoAdminRonda, filtroFecha, ordenFecha);

   });

   // Filtramos las rondas segun el estado

   $('.botonFiltroEstado').on('click', function () {

      let idClienteAdminRonda = $('#clienteNuevaRonda').val();
      let idObjetivoAdminRonda = $('#objetivosClienteAdminRonda').val();

      let ordenEstado = $('#spanEstado').attr('value');

      if (ordenEstado == "ASC") {
         ordenEstado == $("#spanEstado").attr("value", "DESC");
      } else {
         if (ordenEstado == "DESC") {
            ordenEstado == $("#spanEstado").attr("value", "ASC");
         }
      }

      let filtroEstado = $('#botonFiltroEstado').attr('value');

      $("#tabla-rondas-cliente tbody").empty();

      listarRondasCliente(idClienteAdminRonda, idObjetivoAdminRonda, filtroEstado, ordenEstado);

   });


});   
