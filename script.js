var selectedCompetence = "";
var userName = "";
var playerStats = {} ;
var socketio = null;

function emitRoll(){
    var comp = selectedCompetence;

    if(document.getElementById(selectedCompetence).getElementsByTagName('td')[1].firstChild.value){
        var compValue = document.getElementById(selectedCompetence).getElementsByTagName('td')[1].firstChild.value;
    } else {
        var compValue = document.getElementById(selectedCompetence).getElementsByTagName('td')[1].innerText;
    }

    var bonusMalus = parseInt($('#bonusMalus').val());

    socketio.emit("roll", { competence: comp, bonusMalus : bonusMalus });
}

function selectCompetenceSimple(compId){
    var compName = document.getElementById(compId).getElementsByTagName('td')[0].innerText;
    var compValue = document.getElementById(compId).getElementsByTagName('td')[1].innerText;

    selectedCompetence = compId;

    var lines = document.getElementById('competences').getElementsByTagName('tr');
    for(var i = 0; i < lines.length; i++){
        lines[i].style.backgroundColor = "#7a5435";
    }
    // On remplace le hover car il est écrasé par le reinit du de la couleur de fon 
    document.getElementById(compId).style.background = "blue";
    var css='table td:hover{background-color:#00ff00}';
    style=document.createElement('style');
    if (style.styleSheet)
        style.styleSheet.cssText=css;
    else 
        style.appendChild(document.createTextNode(css));
    document.getElementById('competences').appendChild(style);

    //console.log('comp: '+ compName+"; value: "+compValue);
};

function playerChoice(choice){
    if(choice == "mj")
        document.getElementById('tableStats').style.display = "none";
    else 
        document.getElementById('tableStats').style.display = "block";
};

function calculCompetences(){

    var ForceValue = playerStats['Force'];
    var DexteriteValue = playerStats['Dexterite'];
    var ConstitutionValue = playerStats['Constitution'];
    var CharismeValue = playerStats['Charisme'];
    var PerceptionValue = playerStats['Perception'];
    var EducationValue = playerStats['Education'];
    var SagesseValue = playerStats['Sagesse'];
    var IntelligenceValue = playerStats['Intelligence'];

    $('#Force :nth-child(2)').text(ForceValue);
    $('#Dexterite :nth-child(2)').text(DexteriteValue);
    $('#Constitution :nth-child(2)').text(ConstitutionValue);
    $('#Charisme :nth-child(2)').text(CharismeValue);
    $('#Perception :nth-child(2)').text(PerceptionValue);
    $('#Education :nth-child(2)').text(EducationValue);
    $('#Sagesse :nth-child(2)').text(SagesseValue);
    $('#Intelligence :nth-child(2)').text(IntelligenceValue);

    if(ForceValue != 0 && ForceValue != ""
      && DexteriteValue != 0 && DexteriteValue != ""
      && ConstitutionValue != 0 && ConstitutionValue != ""
      && CharismeValue != 0 && CharismeValue != ""
      && PerceptionValue != 0 && PerceptionValue != ""
      && EducationValue != 0 && EducationValue != ""
      && SagesseValue != 0 && SagesseValue != ""
      && IntelligenceValue != 0 && IntelligenceValue != ""
      ){
        $('#Crochetage :nth-child(2)').text(DexteriteValue);
        $('#Natation :nth-child(2)').text(ForceValue);
        $('#ArtDeLaMagie :nth-child(2)').text(Math.floor((SagesseValue+IntelligenceValue)/2));
        $('#Connaissance :nth-child(2)').text(EducationValue);
        $('#Contrefacon :nth-child(2)').text(Math.floor((EducationValue+IntelligenceValue)/2));
        $('#Decryptage :nth-child(2)').text( Math.floor((EducationValue+IntelligenceValue)/2));
        $('#Desamorcage :nth-child(2)').text(Math.floor((SagesseValue+IntelligenceValue)/2));
        $('#Dressage :nth-child(2)').text(CharismeValue);
        $('#Equitation :nth-child(2)').text( Math.floor((ForceValue+DexteriteValue)/2));
        $('#Escamotage :nth-child(2)').text( Math.floor((DexteriteValue+PerceptionValue)/2));
        $('#MaitriseDesCordes :nth-child(2)').text( Math.floor((DexteriteValue+EducationValue)/2));
        $('#PremierSecours :nth-child(2)').text(Math.floor((SagesseValue+EducationValue)/2));
        $('#Profession :nth-child(2)').text(SagesseValue);
        $('#Representation :nth-child(2)').text(Math.floor((CharismeValue+EducationValue)/2));
        $('#UtilisationObjetsMagiques :nth-child(2)').text(Math.floor((IntelligenceValue+EducationValue)/2));

    }
}

function calculBonusMalus(buttonOption){
    var bonusValue = parseInt(document.getElementById("bonusMalus").value);
    if(buttonOption == "plus"){
        document.getElementById("bonusMalus").value = bonusValue + 10;
    } else if(buttonOption == "moins"){
        document.getElementById("bonusMalus").value = bonusValue - 10;
    }
}

function enterChannel(){
    socketio = io.connect("127.0.0.1:1337");

    socketio.on("message_to_client", function(data) {
       console.log(data);
    });

    socketio.on("roll", function(data) {
       //document.getElementById('messages').append($('<li>').text(data.message));
        var node = document.createElement("LI");             
        //var textnode = document.createTextNode(data.message);      
        node.innerHTML = data.message;
        //node.appendChild(textnode);
        document.getElementById('messages').appendChild(node);
        document.getElementById('tchat').scrollTop = document.getElementById('tchat').scrollHeight;
    });

    socketio.on("refreshUsers", function(data) {
       //document.getElementById('messages').append($('<li>').text(data.message));
        console.log(data.userList);
        $('#userList').empty();
        for(var i=0;i < data.userList.length;i++){                          
            $('#userList').append('<li>'+data.userList[i]+'</li>');
        }
        
        
    });

    socketio.on("user image", function(data) {
       //document.getElementById('messages').append($('<li>').text(data.message));
        console.log(data);
        $('#imageSend').empty();
        $('#imageSend').append($('<p>').append('<img src="' + data.fileData + '"/>'));

    });

    playerStats['Force'] = parseInt($('#ForceInit :nth-child(2)').find('input').val());
    playerStats['Dexterite'] = parseInt($('#DexteriteInit :nth-child(2)').find('input').val());
    playerStats['Constitution'] = parseInt($('#ConstitutionInit :nth-child(2)').find('input').val());
    playerStats['Charisme'] = parseInt($('#CharismeInit :nth-child(2)').find('input').val());
    playerStats['Perception'] = parseInt($('#PerceptionInit :nth-child(2)').find('input').val());
    playerStats['Education'] = parseInt($('#EducationInit :nth-child(2)').find('input').val());
    playerStats['Sagesse'] = parseInt($('#SagesseInit :nth-child(2)').find('input').val());
    playerStats['Intelligence'] = parseInt($('#IntelligenceInit :nth-child(2)').find('input').val());

    userName = $('#login').val();
    room = $('#salon').val();
    calculCompetences();

    document.getElementById('pseudo').innerText = document.getElementById('login').value;
    document.getElementById('accueil').style.display = "none";
    document.getElementById('content').style.display = "block";
    
    socketio.emit("newUser", { userName : userName, room : room, stats : playerStats});

}

$("document").ready(function(){

    $('#imagefile').bind('change', function(e){
        var data = e.originalEvent.target.files[0];
        var reader = new FileReader();
        reader.onload = function(evt){
            //image('me', evt.target.result);
            socketio.emit('user image', evt.target.result);
        };
        reader.readAsDataURL(data);
    });
});