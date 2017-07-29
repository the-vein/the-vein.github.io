$(document).ready(function(){

				
    var $textbox = $("textarea");    
    var $getTextButton = $("#get_text_button");
    
    $("#login-button").click(function() {
		// localStorage.removeItem(ACCESS_TOKEN_KEY);
		// var state = generateRandomString(16);
		// localStorage.setItem(STATE_KEY, state);
		// var dateLogin = Math.floor(Date.now() / 1000);
		// localStorage.setItem(DATE_LOGIN_KEY, dateLogin);

		// var client_id = "0021f16415934279a9f094535452a760";
		// var scope = "playlist-read-private";

		// var redirect_uri;
		// var localHost = "localhost:8005";
		// var localFromNetwork = "192.168.178.40:8005";
		// if (location.host === localHost) {
		// redirect_uri = "http://" + localHost;
		// }
		// else if (location.host === localFromNetwork) {
		// redirect_uri = "http://" + localFromNetwork;
		// }
		// else {
		// redirect_uri = "https://5myg.github.io";
		// }

		var url = "http://www.last.fm/api/auth/?api_key=85255598eb489a85d75ef556169fd824";

		window.location.href = url;
    });	
	
    $getTextButton.click(function() {
        var text = $textbox.val();
        var lines = text.split("\n");
        var linesWithContent = [];
        
        for (var i = 0; i < lines.length; i++) {
            if (/-/.test(lines[i])) {
                var artistAndTitle = lines[i].split("-", 2);
                var artist = artistAndTitle[0];
                var title = artistAndTitle[1];
                artist = artist.match(/[^\d\s.].*[^\s]/)[0]; 
              
                if (/\[/.test(title))
                    title = title.match(/(?!\s).*(?=\s\[.*)/)[0];
                else
                    title = title.match(/(?!\s).*/)[0];
            
                console.log("Artist: " + artist, "Title: " + title);
            }
        }
		
		
		
		$.ajax({
			type : 'POST',
			url : 'https://ws.audioscrobbler.com/2.0/',
			data : 'method=artist.getinfo&' +
				   'artist=Burial&' +
				   'api_key=85255598eb489a85d75ef556169fd824&' +
				   'format=json',
			dataType : 'jsonp',
			success : function(data) {
				// Handle success code here
				
				console.log(data);
				
			},
			error : function(code, message){
				// Handle error here
				
				console.log(data);
			}
		});			
   
    });

});
