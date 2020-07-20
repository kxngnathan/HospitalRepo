
$(document).ready(function(){
    
});
function validateAddProviderCategory()
{
    
    $('#addProviderCategory').data('validator', null);
    $("#addProviderCategory").unbind('validate');
    $("#addProviderCategory").validate({
      ignore:[],
      rules: {
        categoryName:{
            required:true,
        },
        categoryType:{
            required:true,
          },
        

      },
      messages: {
        categoryName:{
            required:"Fill out category name",
        },
        categoryType:{
            required:"Select type of category",
          },
        
      }
    });
}

function validateAddProductCategory()
{
    
    $('#addProductCategory').data('validator', null);
    $("#addProductCategory").unbind('validate');
    $("#addProductCategory").validate({
      ignore:[],
      rules: {
        categoryName:{
            required:true,
        },
        categoryId:{
          required:true,
      },
        
        

      },
      messages: {
        categoryName:{
            required:"Fill out category name",
        },
        categoryId:{
          required:"Select Provider Category",
      },
        
        
      }
    });
}



function validateProviderRegistrationForm()
{
    $('#registration-form').data('validator', null);
    $("#registration-form").unbind('validate');
    $("#registration-form").validate({
      ignore:[],
      rules: {
        providerName:{required:true,},
        categoryId:{required:true,},
        stateId:{required:true,},
        city:{required:true,},
        address:{required:true,},
        phoneNumber:{required:true,
          remote: {
            url: "/misc/checker",  // ATTENTION: Credentials sent as plain text, if you're not using HTTPS!
            type: "GET",
            data: {
              phone: function() {
                return $('#phone').val();
              },
              userId:function(){
                return $("#userId").val();
              },
              requestType:function(){
                return "phone";
              },
              
            },
          
          }
        },
        email:{required:true, email:true,
          remote: {
            url: "/misc/checker",  // ATTENTION: Credentials sent as plain text, if you're not using HTTPS!
            type: "GET",
            data: {
              email: function() {
                return $('#email').val();
              },
              userId:function(){
                return $("#userId").val();
              },
              requestType:function(){
                return "email";
              },
              
            },
          
          }},
        
        password:{required:true,},
      },
      messages: {
        providerName:{
            required:"Fill out name of stakeholder",
        },
        categoryId:{
            required:"Select category",
          },
          stateId:{
            required:"Select location state",
          },
          city:{
            required:"Select city",
          },
          address:{
            required:"Fill out address",
          },
          categoryId:{
            required:"Select category",
          },
          phoneNumber:{
            required:"Fill out phone number",
            remote:"Phone number is in use"
          },
        email:{
          required:"Fill out email address",
          remote:"Email address is in use"
        },
        
        password:{
          required:"Fill out password",
        },
        
      },
      errorPlacement: function(error, element) {
        var placement = $(element).data('error');
        if (placement) {
          $(placement).append(error)
        } else {
          if($(element).attr("name") == "password")
          {
            error.insertAfter($("#password-field"));
          }
          else{
            error.insertAfter(element);
          }
          
        }
      }
    
    });
}


function validateRegistrationForm()
{
    $('#registration-form').data('validator', null);
    $("#registration-form").unbind('validate');
    $("#registration-form").validate({
      ignore:[],
      rules: {
        firstName:{required:true,},
      
        phoneNumber:{required:true,
          remote: {
            url: "/misc/checker",  // ATTENTION: Credentials sent as plain text, if you're not using HTTPS!
            type: "GET",
            data: {
              phone: function() {
                return $('#phone').val();
              },
              userId:function(){
                return $("#userId").val();
              },
              requestType:function(){
                return "phone";
              },
              
            },
          
          }
        },
        email:{required:true, email:true,
          remote: {
            url: "/misc/checker",  // ATTENTION: Credentials sent as plain text, if you're not using HTTPS!
            type: "GET",
            data: {
              email: function() {
                return $('#email').val();
              },
              userId:function(){
                return $("#userId").val();
              },
              requestType:function(){
                return "email";
              },
              
            },
          
          }},
        
        password:{required:true,},
      },
      messages: {
        firstName:{
            required:"First name is required",
        },
       
          phoneNumber:{
            required:"Fill out phone number",
            remote:"Phone number is in use"
          },
        email:{
          required:"Fill out email address",
          remote:"Email address is in use"
        },
        
        password:{
          required:"Fill out password",
        },
        
      },
      errorPlacement: function(error, element) {
        var placement = $(element).data('error');
        if (placement) {
          $(placement).append(error)
        } else {
          if($(element).attr("name") == "password")
          {
            error.insertAfter($("#password-field"));
          }
          else{
            error.insertAfter(element);
          }
          
        }
      }
    
    });
}





function validateAddUserForm()
{
    $('#add-user').data('validator', null);
    $("#add-user").unbind('validate');
    $("#add-user").validate({
      ignore:[],
      rules: {
        firstName:{required:true,},
        lastName:{required:true,},
        privilege:{required:true,},
        phone:{required:true,
          remote: {
            url: "../includes/snippets/checker",  // ATTENTION: Credentials sent as plain text, if you're not using HTTPS!
            type: "GET",
            data: {
              phone: function() {
                return $('#phone').val();
              },
              id:function(){
                return 0;
              },
              requestType:function(){
                return "checkphone";
              },
              
            },
          
          }
        },
        email:{required:true, email:true,
          remote: {
            url: "../includes/snippets/checker",  // ATTENTION: Credentials sent as plain text, if you're not using HTTPS!
            type: "GET",
            data: {
              email: function() {
                return $('#email').val();
              },
              id:function(){
                return 0;
              },
              requestType:function(){
                return "checkemail";
              },
              
            },
          
          }},
        username:{required:true,
          remote: {
            url: "../includes/snippets/checker",  // ATTENTION: Credentials sent as plain text, if you're not using HTTPS!
            type: "GET",
            data: {
              username: function() {
                return $('#username').val();
              },
              id:function(){
                return 0;
              },
              requestType:function(){
                return "checkusername";
              },
              
            },
          
          }
        },
        password:{required:true,},
        confPassword:{required:true, equalTo:"#password"},
       

      },
      messages: {
        firstName:{
            required:"Fill out first name",
        },
        lastName:{
            required:"Fill out last name",
          },
          privilege:{
            required:"Select Privilege",
        },
        phone:{
            required:"Fill out phone number",
            remote:"Phone number is in use"
          },
        email:{
          required:"Fill out email address",
          remote:"Email address is in use"
        },
        username:{
          required:"Fill out username",
          remote:"Username is in use"
        },
        password:{
          required:"Fill out password",
        },
        confPassword:{
          required:"Confirm password",
          equalTo:"Passwords do not match"
        },
        


      }
    });
}


