function RandomHiddenList_Start() {
	$.getScript("Random.js");

	var display = $("input[name='DisplayRadio']:checked").attr("value");
	var displaygamedata = $(gamedata).find("DisplayButtons " + display);
	var NoPlayers = Number($("select[name='NoPlayers'] option:selected").attr("name"));
	var html = "";

	// Heading
	html += "<h1>" + $(displaygamedata).children("Name").text() + "</h1>";

	//Section - Options
	html += "<h2>Options</h2>";

	//Option Table Start
	html += "<table id='OptionsTable'>"
		+ "<tr><thead>"
		+ "<th>" + $(displaygamedata).find("Script String[name='RandomItemName']").text() + "</th>"
		+ "<th>Used?</th>"
		+ "</thead></tr>";

	//Option Table Rows
	var i = 0;
	html += "<tbody>";
	$(displaygamedata).find("Item").each(function(){
		i += 1;
		html += "<tr>"
			+ "<td>" + $(this).children("Text").text() + "</td>"
			+ "<td>"
			+ " <label for='RandomItemName" + i + "_Yes'>Yes</label>"
			+ " <input type='radio' name='RandomItemName" + i + "' id='RandomItemName" + i + "_Yes' value='1'"
			+ " label='" + $(this).children("Text").text() + "'"
			+ (($(this).find("Default Players").length != 0 && $(this).find("Default Players[number=" + NoPlayers + "]").attr("value") == "true") ? "checked" : "")
			+ ">"
			+ " <label for='RandomItemName" + i + "_No'>No</label>"
			+ " <input type='radio' name='RandomItemName" + i + "' id='RandomItemName" + i + "_No'"
			+ (($(this).find("Default Players").length != 0 && $(this).find("Default Players[number=" + NoPlayers + "]").attr("value") == "true") ? "" : "checked")
			+ ">"
			+ "</td>"
			+ "</tr>";
	});

	//Option Table End
	html += "</tbody></table>";



	//Section - Deck
	html += "<h2>Randomise</h2>";

	//Randomise Button
	html += "<p><button onclick='RandomiseHiddenList()'>Randomise</button></p>";

	//Deck Table Start
	html += "<table id='DeckTable'>"
		+ "<thead><tr>"
		+ "<th></th>"
		+ "<th>" + $(displaygamedata).find("Script String[name='RandomItemName']").text() + "</th>"
		+ "<th></th>"
		+ "</tr></thead>";

	//Deck Table Rows
	html += "<tbody></tbody>";

	//Deck Table End
	html += "</table>";


	// Put HTML into page
	$("#GameInfo").html(html);

	$("button").button();
	$("input[type=radio]").checkboxradio({icon:false});
}




function RandomiseHiddenList() {
	var html = "";
	var i = 0;
	var array = [];

	$("#OptionsTable tbody input[value=1]:checked").each(function(){
		array.push($(this).attr("label"));
	});

	array = ShuffleArray(array);

	$(array).each(function(){
		i += 1;
		html += "<tr id=DeckRow" + i + ">"
			+ "<td>"
			+ " <button onclick=MoveRow($(this),'up')><span class='ui-icon ui-icon-arrowthick-1-n'></span></button>"
			+ " <button onclick=MoveRow($(this),'down')><span class='ui-icon ui-icon-arrowthick-1-s'></span></button>"
			+ "</td>"
			+ "<td class='Item' label='" + this + "'>-</td>"
			+ "<td>"
			+ " <label for='Checkbox_Reveal" + i + "'><span class='ui-icon ui-icon-locked'></span></label>"
			+ " <input type='checkbox' class='RevealItem' id='Checkbox_Reveal" + i + "'>"
			+ "</td>"
			+ "</tr>";
	});

	$("#DeckTable tbody").html(html);
	$("input[type=checkbox]").checkboxradio({icon:false});
	$("button").button();

	//Bind
	$("input[type=checkbox].RevealItem").on("change",DeckItemShowHide);
}




function DeckItemShowHide() {
	var html;
	var item = $(this).closest("tr").children("td.Item");
	if ($(this).is(":checked")){
		html = item.attr("label");
		$(this).checkboxradio({
			label: "<span class='ui-icon ui-icon-unlocked'></span>"
		});
	}
	else {
		html = "-";
		$(this).checkboxradio({
			label: "<span class='ui-icon ui-icon-locked'></span>"
		});
	}
	item.html(html);
}




function MoveRow(obj,direction) {
	var row = obj.closest('tr');
	if (direction == "up") {
		row.prev().before(row);
	}
	else if (direction == "down") {
		row.next().after(row);
	}
}




RandomHiddenList_Start();
