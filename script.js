var selectedCompetence = "";
var userName = "";
var playerStats = {} ;
var socketio = null;
var sceneData = null;
var gameScene = null;

var SCENE_WIDTH = 1000;
var SCENE_HEIGHT = 500;

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
    
    // On écrase les selections précedentes
    $('.competencesTable tr').css('background-color', 'rgba(000,000,000,0)');

    // On remplace le hover car il est écrasé par le reinit du de la couleur de fon 
    $('#'+compId).css('background-color', 'rgba(000,000,000,0.2)');
    
    // On applique le hover ( pas trouvé de moyen plus propre ici sans faire péter les hover/selected)
    var css='table td:hover{background-color:rgba(000,000,000,0.2)}';
    style=document.createElement('style');
    if (style.styleSheet)
        style.styleSheet.cssText=css;
    else 
        style.appendChild(document.createTextNode(css));
    document.getElementById('competences').appendChild(style);
};

function playerChoice(choice){
    if(choice == "mj"){
        document.getElementById('tableStats').style.display = "none";
        document.getElementById('separateur').style.display = "none";
    } else {
        document.getElementById('tableStats').style.display = "block";
        document.getElementById('separateur').style.display = "block";
    }
};

function calculCompetences(stats){

    var ForceValue = stats['Force'];
    var DexteriteValue = stats['Dexterite'];
    var ConstitutionValue = stats['Constitution'];
    var CharismeValue = stats['Charisme'];
    var PerceptionValue = stats['Perception'];
    var EducationValue = stats['Education'];
    var SagesseValue = stats['Sagesse'];
    var IntelligenceValue = stats['Intelligence'];

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
        document.getElementById('tchatContent').scrollTop = document.getElementById('tchatContent').scrollHeight;
    });

    socketio.on("refreshUsers", function(data) {
       //document.getElementById('messages').append($('<li>').text(data.message));
        console.log(data.userList);
        $('#userList').empty();
        for(var i=0;i < data.userList.length;i++){                          
            if(data.userList[i].role == "mj") $('#userList').append('<li>'+data.userList[i].userName+' (GM)</li>'); 
            else $('#userList').append('<li>'+data.userList[i].userName+'</li>'); 
        }
        // lorsque l'on clique sur un des pseudos, on récupère les stats et on les mets à jour
        $('#userList').find('li').each(function(){
            $(this).click(function(){
                socketio.emit("getPlayerStats", { pseudo: $(this).text()});
            })
        });
        
    });

    socketio.on("user image", function(data) {
        $('#imageSend').empty();
        sceneData = data.fileData;
        if(gameScene) gameScene.destroy();
        gameScene = new Phaser.Game(800, 600, Phaser.AUTO, 'gameScene');
        gameScene.state.add('sceneManager', sceneManager, true);
        //$('#imageSend').append($('<p>').append('<img src="' + data.fileData + '"/>'));
    });
    
    socketio.on("getPlayerStats", function(data) {
        calculCompetences(data.stats);
    });
    
    // Lors de l'ajout d'un joueur sur la scène
    socketio.on("addPlayerOnScene", function(data) {
        // on envoie la requete d'ajout à la scène
        addPlayerOnScene(data.pionId, data.color, data.x, data.y);
    });
    
    // Lors du mouvement d'un des pions
    socketio.on("updatePlayerPosition", function(data) {
        updatePlayerPosition(data.pionId, data.x, data.y);
    });
    
    
    // Lors de la suppression d'un pion sur la map
    socketio.on("removePlayerOnScene", function(data) {
        removePlayerOnScene(data.pionId);
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
    role = $('input[name=role]:checked').val();
    calculCompetences(playerStats);

    document.getElementById('pseudo').innerText = document.getElementById('login').value;
    document.getElementById('accueil').style.display = "none";
    document.getElementById('content').style.display = "block";
    $('#serverLabel').text(room);
    
    socketio.emit("newUser", { userName : userName, room : room, stats : playerStats, role : role});

}

// Event handler pour les inputs du plateau
$("document").ready(function(){

    // Lors du choix d'une image pour la scene
    $('#imagefile').bind('change', function(e){
        var data = e.originalEvent.target.files[0];
        var reader = new FileReader();
        reader.onload = function(evt){
            //image('me', evt.target.result);
            socketio.emit('user image', evt.target.result);
        };
        reader.readAsDataURL(data);
    });
    
    // Lors d'un click sur le bouton "Ajouter Joueur"
    $('#addPlayer').bind('click',function(e){
        console.log('color client: '+ $('#html5colorpicker').val());
        if($('#addPlayer').text() == 'Afficher joueur'){
            $('#addPlayer').text('Cacher Joueur');
            socketio.emit('addPlayerOnScene', {color: $('#html5colorpicker').val()});
        } else {
            $('#addPlayer').text('Afficher joueur');
            socketio.emit('removePlayerOnScene');
        }
        
    });
    
    // Lors d'un click sur le bouton "Ajouter Joueur"
    $('caption').click(function(){
        $(this).next("tbody").toggle();
    });
});