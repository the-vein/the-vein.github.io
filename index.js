$(document).ready(function () {

	function getParams () {
		var hashParams = {};
		var e, r = /([^&;=]+)=?([^&;]*)/g;
		var q = window.location.search.substring(1);
		while (e = r.exec(q)) {
			hashParams[e[1]] = decodeURIComponent(e[2]);
		}
		return hashParams;
	}

	//globals:
	var $textbox = $('textarea');
	var $getTextButton = $('#get_text_button');
	var $loginButton = $('#login-button');

	var lastFmUrl = 'https://ws.audioscrobbler.com/2.0/';
	var apiKey = '85255598eb489a85d75ef556169fd824';
	var secret = '19c8cc5704536b2a8e6805b2a62f7e2e';

	var SESSION_KEY_STORAGE_NAME = 'sessionKey';
	var sessionKey = localStorage.getItem(SESSION_KEY_STORAGE_NAME);

	var params = getParams();
	var token = params.token;

	if (sessionKey == null) {
		$loginButton.show();
	}


	if (token != null && sessionKey == null) {
		$loginButton.hide();

		var sigApiKeyStr = 'api_key' + apiKey;
		var sigMethodStr = 'method' + 'auth.getSession';
		var sigTokenStr = 'token' + token;
		var sigStr = sigApiKeyStr + sigMethodStr + sigTokenStr + secret;
		var sigHash = hex_md5(sigStr);

		var getSessionArgs = {
			method: 'auth.getSession',
			//api_key: apiKey,
			token: token,
			api_sig: sigHash,
			format: 'json'
		};

		$.ajax({
			type: 'GET',
			url: lastFmUrl,
			data: getSessionArgs,
			success: function (data) {
				sessionKey = data.session.key;
				localStorage.setItem(SESSION_KEY_STORAGE_NAME, sessionKey);
			},
			error: function (code, message) {
				console.log(code, message);
			}
		});
	}	else {
		$loginButton.show();
	}

	$loginButton.click(function () {
		var url = 'http://www.last.fm/api/auth/?api_key=' + apiKey;
		window.location.href = url;
	});

	$getTextButton.click(function () {
		var text = $textbox.val();
		var lines = text.split('\n');

		for (var i = 0; i < lines.length; i++) {
			if (/-/.test(lines[i])) {
				var artistAndTitle = lines[i].split('-', 2);
				var artist = artistAndTitle[0];
				var title = artistAndTitle[1];
				artist = artist.match(/[^\d\s.].*[^\s]/)[0];

				if (/\[/.test(title)) {
					title = title.match(/(?!\s).*(?=\s\[.*)/)[0];
				} else {
					title = title.match(/(?!\s).*/)[0];
				}

				console.log('Artist: ' + artist, 'Title: ' + title);
			}
		}

		var sigApiKeyStr = 'api_key' + apiKey;
		var sigArtistStr = 'artist' + 'Implex';
		var sigMethodStr = 'method' + 'track.scrobble';
		var sigTrackStr = 'track' + 'You';

		var sigStr = sigApiKeyStr + sigArtistStr + sigMethodStr + sigTrackStr + secret;
		var sigHash = hex_md5(sigStr);

		var scrobbleArgs = {
			method: 'track.scrobble',
			artist: 'Implex',
			track: 'You',
			api_key: apiKey,
			api_sig: sigHash,
			format: 'json',
			sk: sessionKey
		};

		$.ajax({
			type: 'POST',
			url: lastFmUrl,
			data: scrobbleArgs,
			success: function (data) {
				console.log('success', data);
			},
			error: function (code, message) {
				console.log(code, message);
			}
		});
	});
});
