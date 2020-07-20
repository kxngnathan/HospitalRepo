$(document).ready(function(){

	$('.chat_head').click(function(){
		$('.chat_body').slideToggle('slow');
	});
	$('.msg_head').click(function(){
		$('.msg_wrap').slideToggle('slow');
	});
	
	$('.close').click(function(){
		$('.msg_box').hide();
	});
	
	$('.user').click(function(){

		$('.msg_wrap').show();
		$('.msg_box').show();
	});
	
	$('textarea').keypress(
    function(e){
        if (e.keyCode == 13) {
            e.preventDefault();
            var msg = $(this).val();
			$(this).val('');
			if(msg!='')
			$('<div class="msg_b">'+msg+'</div>').insertBefore('.msg_push');
			$('.msg_body').scrollTop($('.msg_body')[0].scrollHeight);
        }
    });

    $("#homeChatIcon").click(function(e){
        var isOpen = $("#homeChat").css("display");
        if(isOpen == "none")
        {
            $(".msg_box").css("display", "block");
            $("#homeChat").css("display", "block");
           // alert("open")
        }
        e.preventDefault();
        return false;
	});	


	
	var socket = io.connect("http://localhost:3000");
	if(typeof userId != "undefined")
	{
		socket.emit("saveConnectedUser", {userId:userId});
	}
	
	$("#startChat").click(function(e){
		var name = $("#name").val();
		var message = $("#message").val();

		socket.emit("start-chat", {userId:userId, name:name, message:message});

		$("#guestInfo").addClass("hidden");
		$("#guestChat").removeClass("hidden");



	});



});

function setupChatArea()
{
	var top = $(".sidebar-fixed").position().top;
	var documentHeight = $(window).height();
	var height = documentHeight - top - 100;

	$(".chat-area").css({
        'cssText': 'height: '+height+'px !important'
    });
}