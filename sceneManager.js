var sceneManager = function(game) {};

sceneManager.prototype.preload = function() {
    //Here you can preload images, audio, spritesheets and so on.
    /*var data = new Image();
    data.baseURI = sceneData;
    gameScene.cache.addImage('fond', sceneData, data);*/
    
    gameScene.load.image('fond', sceneData);

};

sceneManager.prototype.create = function() {
    //Position image fond accueil
    var imageFond = gameScene.cache.getImage('fond');
    
    var x = Math.round((gameScene.width / 2) - (imageFond.width / 2));
    var y = Math.round((gameScene.height / 2) - (imageFond.height / 2));
    
    gameScene.playersGroup = gameScene.add.group();
    
    var fond = gameScene.add.sprite(x, y, 'fond');
    
    gameScene.timerPosition = null;

}

sceneManager.prototype.update = function() {
    //This method is called every frame.
    gameScene.playersGroup.callAll('update');
}

sceneManager.prototype.render = function() {
    gameScene.playersGroup.callAll('render');
}

//The first argument to a button callback is the button itself.
sceneManager.prototype.playCallback = function(btn) {
    
}

// Ajoute un pion a la scène
function addPlayerOnScene(playerName, color){
    var graphics = gameScene.add.graphics(20, 20);
    color.replace('#','0x');
    console.log("teeeees:"+color.replace('#','0x'));
    graphics.beginFill(color.replace('#','0x'));
    graphics.drawCircle(470, 20, 20);
    graphics.endFill();
    graphics.visible = false;
    
    var sprite = gameScene.add.sprite(20, 20, graphics.generateTexture());
    sprite.inputEnabled = true;
    sprite.input.enableDrag(true);
    
    sprite.events.onDragStart.add(onDragStart, this);
    sprite.events.onDragStop.add(onDragStop, this);
    sprite.playerName = playerName;
    
    console.log("joueur ajouté: "+playerName);
    gameScene.playersGroup.add(sprite);
    gameScene.world.bringToTop(gameScene.playersGroup);
}

function onDragStart(sprite){
    gameScene.timerPosition = gameScene.time.events.loop(250, emitPosition, this, sprite);
}

function emitPosition(sprite){
    socketio.emit("updatePlayerPosition", { pionId: sprite.playerName, x: sprite.x, y : sprite.y });
}

function onDragStop(){
    gameScene.time.events.remove(gameScene.timerPosition);
}

// Met à jour la position du pion d'id pionId
function updatePlayerPosition(pionId, newX, newY){
    //console.log("new position de "+playerName+" x: "+newX+"y: "+ newY);
    
    gameScene.playersGroup.forEach(function(item) {
        
        if(item.playerName == pionId){
            // Commenter/Decommenter selon le type de mouvement à appliquer
            // -> Saccade mais on attend pas de focus sur la fenetre
            item.x = newX;
            item.y = newY;
            
            // -> fluide mais attend un focus sur la fenetre
            //gameScene.add.tween(item).to( {x:newX, y : newY}, 100, Phaser.Easing.Quadratic.InOut, true).start();
        }
    });
}

// Enlève le pion d'id pionId
function removePlayerOnScene(pionId){
    //console.log("new position de "+playerName+" x: "+newX+"y: "+ newY);
    
    console.log('suppression du pion : '+pionId);
    gameScene.playersGroup.forEach(function(item) {
        if(item.playerName == pionId){
            gameScene.playersGroup.remove(item);
        }
        
    });
}