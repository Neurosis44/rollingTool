var sceneManager = function(game) {};

var clickRate = 300;
var nextClick = 0;

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
    
    if(imageFond.width < 800) var x = Math.round((gameScene.width - imageFond.width) / 2);
    else var x = 0;

    if(imageFond.height < 600)  var y = Math.round((gameScene.height - imageFond.height) / 2);
    else var y = 0;
    
    gameScene.playersGroup = gameScene.add.group();
    
    var fond = gameScene.add.sprite(x, y, 'fond');
    
    // Gestion de la camera
    gameScene.world.setBounds(0, 0, imageFond.width, imageFond.height);
    cursors = gameScene.input.keyboard.createCursorKeys();
    
    gameScene.timerPosition = null;

}

sceneManager.prototype.update = function() {
    //This method is called every frame.
    gameScene.playersGroup.callAll('update');
    gameScene.playersGroup.forEach(function(item) {
        item.text.x = Math.floor(item.x + item.width/2 - item.text.width / 2);
        item.text.y = item.y + item.height + 3;
    }, this);

    // Deplacement de la camera
    if (cursors.up.isDown)
    {
        gameScene.camera.y -= 10;
        
    }
    else if (cursors.down.isDown)
    {
        gameScene.camera.y += 10;
    }

    if (cursors.left.isDown)
    {
        gameScene.camera.x -= 10;
    }
    else if (cursors.right.isDown)
    {
        gameScene.camera.x += 10;
    }
    
    // Gestion des clicks de la souris
    if (gameScene.input.activePointer.isDown)
    {
        if($('input[name=selectForm]:checked').val() == "addPNJ"){
            addPNJEvent();
        }
    }
    
}

sceneManager.prototype.render = function() {
    gameScene.playersGroup.callAll('render');
}

//The first argument to a button callback is the button itself.
sceneManager.prototype.playCallback = function(btn) {
    
}

// Ajoute un pion a la scène
function addPlayerOnScene(playerName, color, x, y){
    var graphics = gameScene.add.graphics(20, 20);
    
    // and finally add the third 1px wide unfilled blue circle with a radius of 150
    graphics.drawCircle(0, 0, 20);
    graphics.beginFill(color.replace('#','0x'));
    
    // add first 1px wide unfilled red circle with a radius of 50 at the center (0, 0) of the graphics object
    graphics.lineStyle(3, '0x000000');
    graphics.drawCircle(0, 0, 20);
    graphics.endFill();
    graphics.visible = false;
    
    if(x && y){
        var sprite = gameScene.add.sprite(gameScene.camera.x + x, gameScene.camera.y + y, graphics.generateTexture());
    } else {
        var sprite = gameScene.add.sprite(gameScene.camera.x+(SCENE_WIDTH/2), gameScene.camera.y+(SCENE_HEIGHT/2), graphics.generateTexture());
    }
    sprite.inputEnabled = true;
    sprite.input.enableDrag(true);
    
    sprite.events.onDragStart.add(onDragStart, this);
    sprite.events.onDragStop.add(onDragStop, this);
    sprite.playerName = playerName;
    
    // permet de supprimer le pion lors d'un click
    sprite.events.onInputDown.add(function(sprite){
        if($('input[name=selectForm]:checked').val() == "deletePNJ"){
            socketio.emit('removePlayerOnScene', { pionId : playerName});
        }
    }, this);
    
    // Ajout du text sous le pion
    var style = { font: "15px Arial", fill: color,fontWeight : 'bold', align: "center" };
    sprite.text = gameScene.add.text(0, 0, sprite.playerName, style);
    
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
            gameScene.world.remove(item.text);
            gameScene.playersGroup.remove(item);
        }
        
    });
}

// Appelé lors de l'ajout d'un PNJ, on bride le ratio de click pour ne pas faire popper trop de PNJs
function addPNJEvent(){
    if (gameScene.time.now > nextClick)
    {
        nextClick = gameScene.time.now + clickRate;

        var x = gameScene.input.mousePointer.x;
        var y = gameScene.input.mousePointer.y;
        
        socketio.emit('addPNJOnScene', {color: '#000000', pnjName : $('#pnjNameInput').val(), x : x, y : y});
    }
}