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
    
    //$("#rollingSprite").animateSprite('restart');
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
        
        $('#Acrobaties :nth-child(2)').text( Math.floor((ForceValue+DexteriteValue)/2));
        $('#Bluff :nth-child(2)').text(Math.floor((CharismeValue+IntelligenceValue)/2));
        $('#Concentration :nth-child(2)').text(ConstitutionValue);
        $('#Deguisement :nth-child(2)').text(Math.floor((CharismeValue+IntelligenceValue)/2));
        $('#DeplacementSilencieux :nth-child(2)').text(DexteriteValue);
        $('#Detection :nth-child(2)').text(PerceptionValue);
        $('#Diplomatie :nth-child(2)').text(CharismeValue);
        $('#Discretion :nth-child(2)').text(DexteriteValue);//
        $('#Equilibre :nth-child(2)').text(DexteriteValue);
        $('#Escalade :nth-child(2)').text(Math.floor((ForceValue+DexteriteValue)/2));
        $('#Estimation :nth-child(2)').text(Math.floor((IntelligenceValue+PerceptionValue)/2));
        $('#Evasion :nth-child(2)').text(Math.floor((SagesseValue+DexteriteValue)/2));
        $('#Fouille :nth-child(2)').text(Math.floor((SagesseValue+PerceptionValue)/2));
        $('#Intimidation :nth-child(2)').text(Math.floor((CharismeValue+ForceValue)/2));
        $('#PerceptionAuditive :nth-child(2)').text(Math.floor((SagesseValue+PerceptionValue)/2));
        $('#Psychologie :nth-child(2)').text(Math.floor((PerceptionValue+EducationValue)/2));
        $('#Renseignements :nth-child(2)').text(Math.floor((PerceptionValue+EducationValue)/2));
        $('#Saut :nth-child(2)').text(Math.floor((ForceValue+DexteriteValue)/2));
        $('#Survie :nth-child(2)').text(Math.floor((SagesseValue+ConstitutionValue)/2));

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

    // appelé lors du jet de dé d'un joueur
    socketio.on("roll", function(data) {
        var node = document.createElement("LI");             
        //var textnode = document.createTextNode(data.message);      
        node.innerHTML = data.message;
        //node.appendChild(textnode);
        document.getElementById('messages').appendChild(node);
        document.getElementById('tchatContent').scrollTop = document.getElementById('tchatContent').scrollHeight;
    });

    // appelé lors d'un connection/deconnexion d'un joueur sur le salon
    socketio.on("refreshUsers", function(data) {
        console.log(data.userList);
        // on refresh la liste des utilisateurs sur le serveur en haut à droite
        $('#userList').empty();
        for(var i=0;i < data.userList.length;i++){                          
            if(data.userList[i].role == "mj") $('#userList').append('<li">'+data.userList[i].userName+' (GM)</li>'); 
            else $('#userList').append('<li>'+data.userList[i].userName+'</li>'); 
        }
        // on vide les HUD
        $('#hud').empty();
        // On ajoute les joueurs
        for(var i=0;i < data.userList.length;i++){                          
            if(data.userList[i].role != "mj") {
                $('#hud').append('<div class="bars fadeInLeft"><div class="bar trigger"><div class="hud-text"><strong id="pseudoHUD">'+data.userList[i].userName+'</strong> <strong>10</strong> / <strong>20</strong> HP</div><div class="health"></div></div></div>');
            }
        }
        // lorsque l'on clique sur un des pseudos, on récupère les stats et on les mets à jour
        $('#userList').find('li').each(function(){
            $(this).click(function(){
                socketio.emit("getPlayerStats", { userName: $(this).text()});
            })
        });
        
    });

    socketio.on("user image", function(data) {
        //$('#imageSend').empty();
        sceneData = data.fileData;
        if(gameScene) gameScene.destroy();
        gameScene = new Phaser.Game(794, 600, Phaser.AUTO, 'gameScene');
        gameScene.state.add('sceneManager', sceneManager, true);
        //$('#imageSend').append($('<p>').append('<img src="' + data.fileData + '"/>'));
    });
    
     // Lors de la suppression d'un pion sur la map
    socketio.on("getGameImage", function(data) {
        //removePlayerOnScene(data.pionId);
        console.log("DATA \n"+data.fileData);
        if(data.fileData){
            //$('#imageSend').empty();
            sceneData = data.fileData;
            if(gameScene) gameScene.destroy();
            gameScene = new Phaser.Game(794, 600, Phaser.AUTO, 'gameScene');
            gameScene.state.add('sceneManager', sceneManager, true);
        }
    });
    
    socketio.on("getPlayerStats", function(data) {
        
        // change le style de la feuille de stats
        document.getElementById('pseudo').innerText = data.userName;
        if(data.userName != userName){
            // si c'est la feuille d'un autre perso, on affiche en blanc
            $('#competences').removeClass('brownBackground');
            $('#competences').css('background-color', '#e6e7e7');
            $('#competences').css('color', 'black');
            $('#pseudoWrapper').attr('class', 'ribbon-other');
            $('#captionRibbonComp').attr('class', 'ribbon-other');
            $('#captionRibbonCaracCommunes').attr('class', 'ribbon-other');
            $('#captionRibbonCarac').attr('class', 'ribbon-other');
        } else {
            // sinon on remet en marron (initiale)
            $('#competences').css('background-color', '#824e3c');
            $('#competences').css('color', 'white');
            $('#pseudoWrapper').attr('class', 'ribbon');
            $('#captionRibbonComp').attr('class', 'ribbon');
            $('#captionRibbonCarac').attr('class', 'ribbon');
            $('#captionRibbonCaracCommunes').attr('class', 'ribbon');
        }
        
        // modifie les valeurs des stats
        calculCompetences(data.stats);
    });
    
    // Lors de l'ajout d'un joueur sur la scène
    socketio.on("addPlayerOnScene", function(data) {
        // on envoie la requete d'ajout à la scène
        addPlayerOnScene(data.pionId, data.color, data.x, data.y, data.type);
    });
    
    // Lors du mouvement d'un des pions
    socketio.on("updatePlayerPosition", function(data) {
        updatePlayerPosition(data.pionId, data.x, data.y, data.type);
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
    
    // On indique qu'on entre dans le salon avec les différentes infos
    socketio.emit("newUser", { userName : userName, room : room, stats : playerStats, role : role});
    // On essaie de recuperer le fond s'il y en a un 
    socketio.emit("getGameImage");

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
        //if ($("#competences").offsetHeight < $("#competences").scrollHeight) {
        //console.log('dépassement de '+ $("#competences").outerHeight());
        if ( document.getElementById('competences').offsetHeight < document.getElementById('competences').scrollHeight) {
            // your element have overflow
            $("#competences").css('padding-right','0px');
        } else {
            $("#competences").css('padding-right','17px');
        }
    });
    
    /*$("#rollingSprite").animateSprite({
        fps: 20,
        animations: {
            rolling: [2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60]
        },
        loop: false,
        complete: function(){
            // use complete only when you set animations with 'loop: false'
        }
    });
    $("#rollingSprite").animateSprite('stop');*/
});