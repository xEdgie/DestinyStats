var apiKey = "d05f3598eec243a59a65bff6c77abf4c";
var token;
var authCode;

//Player Info
var membershipType;
var destinyMembershipId;
var iconPath;
var characterId1;
var characterId2;
var characterId3;

function Auth()
{
	window.location = "https://www.bungie.net/en/OAuth/Authorize?client_id=30715&response_type=code&state=6i0mkLx79Hp91nzWVeHrzHG4";
}

function getAuthCode()
{
	authCode = window.location.search.substring(6, 38);
	var tempCode = window.location.search.substring(6, window.location.search.length);
	console.log(authCode);
	console.log(tempCode);
}

//broken!
function getToken()
{
	/*POST https://www.bungie.net/Platform/App/OAuth/Token/ HTTP/1.1
	Content-Type: application/x-www-form-urlencoded

	client_id={client-id}&grant_type=authorization_code&code={auth-code}*/

	console.log("Get token");

	var data = null;

	var xhr = new XMLHttpRequest();
	//xhr.withCredentials = true;

	xhr.onreadystatechange = function()
	{
		if (this.readyState === 4 && this.status === 200)
		{
			console.log('Got Token');
			var json = JSON.parse(this.responseText);
			token = json.access_token;
			//console.log(token);
			console.log(json);
		}
		else if (this.status == 401)
		{
			console.error("Authentication error");
			console.log(`AuthCode : ${authCode}, API Key : ${apiKey}`);
		}
		else if (this.status == 404)
		{
			console.error("Not found");
			console.log(`AuthCode : ${authCode}, API Key : ${apiKey}`);
		}
		else
		{
			console.error("error");
			console.log(`AuthCode : ${authCode}, API Key : ${apiKey}`);
		}
	}

	xhr.open('POST', `https://www.bungie.net/Platform/App/OAuth/token/`);
	xhr.setRequestHeader("X-API-Key", apiKey);
	xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
	xhr.send();
}

function getPlayer()
{
	var UserName = document.getElementById("searchPlayer").value;

	var xhr = new XMLHttpRequest();

	console.log("Started");

	xhr.onreadystatechange = function()
	{
		if (this.readyState === 4 && this.status === 200)
		{
			//Parse Data
			var json = JSON.parse(this.responseText);

			//Get other info
			membershipType = json.Response[0].membershipType;
			destinyMembershipId = json.Response[0].membershipId;
			iconPath = json.Response[0].iconPath;
			console.log(iconPath);

			//Output display name
			document.getElementById("platform").innerHTML = `Player Display Name :  ${json.Response[0].displayName}`;
			console.log(`Output : ${json.Response[0].displayName}`);

			getAccount();
		}
	}

	//xhr.open("GET", `https://www.bungie.net/Platform/Destiny2/Manifest/`);
	xhr.open('GET', `https://www.bungie.net/Platform/Destiny2/SearchDestinyPlayer/All/${UserName}/`, true);
	xhr.setRequestHeader("X-API-Key", apiKey);

	xhr.send();
}

function getAccount()
{
	var UserName = document.getElementById("searchPlayer").value;

	var xhr = new XMLHttpRequest();

	xhr.onreadystatechange = function()
	{
		if (this.readyState === 4 && this.status === 200)
		{
			var json = JSON.parse(this.responseText);

			characterId1 = json.Response.profile.data.characterIds[0]; //2305843009358066670
			characterId2 = json.Response.profile.data.characterIds[1]; //2305843009361124031
			characterId3 = json.Response.profile.data.characterIds[2]; //2305843009534224923
			console.log(characterId1);

			getCharacter(1);
			getCharacter(2);
			getCharacter(3);
		}
	}

	xhr.open('GET', `https://www.bungie.net/Platform/Destiny2/${membershipType}/Profile/${destinyMembershipId}/?components=profiles`);
	xhr.setRequestHeader("X-API-Key", apiKey);

	xhr.send();
}

function getCharacter(characterNum)
{
	//Reset HTML elements
	document.getElementById(`class${characterNum}`).innerHTML = 'Class : ';
	document.getElementById(`emblem${characterNum}`).src = '';
	document.getElementById(`light${characterNum}`).innerHTML = `Power Level : `;
	document.getElementById(`playTime${characterNum}`).innerHTML = `Hours Played : `;

	var characterId;

	if (characterNum == 1)
	{	
		characterId = characterId1;
	}
	else if (characterNum == 2)
	{
		characterId = characterId2;
	}
	else if (characterNum == 3)
	{
		characterId = characterId3;
	}

	var xhr = new XMLHttpRequest();

	xhr.onreadystatechange = function()
	{
		if (this.readyState === 4 && this.status === 200)
		{
			//Parse Data
			var json = JSON.parse(this.responseText);

			//Get Info
			var emblem = `https://bungie.net${json.Response.character.data.emblemPath}`;
			var classType = json.Response.character.data.classType;
			var light = json.Response.character.data.light;
			var playtime = parseFloat(json.Response.character.data.minutesPlayedTotal) / 60;

			if(classType == 0)
			{
				document.getElementById(`class${characterNum}`).innerHTML = 'Class : Titan';
			}
			else if (classType == 1)
			{
				document.getElementById(`class${characterNum}`).innerHTML = 'Class : Hunter';
			}
			else if( classType == 2)
			{
				document.getElementById(`class${characterNum}`).innerHTML = 'Class : Warlock';
			}
			else
			{
				document.getElementById(`class${characterNum}`).innerHTML = 'Class : Warlock';
			}

			//Output Info
			document.getElementById(`emblem${characterNum}`).src = emblem;

			document.getElementById(`light${characterNum}`).innerHTML = `Power Level : ${light}`;

			document.getElementById(`playTime${characterNum}`).innerHTML = `Hours Played : ${playtime}`;
		}
	}

	xhr.open('GET', `https://www.bungie.net/Platform/Destiny2/${membershipType}/Profile/${destinyMembershipId}/Character/${characterId}/?components=characters`);
	xhr.setRequestHeader("X-API-Key", apiKey);

	xhr.send();
}