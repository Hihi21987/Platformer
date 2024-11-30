function levelSetUp() {
    tiles.w = 100;
    tiles.h = height/30;
    tiles.tile = "=";
    tiles.collider = "static";
    tiles.addAni(tilemap, { row: 0 });
  
    buttons.w = 100;
    buttons.h = height/30;
    buttons.tile = "b";
    buttons.collider = "static";
  
    obj.w = 50;
    obj.h = 50;
    obj.tile = "o";
    obj.collider = "dynamic";
    obj.rotationLock = true;
    obj.addAni(blockImg, { row: 0 });
  
    walls.w = 30;
    walls.h = height/3 + height/30;
    walls.tile = "|";
    walls.collider = "static";
    walls.color = "black";
  
    doors.tile = "d";
    doors.color = "yellow";
  
    endWall.tile = "e";
    endWall.h = 400;
  
    saws.w = 40;
    saws.h = 40;
    saws.tile = "s";
    saws.collider = "kinematic";
    saws.image = sawImg;
  
    switch (level) {
      case 1:
        tilesGroup = new Tiles(
          [
            ".........|...e",
            "..=b==..=b..==",
            "..d......o..dd",
            "..====.s==.===",
            "...o.|.......|",
            "====.=..=b==.==",
          ],
          0,
          height/6,
          100,
          height/6
        );
        spinnerSetup(300, height/6 * 4 - height/30);
        break;
      case 4:
        tilesGroup = new Tiles(
          [
            ".........o.e...",
            "..=b==...======",
            ".......o.dd...|",
            ".s=b...=.=...=",
            "....oo...|.....",
            "==..==...=======",
          ],
          0,
          height/6,
          100,
          height/6
        );
        turretSetup(1250, height/6 * 4 - height/30);
        break;
      case 3:
        tilesGroup = new Tiles(
          [
            ".......................e.",
            "==..........==.......=...",
            "...o...................d.",
            "..====...s..========.s==.",
            ".......................|.",
            "==..==.....b=..====...====",
          ],
          0,
          height/6,
          100,
          height/6
        );
        spinnerSetup(700, height/6 * 4 - height/30);
        turretSetup(2000, height/6 * 3 - height/30);
        turretSetup(2000, height/6 * 3 + height/20);
        turretSetup(2000, height/6 * 4 - height/30);
        break;
      case 2:
        tilesGroup = new Tiles(
          [
            ".................e...",
            "==..==..=======b=====",
            "..................d..",
            "..==============b====",
            "....d...s..s..s.s...",
            "==..==..==..=..==..===",
          ],
          0,
          height/6,
          100,
          height/6
        );
        turretSetup(1800, height/6 * 3 - height/30);
        turretSetup(1600, height/6 * 2 - height/5);
        spinnerSetup(1800, height/6 * 5 - height/30);
        break;
      case 5:
        tilesGroup = new Tiles(
          [
            "....................e",
            "....==========b======",
            ".........s.....sd.dsd",
            "....==..======b======",
            "......s....s...o.s.|.",
            "===b=======..=====.===",
          ],
          0,
          height/6,
          100,
          height/6
        );
        turretSetup(1500, height/6 * 3 - height/30);
        spinnerSetup(1500, height/6 * 4 - height/30);
        turretSetup(500, height/6 * 3 - height/30);
        break;
      default:
        //replay 5th level
        tilesGroup = new Tiles(
          [
            "....................e",
            "....==========b======",
            ".........s.....sd.dsd",
            "....==..======b======",
            "......s....s...o.s.|.",
            "===b=======..=====.===",
          ],
          0,
          height/6,
          100,
          height/6
        );
        turretSetup(1500, height/6 * 3 - height/30);
        spinnerSetup(1500, height/6 * 4 - height/30);
        turretSetup(500, height/6 * 3 - height/30);
        break;
    }
    endWall.offset.y = -100; 
    end = new Sprite(
      tiles[tiles.length - 1].x,
      tiles[tiles.length - 1].y - 50,
      [10, -72, 10, 144, 5],
      "static"
    );
    end.strokeWeight = 10;
    end.color = "yellow";
  }