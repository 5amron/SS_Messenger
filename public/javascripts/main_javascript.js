window.onload = function() {
 
    var messages = [];
    var socket = io.connect(window.location.hostname.myVar2);
    var sendButton = document.getElementById("sendButton");
    var content = document.getElementById("content");
    var typing = document.getElementById("typing");

    //var name = document.getElementById("name");
 
    socket.on('message', function (data) {
        if(data.message) {
            messages.push(data);
            var new_message = '';
            // var array[];
            // var a;
            // var m;
            for(var i=0; i<messages.length; i++) {
                // if(i==25 || i==50 || i==75 || i==100 || i==125 || i==150 || i==175 || i==200 || i==225 || i==250 || i==275 || i==300){
                //     a=0;
                //     for (var j = i; j < messages.length; j++) {
                //         array[a] += messages[j].message;
                //         a++;
                //     };
                    
                //         messages[i+0].message = '<';
                //         messages[i+1].message = 'b';
                //         messages[i+2].message = 'r';
                //         messages[i+3].message = '>';
                //         m=0;
                //         for (var n = i+3;  n<messages.length; n++) {
                //             messages[n].message += array[m];
                //             m++;
                //         };
                    
                // }
                new_message += '' + (messages[i].username ? messages[i].username : 'samron') + ': ';
                new_message += '<div class="m"><section class="arrow-left"></section><p>'+ messages[i].message + '</p></div>' +'<br />';
            }
            content.innerHTML = new_message;
        } else {
            console.log("There is a problem:", data);
        }
    });
    
    $(document).keypress(function(e) {
    if(e.which == 13) {
        if(typing.value == "" || typing.value == null || typing.value.length >> 500) {
            alert("oooohhaa!");
        } else {
            var text = typing.value;
            socket.emit('send', { message: text, username: myVar });
            updateScroll();
            $("#typing").val('');
        }
    }
        });
    sendButton.onclick = function() {
        if(typing.value == "" || typing.value == null || typing.value.length >> 500) {
            alert("oooohhaa!");
        } else {
            var text = typing.value;
            socket.emit('send', { message: text, username: myVar });
            updateScroll();
            $("#typing").val('');
        }
    };


    
 

}

      function updateScroll(){

        $("#content").animate({ scrollTop: $('#content')[0].scrollHeight}, 1000);
      }
