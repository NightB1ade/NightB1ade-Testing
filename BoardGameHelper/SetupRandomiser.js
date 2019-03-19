function SetupRandomiser_Start() {
	$.getScript("Random.js");

	var display = $("input[name='DisplayRadio']:checked").attr("value");
	var displaygamedata = $(gamedata).find("DisplayButtons " + display);
	var NoPlayers = $("input[name='NoPlayers']").spinner("value");
	var html = "";

	// Heading
	html += "<h1>" + $(displaygamedata).children("Name").text() + "</h1>";


	$(displaygamedata).find("Section").each(function(){
		//Section Heading
		html += "<h2>" + $(this).find("Heading").text() + "</h2>"
			+ "<button onclick=SetupRandomiser_Randomise('" + $(this).attr("name") + "')>Randomise</button>"
			+ "<div id='SetupRandomiser_" + $(this).attr("name") + "'></div>";

	});


	// Put HTML into page
	$("#GameInfo").html(html);

	$("button").button();
}




function SetupRandomiser_Randomise(section) {
	var RandomiseGameData = $(displaygamedata).find("Section[name=" + section + "]");
	var NoPlayers = $("input[name='NoPlayers']").spinner("value");
	var OptionsArray = [];
	// var HasOptionsVariants = 0;

	var html = "";
	var i = 0;

	var RandomiseNumber = $(RandomiseGameData).find("Randomise").attr("number");
	if (RandomiseNumber == "NoPlayers") {
		RandomiseNumber = NoPlayers;
	}

	//Find Relevant Items
	i = 0;
	$(RandomiseGameData).children("Item").each(function(){
		var data = $(this);

		if (
			$(data).find("Available").length == 0
		) {
			OptionsArray.push([i,null]);
		} else {
			$(this).children("Available").children("Expansion").each(function(){
				if (
					$.inArray($(this).attr("name"),Expansions_Checked_Code) != -1
					&& $(this).attr("value") == "true"
				) {
					OptionsArray.push([i,null]);
					return
				}
			});
		}

		i += 1;
	});

	//Shuffle and Truncate Options Array
	OptionsArray = ShuffleArray(OptionsArray);
	OptionsArray.length = RandomiseNumber;

	DisplayRandomResults(section,RandomiseGameData,OptionsArray);
}




function DisplayRandomResults(section,data,array) {
	var ResultData = [];
	var html = "";
	var HasOptionsVariants = 0;

	$(array).each(function(){
		ResultData.push([$(this)[0],$(this)[1],$(data).find("Item").eq($(this)[0])]);
	})

	$(ResultData).each(function(){
		if ($(this)[2].find("Variants").length != 0) {
			HasOptionsVariants = 1;
			return
		}
	});

	//Create HTML
	html += "<table>"
		+ "<thead><tr><th colspan=2>" + $(data).children("Heading").text() + "</th>"
		+ (HasOptionsVariants == 1 ? "<th colspan=2>Variant</th>" : "")
		+ "</tr></thead>"
		+ "<tbody>";

	$(ResultData).each(function(){
		var VariantInt = $(this)[1];
		if (
			VariantInt == null
			&& $(this)[2].find("Variants").length != 0
		) {
			VariantInt = getRandomInteger(0,$(this)[2].find("Variant").length - 1);
		}

		html += "<tr optionArray='" + $(this)[0] + "'>"
			+ "<td><button class='RerollOption' section='" + section + "')><span class='ui-icon ui-icon-refresh'></span></button></td>"
			+ "<td>" + $(this)[2].children("Text").text() + "</td>"
			+ (HasOptionsVariants == 1
				? (VariantInt != null
						? "<td variantArray='" + VariantInt + "'>"
							+ "<button class='RerollVariant' section='" + section + "'><span class='ui-icon ui-icon-refresh'></span></button>"
							+ "</td>"
							+ "<td>" + $(this)[2].find("Variant").eq(VariantInt).children("Text").text() + "</td>"
						: "<td></td><td></td>"
					)
				: ""
			)
			+ "</tr>";
	});

	html += "</tbody></table>";

	$("#SetupRandomiser_" + section).html(html);

	$("button").button();

	//Bind Reroll Variant Buttons
	$("button.RerollOption").on("click",RerollOption);
	$("button.RerollVariant").on("click",RerollVariant);
}




function RerollOption() {
	var section = $(this).attr("section");
	var RandomiseGameData = $(displaygamedata).find("Section[name=" + section + "]");
	var row = $(this).closest("tbody").children().index($(this).closest("tr"));
	var i = 0;

	var OptionsArray = [];
	$(this).closest("tbody").children("tr").each(function(){
		OptionsArray.push([
			Number($(this).attr("optionArray"))
			,Number($(this).find("td").eq(2).attr("variantArray"))
		]);
	});

	var AvailableOptionsArray = [];

	//Find Relevant Items
	i = 0;
	$(RandomiseGameData).children("Item").each(function(){
		var data = $(this);

		if (
			$(data).find("Available").length == 0
		) {
			AvailableOptionsArray.push(i);
		} else {
			$(this).children("Available").children("Expansion").each(function(){
				if (
					$.inArray($(this).attr("name"),Expansions_Checked_Code) != -1
					&& $(this).attr("value") == "true"
				) {
					AvailableOptionsArray.push(i);
					return
				}
			});
		}

		i += 1;
	});

	//Remove Existing Items
	for(var i = AvailableOptionsArray.length - 1 ; i >= 0 ; i -= 1) {
		if($.inArray(AvailableOptionsArray[i][0],OptionsArray) != -1) {
			AvailableOptionsArray.splice(i,1);
		}
	}

	AvailableOptionsArray = ShuffleArray(AvailableOptionsArray);
	OptionsArray[row] = [AvailableOptionsArray[0],null];

	DisplayRandomResults(section,RandomiseGameData,OptionsArray);
}




function RerollVariant() {
	var section = $(this).attr("section");
	var RandomiseGameData = $(displaygamedata).find("Section[name=" + section + "]");
	var CurrentOption = $(this).closest("tr").attr("optionArray");
	var CurrentVariant = $(this).closest("td").attr("variantArray");

	var VariantArray = $(RandomiseGameData).find("Item").eq(CurrentOption).children("Variants").find("Variant");

	var NewVariantInt = getRandomIntegerExcludingOne(0,VariantArray.length - 1,CurrentVariant);

	$(this).closest("td").attr("variantArray",NewVariantInt);
	$(this).closest("td").next("td").html($(VariantArray).eq(NewVariantInt).children("Text").text());
}




SetupRandomiser_Start();
