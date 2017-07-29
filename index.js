$(document).ready(function(){
                console.log(1);
    var $textbox = $("textarea");    
    var $getTextButton = $("#get_text_button");
    
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
        

        
    });

});
