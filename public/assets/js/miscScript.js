var lastNotificationOffset = 0;
$(document).ready(function(){

    $("#revealPassword").click(function(e){
        toggleReveal();
    });
    $(".select2").select2();

    $( ".date").datepicker({changeMonth:true, changeYear:true, dateFormat:"yy-mm-dd"});
    $(".confirm").click(function(e){
        
        if(confirm("Are you sure")){
            return true;
        }
        else{
            e.preventDefault();
            return false;
        }
    })

     //click the notification icon to show notifications 
     $("#showNotifications").click(function(e){
         setTimeout(function(){
            if($(".dropdown-menu-right").hasClass("show"))
            {
                getNotifications();
            }
         }, 400);
        
    });

    $(".social_icon").hover(function(){
        $(this).removeClass("filter_white");
    }, function(){
        $(this).addClass("filter_white");
    })
});


function getNotifications()
{
    $("#notificationsArea").append('<a href="javascript:void(0)" id="notificationLoading"><div class="media"><i class=" fa fa-circle-o-notch fa-spin fa-align-center " style="margin-left:auto; margin-right:auto;"></i></div></a>');
    $.ajax({
        url:"/misc/get-notifications",
        data:{offset:lastNotificationOffset},
        type:"GET",
        success:function(response){
           
            var data = response;
            html = "";
            $("#notificationLoading").remove();
            for(var i=0; i<data.length; i++)
            {
                const title = data[i]["title"];
                const message = data[i]["message"];
                const daysAgo = data[i]["dateCreated"];
                html += '<a href="javascript:void(0)">'+
                    '<div class="media">'+
                        '<div class="media-left align-self-center"><i class="ft-plus-square icon-bg-circle bg-cyan"></i></div>'+
                            '<div class="media-body">'+
                                '<h6 class="media-heading">'+title+'</h6>'+
                                '<p class="notification-text font-small-3 text-muted">'+message+'</p><small>'+
                                '<time class="media-meta text-muted" datetime="2015-06-11T18:29:20+08:00">'+daysAgo+'</time></small>'+
                            '</div>'+
                        '</div></a>';
            }

            //lastNotificationOffset = lastNotificationOffset + 4;
            $("#notificationsArea").append(html);
        },
        error:function(xhr, status){
            console.log(status);
        }
    })

}
function getCitiesForState(stateId, cityElId)
{
    $(cityElId).next(".select2-container").find(".select2-selection__arrow").append("<i class='fa fa-spinner fa-spin'></i>");
    //$(cityElId).next(".select2-container").remove();
    $.ajax({
        url:"/misc/get-cities-for-state",
        type:"GET",
        data:{stateId:stateId},
        success:function(response){
            $(cityElId).next(".select2-container").find(".select2-selection__arrow").find(".fa-spinner").remove();
            var html = "<option value=''>Select City</option>";
            for(var i=0; i<response.length; i++)
            {
                html += "<option value='"+response[i]['id']+"'>"+response[i]["name"]+"</option>"
            }
            $(cityElId).html(html);
            $(cityElId).trigger("change");
        },
        error:function(xhr, status)
        {

        }
    })
}

function getProductsForCategory(categoryId, productElId)
{
    $(productElId).next(".select2-container").find(".select2-selection__arrow").append("<i class='fa fa-spinner fa-spin'></i>");
    //$(cityElId).next(".select2-container").remove();
    $.ajax({
        url:"/misc/get-products-for-category",
        type:"GET",
        data:{categoryId:categoryId},
        success:function(response){
            $(productElId).next(".select2-container").find(".select2-selection__arrow").find(".fa-spinner").remove();
            var html = "<option value=''>Select Product/Service</option>";
            for(var i=0; i<response.length; i++)
            {
                html += "<option value='"+response[i]['id']+"'>"+response[i]["name"]+"</option>";
            }
            $(productElId).html(html);
            //$(productElId).trigger("change");
        },
        error:function(xhr, status)
        {

        }
    })
}
function getProductsForProviderCategory(providerUserId, categoryId, branchId, productElId)
{
    $(productElId).next(".select2-container").find(".select2-selection__arrow").append("<i class='fa fa-spinner fa-spin'></i>");
    //$(cityElId).next(".select2-container").remove();
    $.ajax({
        url:"/misc/get-products-for-category",
        type:"GET",
        data:{categoryId:categoryId, providerUserId:providerUserId, branchId:branchId},
        success:function(response){
           // console.log(response);
            $(productElId).next(".select2-container").find(".select2-selection__arrow").find(".fa-spinner").remove();
            var html = "<option value=''>Select Product/Service</option>";
            for(var i=0; i<response.length; i++)
            {
                html += "<option data-productCategoryId='"+response[i]["productCategoryId"]+"' value='"+response[i]['id']+"'>"+response[i]["name"]+" - "+ response[i]["productName"]+"</option>";
                if(typeof productPrices !== "undefined")
                {
                    
                    productPrices[response[i]["id"]] = response[i]["actualCost"];
                }
                console.log(productPrices);
            }
            $(productElId).html(html);
            //$(productElId).trigger("change");
        },
        error:function(xhr, status)
        {

        }
    })
}

function showSuccess(title, message, duration )
{
    toastr.success(title, message, { timeOut: duration });
}
function showError(title, message, duration)
{
    toastr.error(title, message, { timeOut: duration });
  
}

function toggleReveal() {
    var x = document.getElementById("password");
    if (x.type === "password") {
        x.type = "text";
        $(".password-field").find("i").removeClass("fa-eye");
        $(".password-field").find("i").addClass("fa-eye-slash");
    } else {
        x.type = "password";
        $(".password-field").find("i").removeClass("fa-eye-slash");
        $(".password-field").find("i").addClass("fa-eye");
    }
}
function formatNumber(num) {
    return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
}
function getDaysAgo(date)
{
    return date;
}

  function payWithPaystack(totalAmount, email, ref, customerName, phone, callback){
   
    var handler = PaystackPop.setup({
      //key: 'pk_test_efdd16202412de7fad879431fc3a4123a561fbfc',
      key: 'pk_test_3a5ff4ca75957d8112daf8c08c1f07e890eceaec',
      email: email,
      amount: (totalAmount),
      currency: "NGN",
      ref:ref,
      metadata: {
         custom_fields: [
            {
                display_name: "Mobile Number",
                variable_name: "mobile_number",
                value: phone
            },
            {
                display_name: "Customer's Name",
                variable_name: "customer_name",
                value: customerName
            }
         ]
      },
      callback: function(response){
          callback(response);
          
         
      },
      onClose: function(){
          callback({status:"error"});
          alert('Transaction cancelled');
      }
    });
    handler.openIframe();
  }


  function getRequstStatus(status)
  {
      switch(status)
      {
          case 0:
            return "Pending";
         case 1:
             return "Processing";
         case 10:
             return "Completed";
      }
  }


  function getUserSummaries()
  {
      $.ajax({
          url:"/misc/get-user-summaries",
          type:"GET",
          data:{},
          success:function(res){
             var data = JSON.parse(res);
             var completedRequests = (typeof data[0]["completedRequest"] == "undefined") ? data[0]["completedRequest"]: 0
             var pendingRequest = (typeof data[0]["pendingRequest"] == "undefined") ? data[0]["pendingRequest"]: 0
             $("#totalRequests").html(data[0]["totalRequest"]);
             $("#completedRequests").html(completedRequests);
             $("#pendingRequests").html(pendingRequest);
          },
          error:function(xhr, status)
          {

          }
      })
  }

  function getProviderSummaries()
  {
      $.ajax({
          url:"/misc/get-provider-summaries",
          type:"GET",
          data:{},
          success:function(res){
             var data = JSON.parse(res);
             console.log(data);
             var completedRequests = (typeof data[0]["completedRequest"] != "undefined") ? data[0]["completedRequest"]: 0
             var pendingRequest = (typeof data[0]["pendingRequest"] != "undefined") ? data[0]["pendingRequest"]: 0;
             var avgRating = (typeof data[0]["rating"] != "undefined") ? data[0]["rating"]: 0;
             var totalIncome = (typeof data[0]["totalIncome"] != "undefined") ? data[0]["totalIncome"]: 0;
            
            
             $("#totalRequests").html(data[0]["totalRequest"]);
             $("#completedRequests").html(completedRequests);
             $("#pendingRequests").html(pendingRequest);
             $("#pendingRequests").html(pendingRequest);
             $("#totalIncome").html("&#8358;"+formatNumber(totalIncome));
             if(data[0]["totalNotifications"] > 0)
             {
                $("#notificationCount").html(data[0]["totalNotifications"])
             }
             
             $("#avgRating").html('<div id="half-star" style="cursor: pointer;"><div class="starrr" id="star1" data-value="'+avgRating+'"></div></div>');
             if(jQuery.fn.starrr)
             {
                $('#star1').starrr({
                    change: function(e, value){
                      if (value) {
                            $("#ratingValue").val(value);
                      } else {
                        
                      }
                    },
                    rating:avgRating,
                    readOnly: true
                  });
             }
             
          },
          error:function(xhr, status)
          {

          }
      })
  }



  function getAdminSummaries()
  {
      $.ajax({
          url:"/misc/get-admin-summaries",
          type:"GET",
          data:{},
          success:function(res){
             var data = JSON.parse(res);
             
             var completedRequests = (typeof data[0]["completedRequest"] != "undefined") ? data[0]["completedRequest"]: 0
             var pendingRequest = (typeof data[0]["pendingRequest"] != "undefined") ? data[0]["pendingRequest"]: 0;
             var totalProviders = (typeof data[0]["totalProviders"] != "undefined") ? data[0]["totalProviders"]: 0;
             var totalClients = (typeof data[0]["totalClients"] != "undefined") ? data[0]["totalClients"]: 0;
             //var totalRequests = (typeof data[0]["rating"] != "undefined") ? data[0]["rating"]: 0;
             var totalIncome = (typeof data[0]["totalIncome"] != "undefined") ? data[0]["totalIncome"]: 0;
            
            
             $("#totalRequests").html(data[0]["totalRequests"]);
             $("#completedRequests").html(completedRequests);
             $("#totalProviders").html(totalProviders);
             $("#totalClients").html(totalClients);
             $("#pendingRequests").html(pendingRequest);
             $("#totalIncome").html("&#8358;"+formatNumber(totalIncome));
             
             
          },
          error:function(xhr, status)
          {

          }
      })
  }

  function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
  }
  function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  }

  String.prototype.trunc = String.prototype.trunc ||
      function(n){
          return (this.length > n) ? this.substr(0, n-1) + '&hellip;' : this;
      };