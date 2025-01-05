import { scale, spriteScale, textData } from "./constants.js";
import  { k } from "./kaboom.js";
import { displayDialog, setCameraScale } from "./utilities.js";

k.loadSprite("spritesheet", "./spritesheet.png", {
    sliceX: 39, //how many frames in x axis
    sliceY: 31, //how many frames in y axis
    anims: {
        "idle-down": 956,
        "walk-down": { from: 956, to: 959, loop: true, speed: 8 },
        "idle-side": 995,
        "walk-side": { from: 995, to: 998, loop: true, speed: 8 },
        "idle-up": 1034,
        "walk-up": { from: 1034, to: 1037, loop: true, speed: 8 },
    },
});

k.loadSprite("map", "./apartmentMap.png");

k.setBackground(k.Color.fromHex("#311047"));

k.scene("main", async() => {
const mapData = await (await fetch("apartmentMap.json")).json(); //await fetch function so other code doesn't execute in the meantime, then its converted into json (.json method)
const layers = mapData.layers;

const map = k.add([
    k.sprite("map"),
    k.pos(0),
    k.scale(scale),
]);
const player = k.make([
    k.sprite("spritesheet", { anim: "idle-down"}), 
    k.area({
        shape: new k.Rect(k.vec2(0, 3), 10, 10),

    }),
    k.body(),
    k.anchor("center"),
    k.pos(), //x: 64 y: 120
    k.scale(spriteScale), //sprite scale
    {
        speed: 150,
        direction: "down",
        isInDialog: false
    },
    "player", //custom component
   
]);


//displaying boundaries
for (const layer of layers) {
    if (layer.name === "collisions") {
        for (const boundary of layer.objects) {
            map.add([
                k.area({
                    shape: new k.Rect(k.vec2(0), boundary.width, boundary.height),
                }),
                k.body({
                    isStatic: true, //makes sure the player can't go through boundary
                }),
                k.pos(boundary.x, boundary.y),
                boundary.name //name of boundary "tag"
            ]);

            if (boundary.name) {
                player.onCollide(boundary.name, () => {
                    player.isInDialog = true;
                    //display dialog
                    displayDialog(textData[boundary.name], () => {
                        player.isInDialog = false; //so player can move again
                    });
                });
            };
        };
        continue;
      };

      if (layer.name === "spawn") {
        for (const entity of layer.objects) {
            if (entity.name === "player") {
                player.pos = k.vec2(
                    (map.pos.x + entity.x) * scale, //multiply by scale to make it looks big and not pixelated
                    (map.pos.y + entity.y) * scale
                );
                k.add(player);
                continue;
            };
          };
        }
    };


    //camera scaling for different screen sizes
    //setCameraScale(k);
    //k.onResize(() => {
    //    setCameraScale(k);
    //});

    //camera to follow player
    k.onUpdate(() => {
        k.camPos(player.worldPos().x, player.worldPos().y - 100);
    });

    k.onMouseDown((mouseBtn) => {
        if (mouseBtn !== "left" || player.isInDialog) return; 
         //player movement
            const mousePosition = k.toWorld(k.mousePos()); //toWorld function converts mouse position to world position
            player.moveTo(mousePosition, player.speed); //when dragging mouse, player moves to mouse position
        
        //player facing different directions
        const mouseAngle = player.pos.angle(mousePosition);
        const lowerBound = 50;
        const upperBound = 125;

        //plyer walking up
        if (
            mouseAngle > lowerBound && 
            mouseAngle < upperBound && 
            player.curAnim() !== "walk-up"
        ) {
           player.play("walk-up");
           player.direction = "up";
           return;
        };

        //player walking down
        if (
            mouseAngle < -lowerBound && 
            mouseAngle > -upperBound && 
            player.curAnim() !== "walk-down"
        ) {
            player.play("walk-down");
            player.direction = "down";
            return;
        };

        //player walking right
        if (Math.abs(mouseAngle) > upperBound) {
            player.flipX = false; //flipX changes the sprite direction depending on true or false and if the mouse is inferior or superior to the upperBound or lowerBound
            if (player.curAnim() !== "walk-side") player.play("walk-side");
            player.direction = "right";
            return;
        };

        //player walking left
        if (Math.abs(mouseAngle) < lowerBound) {
            player.flipX = true;
            if (player.curAnim() !== "walk-side") player.play("walk-side");
            player.direction = "left";
            return;
        };
    });

    //mouse release
    k.onMouseRelease(() => {
        if (player.direction === "down") {player.play("idle-down"); return;}
        if (player.direction === "up") {player.play("idle-up"); return;}
        player.play("idle-side"); return;
    });
});

k.go("main"); //define scene and start "go to see it"