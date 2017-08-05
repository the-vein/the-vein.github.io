function getParams () {
	var hashParams = {};
	var e, r = /([^&;=]+)=?([^&;]*)/g;
	var q = window.location.search.substring(1);
	while (e = r.exec(q)) {
		hashParams[e[1]] = decodeURIComponent(e[2]);
	}
	return hashParams;
}

function lastFmParamsSorting (a, b) {
	if (a < 10 && b >= 10) {
		a = a * 10 + 9.5;
	}
	else if (b < 10 && a >= 10) {
		b = b * 10 + 9.5;
	}

	return a - b;
}

$(document).ready(function () {
	//globals :
	var $textbox = $('textarea');
	var $getTextButton = $('#get_text_button');
	var $loginButton = $('#login-button');

	$('#datetimepicker').datetimepicker();

	var lastFmUrl = 'https://ws.audioscrobbler.com/2.0/';
	var apiKey = '85255598eb489a85d75ef556169fd824';
	var secret = '19c8cc5704536b2a8e6805b2a62f7e2e';

	var SESSION_KEY_STORAGE_NAME = 'sessionKey';
	var sessionKey = localStorage.getItem(SESSION_KEY_STORAGE_NAME);

	sessionKey = "nFo88jLh34D-jZUDuvMY82d8_OOxofn1";

	var params = getParams();
	var token = params.token;

	if (sessionKey == null) {

		if (token == null) {
			$loginButton.show();
		}
		else {
			var sigApiKeyStr = 'api_key' + apiKey;
			var sigMethodStr = 'method' + 'auth.getSession';
			var sigTokenStr = 'token' + token;
			var sigStr = sigApiKeyStr + sigMethodStr + sigTokenStr + secret;
			var sigHash = hex_md5(sigStr);

			var getSessionArgs = {
				method: 'auth.getSession',
				api_key: apiKey,
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
		}

	}

	$loginButton.click(function () {
		var url = 'http://www.last.fm/api/auth/?api_key=' + apiKey;
		window.location.href = url;
	});

	$getTextButton.click(function () {
		var text = $textbox.val();
		var lines = text.split('\n');

		if (lines.length === 0 || lines[0].length < 5) {
			console.log('empty tracklist');
			return;
		}

		var setTime = $('#datetimepicker').datetimepicker('getValue');
		if (setTime == null) {
			setTime = Date.now() - 10800000;
		}
		else {
			setTime = setTime.getTime();
		}

		var unixTimeStamp = Math.round(setTime / 1000);

		var sigArtistStr = '';
		var sigTrackStr = '';
		var sigTimeStampStr = '';
		var scrobbles = [];
		var indices = [];

		for (var i = 0; i < lines.length; i++) {
			if (/-/.test(lines[i])) {
				var artistAndTitle = lines[i].split(' - ', 2);
				var artist = artistAndTitle[0];
				var title = artistAndTitle[1];
				artist = artist.match(/[^\d\s.].*[^\s]/)[0];

				if (/\[/.test(title)) {
					title = title.match(/(?!\s).*(?=\s\[.*)/)[0];
				} else {
					title = title.match(/(?!\s).*/)[0];
				}

				unixTimeStamp += 200;

				scrobbles.push({
					artist: artist,
					track: title,
					timestamp: unixTimeStamp
				});

				// TODO: show scrobbles to user for confirmation / removeable

				if (scrobbles.length > 50) {
					alert('lastfm doesnt allow more than 50 scrobbles in a bulk at once');
					return;
				}

				indices.push(i);
			}
		}

		indices.sort(lastFmParamsSorting);

		var paramData = {};

		for (var j = 0; j < indices.length; j++) {
			var index = indices[j];
			var scrobble = scrobbles[index];

			var artistParam = 'artist[' + index + ']';
			sigArtistStr += artistParam + scrobble.artist;
			paramData[artistParam] = scrobble.artist;

			var trackParam = 'track[' + index + ']';
			sigTrackStr += trackParam + scrobble.track;
			paramData[trackParam] = scrobble.track;

			var timestampParam = 'timestamp[' + index + ']';
			sigTimeStampStr += timestampParam + scrobble.timestamp;
			paramData[timestampParam] = scrobble.timestamp;
		}

		var apiKeyParam = 'api_key';
		var methodParam = 'method';
		var method = 'track.scrobble';
		var sessionKeyParam = 'sk';

		var sigApiKeyStr = apiKeyParam + apiKey;
		var sigMethodStr = methodParam + method;
		var sigSessionKeyStr = sessionKeyParam + sessionKey;
		var sigStr = sigApiKeyStr + sigArtistStr + sigMethodStr +
			sigSessionKeyStr + sigTimeStampStr + sigTrackStr + secret;

		var sigHash = hex_md5(sigStr);

		paramData[apiKeyParam] = apiKey;
		paramData[methodParam] = method;
		paramData[sessionKeyParam] = sessionKey;
		paramData.api_sig = sigHash;
		paramData.format = 'json';

		console.log(sigArtistStr);
		console.log(sigTrackStr);
		console.log(paramData);

		$.ajax({
			type: 'POST',
			url: lastFmUrl,
			data: paramData,
			success: function (data) {
				console.log('success', data);
				alert("success scrobbling");
			},
			error: function (response) {
				console.log(response.responseText);
				alert("something went wrong");
			}
		});

	});

});
