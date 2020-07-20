

var statesHtml = "";
var allHtml = "";
var selStateId = 0;
var stateList = new Array();
var providerUserId = 0;
var productPrices = {};
var branches = {};
var cart = new Array();
var totalAmount = 0;

$(document).ready(function(){
    doAnimation();
    getCategories();//get all categories in side;
    
    $("#categoryId").change(function(e){
        var selVal = $(this).val();
        var branchId = $("#branchId").val();
        getProductsForProviderCategory(providerUserId, selVal, branchId, "#productCategoryId");
    });
    $("#addToCart").click(function(e){
        addItemsToCart();
    })
    $( "#queryInput" ).autocomplete({
        source: function( request, response ) {
         // Fetch data
         $.ajax({
          url: "/misc/get-categories-for-keyword",
          type: 'get',
          dataType: "json",
          html:true,
          data: {
           search: request.term,
           stateId:selectedStateId,
           cityId:selectedCityId,
          },
          success: function( data ) {
            const inputWidth = $("#queryInput").css("width");
            console.log(inputWidth)
            $(".ui-menu").css("width", "100px !important");
           response( data );
          }
         });
        },
        select: function (event, ui) {
         // Set selection
         $('#queryInput').val(ui.item.label); // display the selected text
         $('#selectuser_id').val(ui.item.value); // save selected id to input
         return false;
        }
       }).data("ui-autocomplete")._renderItem = function( ul, item ) {
            var html = item.text;
            //return ul.append(html);
            return $( "<li class='ui-autocomplete-row'></li>" )
            //.data( "item.autocomplete", item )
            //.append( item.categoryId )
            .append(html)
            .appendTo( ul );
        };;
    
    $("#locationPicker").click(function(e){
        $("#locationModal").modal("show");
        $.ajax({
            url:"/misc/get-all-states",
            data:{},
            type:"GET",
            success:function(response)
            {
                allHtml = "<div class='row'>";
               // statesHtml = "<div class='row'><div class='col-sm-3'>";
                allHtml += "<div class='col-sm-4' style='padding-bottom:5px;'><a href='javascript:void(0);' onclick='setLocation(\"\",\"\", \"All Nigeria\")'  class='locationLink'>All Nigeria</a></div>"
                for(var i=0; i<response.length; i++)
                {
                    stateList.push({id:response[i]["id"], name:response[i]["name"]});
                    //statesHtml += "<div class='row'><div class='col-sm-12'><a href='javascript:void(0);' onclick='getCities("+response[i]["id"]+")' data-stateId='"+response[i]["id"]+"' class='locationLink'>"+response[i]["name"]+"</a></div></div>"
                    allHtml += "<div class='col-sm-4' style='padding-bottom:5px;'><a href='javascript:void(0);' onclick='getCities("+response[i]["id"]+", \""+response[i]["name"]+"\")' data-stateId='"+response[i]["id"]+"' class='locationLink'>"+response[i]["name"]+"</a></div>"
                }
                //statesHtml += "</div><div id='citiesArea' class='col-sm-9'></div></div>"
                allHtml += "</div>";
                $("#locationArea").html(allHtml);
            },
            error:function(xhr, status){

            }
        })
    });

    $("#placeRequest").click(function(e){
        makePayment();
    })

    $("#productCategoryId").change(function(e){
        console.log(productPrices);
        var productId = $(this).val();
        let price = productPrices[productId]; 
        let html = "Cost: <span class='crosstext'>&#8358;"+formatNumber(price)+"</span> But you pay: &#8358;"+formatNumber(price * 0.9);
        $("#priceArea").html(html);
    });


   
});

function rebuildCart()
{
    totalAmount = 0;
    $("addedItems").html("");
    let html = ""
    for(var i=0; i<cart.length; i++)
    {
        html += "<tr id='row_"+i+"'>";
        html += "<td>"+cart[i]["productName"]+"</td>";
        html += "<td>"+cart[i]["branchName"]+"</td>";
        html += "<td>&#8358;"+formatNumber(cart[i]["amount"])+"";
        html += "<a href='javascript:void(0);' onclick='removeCartRow(\""+i+"\")'> <i class='fa fa-ban'></i></a></td>";
        totalAmount += parseFloat(cart[i]["amount"]);
    }
    html += "<tr><th colspan='2' align='right'>Total </th><th>&#8358;"+formatNumber(totalAmount)+"</th></tr>"
    $("#addedItems").html(html);
}
function productIsAdded(providerProductId)
{
    for(var i=0; i<cart.length; i++)
    {
        if(cart[i]["providerProductId"] == providerProductId)
        {
            return true;
        }
    }
    return false;
}

function removeCartRow(index)
{
    if(confirm("Are you sure"))
    {
        $("#row_"+index).remove();
        cart.splice(index, 1);
        rebuildCart();
    }
    
}
function addItemsToCart()
{
    let branchId = $("#branchId").val();
    let branchName = branches[branchId];
    let categoryId = $("#categoryId").val();
    let remarks = $("#remarks").val();
    let providerProductId = $("#productCategoryId").val();
    let productCategoryId = $('#productCategoryId option:selected').attr('data-productCategoryId');
    let qty = 1;
    let productName = $("#productCategoryId option:selected").html();
    let amount = productPrices[providerProductId] * 0.9;
    if(!productIsAdded(providerProductId))
    {
        cart.push({remarks:remarks, productName:productName, branchId:branchId, branchName:branchName, categoryId:categoryId, providerProductId:providerProductId, productCategoryId:productCategoryId, qty:qty, amount:amount});
        rebuildCart();
    }
    else{
        alert("Item has already been added")
    }
    
    
}



function getCities(stateId, stateName)
{
    selStateId = stateId;
    $.ajax({
        url:"/misc/get-cities-for-state",
        data:{stateId:stateId},
        type:"GET",
        success:function(response){
          
           var startAdding = false;
           statesHtml = "<div class='row stateView'><div class='col-sm-3'><div class='row'>";
                    
           for(var i=0; i<stateList.length; i++)
           {
                if(stateList[i]["id"] == stateId)
                {   
                    startAdding = true;
                    statesHtml += "<div class='col-sm-12' style='padding-bottom:5px;'><a href='javascript:void(0);'  onclick='reset()' data-cityId='"+stateList[i]["id"]+"' class='backLink info'><i class='fa  fa-arrow-left'></i>"+stateList[i]["name"]+"</a></div>";
                    continue;
                }
                if(startAdding){
                    statesHtml += "<div class='col-sm-12' style='padding-bottom:5px;'><a href='javascript:void(0);' onclick='getCities("+stateList[i]["id"]+", \""+stateList[i]["name"]+"\")' data-cityId='"+stateList[i]["id"]+"' class='locationLink'>"+stateList[i]["name"]+"</a></div>";
                }
           }
           statesHtml += "</div></div><div  class='col-sm-9'><div id='citiesArea' class='row'></div></div>";
           $("#locationArea").html(statesHtml);
           //$("#citiesArea").height($("#locationArea").height());
            html = "<div class='col-sm-4' style='padding-bottom:5px;'><a href='javascript:void(0);' onclick='setLocation("+stateId+", 0, \"All "+stateName+"\")'  class='locationLink'>All "+stateName+"</a></div>";
           for(var i=0; i<response.length; i++)
            {
                html += "<div class='col-sm-4' style='padding-bottom:5px;'><a href='javascript:void(0);' onclick='setLocation("+stateId+", "+response[i]["id"]+", \""+response[i]["name"]+"\")' data-cityId='"+response[i]["id"]+"' class='locationLink'>"+response[i]["name"]+"</a></div>"
            }
          //  html += "</div>";
            $("#citiesArea").html(html);
        },
        error:function(xhr, status)
        {

        }
    })
}

function reset()
{
    $("#locationArea").html(allHtml);
}
function setLocation(stateId, cityId, locationName)
{
    window.location = "/?selo=1&stateId="+stateId+"&cityId="+cityId;
    selectedStateId = stateId;
    selectedCityId = cityId;
    $("#locationPicker").html(locationName);
    $("#stateId").val(selectedStateId);
    $('#cityId').val(selectedCityId);
    $("#locationModal").modal("hide");
}

/* This code is not required for the animation. This is only needed for the repeatation */

function doAnimation(){
   
    //$('.repeat').click(function(){
        var $this = $(".animate");
        var classes =  $this.attr('class');
        $this.attr('class', 'animate');
        //var indicator = $(this);
        setTimeout(function(){ 
            $this.addClass(classes);
        }, 20);
   // });
};

setInterval(function(){
    doAnimation();
           
}, 5000);


function getCategories()
{
    $.ajax({
        url:"/misc/get-all-categories",
        data:{},
        type:"GET",
        success:function(response)
        {
            let html = ""
            for(let i=0; i<response.length; i++)
            {
                let icon = response[i]["icon_name"];
                let categoryName = response[i]["categoryName"];
                let categoryId = response[i]["id"];
                let providerCount = response[i]["providerCount"];
                let shortName = categoryName.trunc(18);
                html += '<li class=" nav-item"><a title="'+categoryName+'" href="/?categoryId='+categoryId+'"><i class="'+icon+' info"></i><span class="menu-title" data-i18n="nav.templates.main" >'+shortName+' </span><span style="text-align:right" class="pull-right">('+providerCount+')</span></a></li>'
            }
            $("#main-menu-navigation").html(html);
            $("#navLoading").addClass("hidden");
            $("#main-menu-navigation").removeClass("hidden");
        },
        error:function(xhr, status)
        {
            console.log(xhr);
        }
    })
}

function requestService(providerUId, userId)
{
    providerUserId = providerUId;
    if(userId == "")
    {
        $("#warnModal").modal("show");
    }
    else{
        cart = new Array();
        $("#branchId").val("");
        $("#categoryId").val("");
        $("#productCategoryId").val("");
        $("#remarks").val("");
        $("#priceArea").html("");
        $("#addedItems").html("");
        $("#serviceTypeLoading").removeClass("hidden");
        $("#placeRequest").removeAttr("disabled");
        $("#placeRequest").find("i").addClass("hidden");
        //show dialog to place request
        getAllBranchesForProvider(providerUserId);
        getCategoriesForProvider(providerUserId);
        $("#requestModal").modal("show");
        $(".select2").select2();
        
    }
}

function getCategoriesForProvider(userId)
{
    $.ajax({
        url:"/misc/get-categories-for-provider",
        type:"GET",
        data:{userId:userId},
        success:function(res){
            $("#serviceTypeLoading").addClass("hidden");
            $("#serviceTypeArea").removeClass("hidden");
            var html = "<option value=''>Select Category</option>";
            for(var i=0; i<res.length; i++)
            {
                html += "<option  value='"+res[i]["providerCategoryId"]+"'>"+res[i]["categoryName"]+"</option>";
            }
            $("#categoryId").html(html);
        },
        error:function(xhr, error)
        {

        }

    })
}

function getAllBranchesForProvider(userId)
{
    $.ajax({
        url:"/misc/get-branches-for-provider",
        type:"GET",
        data:{userId:userId},
        success:function(res){
            $("#serviceTypeLoading").addClass("hidden");
            $("#serviceTypeArea").removeClass("hidden");
            var html = "<option value=''>Select Branch/Location</option>";
            for(var i=0; i<res.length; i++)
            {
                branches[res[i]["id"]] = res[i]["branchName"];
                html += "<option  value='"+res[i]["id"]+"'>"+res[i]["branchName"]+", (City:"+res[i]["city"]+") - "+ "State: "+res[i]["state"]+"</option>";
            }
            $("#branchId").html(html);
        },
        error:function(xhr, error)
        {

        }

    })
}

var ref;

function makePayment()
{
   
    let categoryId = $("#categoryId").val();
    let providerProductId = $("#productCategoryId").val();
    let productCategoryId = $('#productCategoryId option:selected').attr('data-productCategoryId');
    let qty = 1;
    let amount = productPrices[providerProductId] * 0.9;
    var timestamp = new Date().getTime();
    var remarks = $("#remarks").val();

    ref = userId+"_"+timestamp;
    var paymentData = {cart:JSON.stringify(cart), ref:ref, totalAmount:totalAmount, providerUserId:providerUserId};
    
    //disable the pay button   
      $("#placeRequest").attr("disabled", "disabled");
      $("#placeRequest").find("i").removeClass("hidden");
           $.ajax({
                url:"/misc/place-order",
                type:"POST",
                data:paymentData,
                success:function(response){
                    if(response != "")
                    {
                        //ensure that the order was saved
                        setTimeout(function(){
                            //$("#loadingModal").modal("hide");//hide my modal
                            payWithPaystack((totalAmount *100), email, ref, "", "", function(response){
                                if(response["status"] == "success"){
                                    placeRequest();     
                                  }
                            });//begin paystack payment
                        }, 1000);
                    } 
                },
                error:function(xhr, status)
                {

                }
            })
          

}

function showSuccessToast(title, message, duration)
{

    toastr.success(title, message, { timeOut: duration });
}

function placeRequest()
{
    //let categoryId = $("#categoryId").val();

    $.ajax({
        type:"GET",
        url:"/user/update-request",
        data:{ref:ref, providerUserId:providerUserId},
        success:function(res)
        {
            if(res == "success")
            {
                showSuccessToast("Update", "Your request has been placed successfully", 9000);
                
            }
        },
        error:function(xhr, error)
        {
            console.log(xhr)
        },
        complete:function(){
            $("#placeRequest").removeAttr("disabled");
            $("#placeRequest").find("i").addClass("hidden");
            $("#requestModal").modal("hide");
        }
    })
}


function viewServices(userId)
{
    $("#viewServiceModal").modal("show");

    $.ajax({
        url:"/misc/get-services-for-provider",
        type:"GET",
        data:{userId:userId},
        success:function(res){
            var html = "";
           for(var i = 0; i<res.length; i++)
           {
                const branch = res[i]["branchName"];
                const productCategory  = res[i]["productCategoryName"];
                const category = res[i]["category"];
                const product = res[i]["productName"];
                const address = res[i]["address"] + ", "+res[i]["city"]+", "+res[i]["state"] 
                const cost = "&#8358;"+formatNumber(res[i]["actualCost"]);
                html += "<tr><td>"+branch+"</td><td nowrap='nowrap'>"+address+"</td><td>"+product+"</td><td>"+productCategory+"</td><td>"+cost+"</td></tr>";
           }
           $("#servicesLoading").addClass("hidden");
           $("#servicesArea").removeClass("hidden");
           $("#serviceList").html(html);

           
        },
        error:function(xhr, status){

        }
    })
}


