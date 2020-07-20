$(document).ready(function(e){
    if(typeof $.fn.raty != "undefined")
    {
        $.fn.raty.defaults.path = '../app-assets/images/raty/';
    }
   
    $(".updateRequest").click(function(e){
        var requestId = $(this).attr("data-requestId");
        var currStatus = $(this).attr("data-status");
        $("#requestStatus").val(currStatus);
        $("#requestId").val(requestId);
        $("#updateStatusModal").modal("show");
    });

    $(".rateProvider").click(function(e){
        var providerUserId = $(this).attr("data-providerUserId");
        $("#providerUserId").val(providerUserId);
        $("#ratingModal").modal("show");
        $('#star1').starrr({
            change: function(e, value){
              if (value) {
                    $("#ratingValue").val(value);
              } else {
                
              }
            }
          });
    })

    $(".messages").click(function(e){
        var recipientId = $(this).attr("data-recipientId");
        var requestId = $(this).attr("data-requestId");
        var privilege = $(this).attr("data-privilege");
        $("#userPrivilege").val(privilege);
        $("#providerUserIdMessage").val(recipientId);
        $("#requestIdMessage").val(requestId);
        $("#messageModal").modal("show");
        getMessageThread(requestId);
    })




   
   
})

function getMessageThread(requestId)
{
    $.ajax({
            type:"GET",
            data:{requestId:requestId},
            url:"/misc/get-messages",
            success:function(response){
                var html = "";
                $("#messageLoading").hide();
                console.log(response);
               
                for(var i=0; i<response.length; i++)
                {
                    var message = response[i]["message"];
                    var type = response[i]["type"];
                   // var recipientProfilePic = (response[i]["recprofilepic"] != "")  ? "/uploads/"+response[i]["recprofilepic"] : "/images/avatar.jpg";
                    
                    var extraClass = (userId == response[i]["recipientId"]) ? "chat-left": "";
                    var picUrl = (response[i]["profilepic"] != "" != "") ? "/uploads/"+response[i]["profilepic"] != "" : "/images/avatar.jpg";
                    
                    console.log(response[i]["profilepic"]);
                    console.log("Picu"+picUrl);
                    html += '<div class="chat '+extraClass+'">'+
                              '<div class="chat-avatar">'+
                                '<a class="avatar" data-toggle="tooltip" href="#" data-placement="right" title="" data-original-title="">'+
                                    '<img src="'+picUrl+'" alt="avatar">'+
                                '</a>'+
                                '</div>'+
                                '<div class="chat-body">'+
                                '<div class="chat-content">';
                    if(type == "text")
                    {
                        html += '<p>'+message+'</p>';
                    }
                    else{
                        html += '<p><a href="/uploads/'+message+'" >File (Download)</a></p>'
                    }
                                
                    html += '</div>'+
                      
                                '</div>'+
                           '</div>';
                }
                $("#messageArea").html(html);
            },
            error:function(xhr, status, error){
                console.log(error)
            }

        })
}

function viewRequestDetails(requestId)
{
    $("#requestDetailsModal").modal("show");
    $("#requestDetailsArea").html("");
    $.ajax({
        type:"GET",
        data:{requestId:requestId},
        url:"/misc/get-request-details",
        success:function(res){
            $("#requestDetailLoading").addClass("hidden");
            $("#requestDetailsDiv").removeClass("hidden");
            var data = JSON.parse(res);
            var html = "";
            for(var i=0; i<data.length; i++)
            {
                html += "<tr>";
                html += "<td>"+data[i]["branchName"]+"</td>"
                html += "<td>"+data[i]["categoryName"]+"</td>"
                html += "<td>"+data[i]["name"]+"</td>"
                html += "<td>"+data[i]["productName"]+"</td>"
                html += "<td>&#8358;"+formatNumber(data[i]["amountPaid"])+"</td>"
            }

            $("#requestDetailsArea").html(html);
            
        },
        error:function(status, xhr){
            console.log(xhr)
        }
    })
}

