$(document).ready(function (e) {

	// Highlight the service name found in payment page
	highlight_service_name();

	$('#payment-form').hide();	
	// $('#button_visiting, #button_telemedicine, #button_urgent').click(function() { 
	// 	alert('click'); 
	// });

	$('.brokenbone_sub').hide();
	$('.sprain_sub').hide();
	$('.swelling_sub').hide();

	// Select country to symptom
	$('#project-contact-us-button-usa').click(function() { 
		location.href = "../service/usa"; 
	});

	$('#project-contact-us-button-mex').click(function() { 
		location.href = "../service/mex"; 
	});

	$('#project-contact-us-button-crc').click(function() { 
		location.href = "../service/crc"; 
	});
	
	// Select country
	$("#consult-country").change(function(){
		var val = $(this).val();
        location.href = "../service/"+val;
	});

	$("#project-contact-us-button").click(function() {
		
		var formData = $("#personalData").serialize();
		var csrfToken = $("#csrf").val();

		$.ajax({
	        url:'create',
	        method:'post',
	        data: formData,
	        dataType:'json',
	        beforeSend: function (xhr) {
	            xhr.setRequestHeader('X-CSRF-Token', csrfToken);
	            $("#project-contact-us-button").prop('disabled', true);
	            $("#project-contact-us-button").text('PROCCESSING...');
	            //lazy-loader.gif
	        }, 
	        success: function(res){
	        	
	        	$("#project-contact-us-button").prop('disabled', false);
	        	if (typeof(res.success) === 'undefined')
	        	{	   
	        		errorMessage(res.errors);
	        	}
	        	else
	        	{
	        		if (res.success > 0)
	        		{
	        			
	        		 	$("#project-contact-us-button").text('CREATE ACCOUNT');
	        		 	
	        		 	location.href = "../payment/"+res.success;
	        		}
	        		else
	        		{
	        			$("#errormessage").html('<strong>We found an error.</strong>');
	        		}
	        		
	        	}
	        },
	        complete: function(){
	            //console.log('Finalizado');
	            $("#project-contact-us-button").text('CREATE ACCOUNT');
	        },
	        error: function(XMLHttpRequest, textStatus, errorThrown) {
	        	$("#project-contact-us-button").text('CREATE ACCOUNT');
	        	$("#errormessage").html('We found an error: <strong>'+textStatus+'.</strong>');
	            console.log(errorThrown);
	        }
	    })

	});

	// Clean the fields of errors

	$("#name").change(function() { $("#id_name").text(''); });

	$("#gender").change(function() { $("#id_gender").text(''); });

	$("#birthdate").change(function() { $("#id_birthdate").text(''); });

	$("#mobile").change(function() { $("#id_mobile").text(''); });

	$("#location").change(function() { $("#id_location").text(''); });

	$("#address").change(function() { $("#id_address").text(''); });

	$("#email").change(function() { $("#id_email").text(''); });

	$("#contactby").change(function() { $("#id_contactby").text(''); });

	// Process the sympthom pages
	$('#project-contact-us-button-0').click(function(){
		
		if(!validateSymptom('#symptom'))
		{ajax('symptom');
			//ajaxForm($('#symptom')); // Ver cómo guardar los datos.
		} 
	});

	$('#project-contact-us-button-1').click(function(){

		if(!validateSymptom('#symptom1'))
		{ajax('symptom1');
			//ajaxForm1($('#symptom1'));
		} 
	});

	$('#project-contact-us-button-2').click(function(){

		if(validateSymptom2()===false)
		{	ajax('symptom2');
			//ajaxForm2($('#symptom2'));
		} 
		
	});

	$('#project-contact-us-button-3').click(function(){
		
		if(!validateSymptom('#symptom3'))
		{
			ajaxForm3($('#symptom3'));
			// location.href = "../personal/";
		} 
	});

	$('#project-contact-us-button-login, #project-contact-us-button-back').click(function(){
		location.href = "../home";
	});

	// If the person click on 'yes', it shows their subsections
	$('#brokenbone_yes').click(function() { $(".brokenbone_sub").show(); });
	$('#brokenbone_no').click(function() { $(".brokenbone_sub").hide(); });

	$('#sprain_yes').click(function() { $(".sprain_sub").show(); });
	$('#sprain_no').click(function() { $(".sprain_sub").hide(); });
	
	$('#swelling_yes').click(function() { $(".swelling_sub").show(); });
	$('#swelling_no').click(function() { $(".swelling_sub").hide(); });

	// $(".Button-animationWrapper-child--primary Button").click(function() {
		
	// 	var formData = $(".Modal-form").serialize();
		
	// 	$.ajax({
	//         url:'charge',
	//         method:'post',
	//         data: formData,
	//         dataType:'json',
	//         beforeSend: function (xhr) {
	            	            
	//         }, 
	//         success: function(res){
	        	
	//         	$("#message").text('<h1>Successfully charged $50.00!</h1>');
	        	
	//         },
	//         complete: function(){
	//             //console.log('Finalizado');
	//             $("#project-contact-us-button").text('CREATE ACCOUNT');
	//         },
	//         error: function(XMLHttpRequest, textStatus, errorThrown) {
	//         	$("#project-contact-us-button").text('CREATE ACCOUNT');
	//             console.log(errorThrown);
	//         }
	//     })

	// });

})


/*
---------------------------------------------------------------------------

					FUNCTIONS TO PROCCESS FORMS

---------------------------------------------------------------------------
*/


function resetForm(form) {
    form.find('input:text, input:password, input:file, select, textarea').val('');
    $('#birthdate').val('');
    form.find('input:radio, input:checkbox')
         .removeAttr('checked').removeAttr('selected');
}

function validate(formdata)
{
	console.log(formdata);
	// name=&gender=&birthdate=&mobile=&location=&address=&email=&contactby=sms&namealternate=&relationship=
	return false;
}

// Create message for each field wrong
function errorMessage(formdata)
{
	var message = [];
	
	$.each(formdata, function(key, value) {
	    if(typeof(value[key])!=='undefined') $("#id_"+key).html('(*) '+value[key]+'<br/>');
	});
	
	$("#errormessage").html('<strong>There were errors below.</strong>');
}

// This validate the options of the symptoms
function validateSymptom(form)
{
	var error = formSymptom1Fields($(""+form+" input"), form);

	if(error ===true) $(form+'_error').text('You must select all symptoms.');
	
	return error;
        
}

// Scroll through the symptom1 form fields
function formSymptom1Fields(form, id_form)
{
	var nombre = '';
	var tipo = '';
	var valor = '';
	var error = false;
	var val = '';
			
	form.each(function(){
                
        nombre = $(this).context.name;

        tipo = $(this).context.type;

        valor = $(this).context.value;

        $('#error_'+nombre+"").text('');

        if(tipo==='radio' && !$("input[name='"+nombre+"']:checked", ""+id_form+"").is(":checked"))
        {
        	
        	$('#error_'+nombre+"").text('(*)');

        	error = true;
        }

        call_emergency(nombre,id_form); // Redirect to page for calling to 911
        
        // Use these lines if the input text must be mandatory
        // if(tipo==='text')
        // {
        // 	if(valor.length<1)
        // 	{
        // 		val = '(*)';
        // 		error = true;
        // 	}
        	
        // 	$('#error_'+nombre+"").text(val);
        // }
			
	});
	return error;
}

// Ajax for processing data from forms symptom
function ajax(form)
{
	var formData = $('#'+form+'').serialize();

	var sendForm = getnextform(form);

	$.ajax({
        url:''+form+'',
        method:'post',
        data: formData,
        // dataType:'json',
        beforeSend: function (xhr) {
            // xhr.setRequestHeader('X-CSRF-Token', csrfToken);
        }, 
        success: function(res){
        	location.href = ""+sendForm+"";
        },
        complete: function(){
            //console.log('Finalizado');
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            console.log(errorThrown);
        }
    });
}

// This validate the options of the symptoms
function validateSymptom2()
{
	var error = formSymptom2Fields($("#symptom2 input"));

	if(error ===true) $('#symptom2_error').text('You must select and type down all fields.');
	
	return error;
        
}

// Scroll through the symptom1 form fields
function formSymptom2Fields(form)
{
	var error = false;

	$('#symptom2_error').text('');
	
	error = processFields('brokenbone', '#symptom2');

	error = processFields('sprain', '#symptom2');

	error = processFields('swelling', '#symptom2');

	return error;
}

// Process each mandatory field with option 'Yes' on symptom2 form
function processFields(name, form)
{

	$('#error_'+name+"").text('');
	$('#error_'+name+'_where').text('');
	$('#error_'+name+'_accident').text('');
	var error = false;

	if(!$("input[name='"+name+"']:checked", form).is(":checked"))
	{
		$('#error_'+name+"").text('(*)');
		error = true;
	}

	if($('#'+name+'_yes').is(":checked"))
	{
		if($('#'+name+'_where').val().length<1)
    	{
    		$('#error_'+name+'_where').text('(*)');
    		error = true;
    	}

		if(!$("input[name='"+name+"_accident']:checked", form).is(":checked"))
		{
			$('#error_'+name+'_accident').text('(*)');
			error = true;
		}
	}

	return error;
}


// Ajax for processing data
	// function ajaxForm3(form)
	// {
	// 	var formData = form.serialize();
	// 	$.ajax({
	//         url:'create',
	//         method:'post',
	//         data: formData,
	//         //dataType:'json',
	//         beforeSend: function (xhr) {
	//             // xhr.setRequestHeader('X-CSRF-Token', csrfToken);
	//             $('#project-contact-us-button-3').prop( "disabled",true);
	//         }, 
	//         success: function(res){
	//         	var datos = JSON.stringify(res)
	//         	console.log(datos.length);

	//         	$('#project-contact-us-button-3').prop( "disabled",false);
	//         	if(datos.length==3) location.href = "../personal/";
	//         	else $('#symptom3_error').text('There was an error with the process.');
	//         },
	//         complete: function(){
	//             //console.log('Finalizado');
	//         },
	//         error: function(XMLHttpRequest, textStatus, errorThrown) {
	//             console.log(errorThrown);
	//             $('#symptom3_error').append(errorThrown);
	//         }
	//     });
	// }


function ajaxForm3(form)
{
	var formData = form.serialize();
	$.ajax({
        url:'update',
        method:'post',
        data: formData,
        //dataType:'json',
        beforeSend: function (xhr) {
            $('#project-contact-us-button-3').prop( "disabled",true);
        }, 
        success: function(res){
        	var id = 0;

        	if (!isNaN(res))
        	{
        		id = parseInt(res);
        	}

        	$('#project-contact-us-button-3').prop( "disabled",false);
        	if(id > 0) location.href = "../personal/"+id;
        	else $('#symptom3_error').text('There was an error with the process.');
        },
        complete: function(){
            //console.log('Finalizado');
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            console.log(errorThrown);
            $('#symptom3_error').append(errorThrown);
        }
    });
}

// If the radio button selected 'yes', redirect to page for calling to 911
function call_emergency(name,id_form)
{
	var value = $("input:radio[name='"+name+"']:checked").val();
	if(id_form =='#symptom')
	{
		if(value==1) location.href = "call911";
	}
}

// Remove the last letter and sum 1 for sending following form
function getnextform(form)
{
	var sendForm = '';
	var num = null;
	var number = null;
	var newForm = '';

	if(form!=='symptom')
	{
		num = form.charAt(form.length-1);
		number = parseInt(num)+1;
		newForm = form.slice(0,-1);
		sendForm = newForm+''+number;
	}
	else
	{
		sendForm = 'symptom1';
	}

	return sendForm;
}

/*
---------------------------------------------------------------------------

					FUNCTIONS TO PROCCESS PAYMENTS: METHODS, FORMS

---------------------------------------------------------------------------
*/

function highlight_service_name()
{
	var service = $('#service_name').val();

	$('div > #service_'+service).addClass("highlight");

	$('div > #service_name_'+service).removeClass("bg-extra-dark-gray").addClass( "bg-cian" );
	
	$('div > #button_'+service).removeClass("btn-transparent-dark-gray").addClass( "btn-cian" );
}     