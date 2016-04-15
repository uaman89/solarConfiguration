var ConfigurationDrawModel =  function( paramsObj ){

    var params = paramsObj;

    var container, camera,
        moduleTexture, moduleMaterial, moduleBaseMaterials, supportMaterial,
        controls,
        light, renderer,  scene;

    var configurationContainer;

    var _this = this;

// InitDrawModel begin:

    this.init = function(){
        container = $('#configuration' + params.configurationId + ' .renderer-container');

        containerWidth = container.width();
        containerHeight =  container.width() * 0.75;


        scene = new THREE.Scene();
        scene.fog = new THREE.Fog( 0xffffff, 0.01, 60 ); // blue: 0x66B9FC


        camera = new THREE.PerspectiveCamera( 75,containerWidth / containerHeight, 0.1, 1000 );
        camera.position.z = 5;


        // Load a texture, set wrap mode to repeat
        moduleTexture = new THREE.TextureLoader().load("textures/solar-cell.png");
        moduleTexture.wrapS = THREE.RepeatWrapping;
        moduleTexture.wrapT = THREE.RepeatWrapping;
        moduleTexture.repeat.set(5, 10);


        // Load a texture, set wrap mode to repeat
        groundTexture = new THREE.TextureLoader().load("textures/grass.jpg");
        groundTexture.wrapS = THREE.RepeatWrapping;
        groundTexture.wrapT = THREE.RepeatWrapping;
        groundTexture.repeat.set(100, 100);


        // module materials begin:
        //moduleMaterial = new THREE.MeshBasicMaterial( {map: moduleTexture,  overdraw: true} );
        moduleMaterial = new THREE.MeshPhongMaterial( {
            map: moduleTexture,
            //overdraw: true,
            transparent: true,
            shininess: 50,
            specular: 0x222222,
            shading: THREE.SmoothShading
        } );
        moduleBaseMaterials = [
            new THREE.MeshBasicMaterial({ color: 0xE0E0E0 }),
            new THREE.MeshBasicMaterial({ color: 0xE0E0E0 }),
            new THREE.MeshBasicMaterial({ color: 0xE0E0E0 }),
            new THREE.MeshBasicMaterial({ color: 0xE0E0E0 }),
            new THREE.MeshBasicMaterial({ color: 0x000000 }),
            new THREE.MeshBasicMaterial({ color: 0xE0E0E0 })
        ];
        //end module materials


        //support material
        supportMaterial = new THREE.MeshPhongMaterial( {
            color: 0x979797,
            shininess: 200,
            specular: 0xffffff,
            shading: THREE.SmoothShading
        } );


        //ground
        var groundMaterial = new THREE.MeshPhongMaterial( {
            map: groundTexture,
            shininess: 10,
            specular: 0x222222,
            shading: THREE.SmoothShading
        } );

        var ground = new THREE.Mesh( new THREE.PlaneGeometry( 150, 150, 1, 1), groundMaterial );
        ground.rotation.x = -90 * Math.PI/180;
        ground.position.y = 0;
        //ground.receiveShadow = true;
        scene.add( ground );
        //end ground

        configurationContainer = new THREE.Object3D();
        configurationContainer.castShadow = true;

        scene.add( configurationContainer );



        renderer = Detector.webgl ? new THREE.WebGLRenderer() : new THREE.CanvasRenderer();
        renderer.setSize( containerWidth, containerHeight);
        renderer.setClearColor(0xffffff, 1); //fill bg with color


        //light begin:
        light = new THREE.DirectionalLight(0xFFFFFF);
        light.position.set(0, 1, 1);
        light.target.position.set(0, 0, -10);

        light.castShadow = true;

        scene.add(light);

        //scene.add( new THREE.CameraHelper( light.shadow.camera ) );// some help object
        //end light


        //mouse control in 3 lines :) awesome!
        controls = new THREE.OrbitControls( camera, container[0] );
        controls.addEventListener( 'change', this.drawModel );


        container.html(renderer.domElement);


        var render = function () {
            //requestAnimationFrame( render );
            setTimeout(render,125);

            controls.update();
            //module.rotation.x += 0.1;
            //module.rotation.y += 0.1;

            renderer.render(scene, camera);
        };

        render();

        camera.position.y = 5;
        camera.position.z = 3;

        //renderer = new THREE.CanvasRenderer({ alpha: true });
    };

//--- end Init ----------------------------------------------------------------------------------------------------------------------------



    this.drawModel = function(){

        // ! ВСЕ РАЗМЕРЫ ВВЕДЕННЫЕ ПОЛЬЗОВАТЕЛЕМ ДЕЛИМ НА 1000.

        var tableHeight = params.tableHeight / 1000;
        var tableWidth = params.tableWidth / 1000;

        // clear children:
        configurationContainer.children = [];


        var modulesContainer = new THREE.Object3D();


        // module begin:
        var module = new THREE.Object3D();

        var moduleSize = {
            height: params.moduleHeight / 1000,
            width: params.moduleWidth / 1000,
            depth: params.moduleDepth / 1000,
        };

        //change module orientation
        if (params.moduleOrientation == 'horizontal'){
            moduleTexture.repeat.set(10, 5);
        }
        else{
            moduleTexture.repeat.set(5, 10);
        }
        console.log('params.moduleOrientation',params.moduleOrientation);

        var moduleBase = new THREE.Mesh(
            new THREE.BoxGeometry( moduleSize.width, moduleSize.height, moduleSize.depth, 1,1,1 ),
            new THREE.MeshFaceMaterial( moduleBaseMaterials )
            //new THREE.MeshBasicMaterial({ color: 0xE0E0E0 })
        );

        var moduleTopFace = new THREE.Mesh(
                new THREE.PlaneGeometry( moduleSize.width-0.05, moduleSize.height-0.05, 1, 1),
                moduleMaterial
                //new THREE.MeshBasicMaterial({ map: moduleTexture, transparent: true })
        );
        moduleTopFace.position.z += moduleSize.depth - moduleSize.depth/2 + 0.001; // + 0.001 - чтобы панель с ячейками была чуть-чуть выше "основы"
        module.add(moduleBase, moduleTopFace);
        // end module


        //рельса, на которой лежит ряд модулей
        var tableFrameBarWidth = 40/1000;
        var tableFrameBar = new THREE.Mesh(
            new THREE.BoxGeometry( tableWidth, tableFrameBarWidth, tableFrameBarWidth, 1,1,1 ),
            supportMaterial
        );
        var tableFrameBarPositionOffset = moduleSize.height*0.3; //30% of height from center  [ 20% | < 30% * 30% > | 20% ]
        //end: рельса, на которой лежит ряд модулей


        // generate the "table" begin:
        var arrModules = new Array();
        var arrTableFrameBars = new Object();

        // модули добавляем в "контейнер".
        // при добавлении в контейнер, середина модуля == середине контейнера, поєтому сдвинем каждай модуль влево на половину ширины, и вверх на половину высоту.
        // модули сдвигаютя относительно центра "контейнера" - таким образом, по горизонтали "нулевая точка" будет по центру стола:
        // по оси Х: сдвигаем каждый модуль влево на половину ширины стола, а затем вправо на половину ширины модуля                |_|_|*|_|_|
        var offsetX = -( tableWidth / 2 ) + moduleSize.width/2;

        //                                                                                                                    |_|_|_|_|_|_|_|
        //                                                                                                                    |_|_|_|_|_|_|_|
        //по вертикали "нулевая точка" будет в самом низу: так удобнее - относительно нее будет поворачиваться столешница     |_|_|_|*|_|_|_|
        var offsetY = moduleSize.height/2;

        for ( var row = 0; row < params.rows; row++ ){
            arrModules[ row ] = new Array();
            for ( var col = 0; col <  params.modulesCount; col++ ){
                arrModules[ row ][ col ] = module.clone();

                arrModules[ row ][ col ].position.x = col * moduleSize.width;
                arrModules[ row ][ col ].position.x += offsetX; //move it left for half of table width
                
                arrModules[ row ][ col ].position.y = row * moduleSize.height;
                arrModules[ row ][ col ].position.y += offsetY;
                modulesContainer.add( arrModules[ row ][ col ] );
            }


            //add "frame bars"
            arrTableFrameBars[ row ] = new Array();
            for ( var index = 0; index<2; index++ ) {
                var barOffsetY = ( index == 0 ) ? -tableFrameBarPositionOffset : tableFrameBarPositionOffset;
                barOffsetY = ( barOffsetY + moduleSize.height/2 ) + (moduleSize.height * row); //вот тут я уже сам запутался
                arrTableFrameBars[ row ][ index ] = tableFrameBar.clone();
                arrTableFrameBars[ row ][ index ].position.set( 0, barOffsetY, -moduleSize.depth );
                modulesContainer.add( arrTableFrameBars[ row ][ index ] );
            }

        }//end for


        //add left & right frame bars begin:
        arrTableFrameBars['sideBars'] = new Array();
        var xPos = -tableWidth / 2 + tableFrameBarWidth;
        var yPos = tableHeight / 2;
        for ( var index = 0; index<2; index++ ) {
            arrTableFrameBars['sideBars'][index] = tableFrameBar.clone();
            arrTableFrameBars['sideBars'][index].geometry = new THREE.BoxGeometry(tableFrameBarWidth, tableHeight, tableFrameBarWidth);
            xPos = (index==0) ?  xPos : -xPos;
            arrTableFrameBars['sideBars'][index].position.set( xPos, yPos, -moduleSize.depth);
            modulesContainer.add( arrTableFrameBars['sideBars'][index] );
        }
        //end add left & right frame bars



        //move table up above the ground
        modulesContainer.position.set( 0, params.distanceToGround / 1000, 0 );

        modulesContainer.rotation.x = -params.tableAngle * Math.PI / 180;

        configurationContainer.add(modulesContainer);
        //end generate the "table"


        //draw supports begin:
        var supWidth = 40;


        //end draw supports

        console.log('draw module');
    };
//--- end drawModel --------------------------------------------------------------------------------------------------------------------------------------------

};
//--- end ConfigurationDrawModel() -----------------------------------------------------------------------------------------------------------------------------


/*
 //solPanelSupports
 supportBarMaterial = new THREE.MeshBasicMaterial({color: 0xE0, overdraw: true});

 var supportBarRows = 2;
 var supportBarPerRow = 4;
 var suppBarWidth = 10;
 spaceBetweenSupportsX = solPanelParams.width / ( supportBarPerRow - 1 ) - suppBarWidth;
 spaceBetweenSupportsZ = solPanelParams.height - suppBarWidth  - 20;

 var suppBarHeight ;
 for (r=0; r < supportBarRows; r++) {
 for (c = 0; c < supportBarPerRow; c++) {
 suppBarHeight = ( r < 1 ) ? 170 : 70;
 var supportBar = new THREE.Mesh(new THREE.CubeGeometry(suppBarWidth, suppBarHeight, suppBarWidth, 4, 4, 4), supportBarMaterial);

 supportBar.position.x = (c * spaceBetweenSupportsX) - solPanelParams.halfWidth;
 //shiftFirst for correct position
 if (c==0) supportBar.position.x += suppBarWidth;

 supportBar.position.z = (r * spaceBetweenSupportsZ) - solPanelParams.halfHeight;
 if (r==0) supportBar.position.z += suppBarWidth;

 supportBar.position.y += suppBarHeight/2;
 solarPanel.add(supportBar);
 }
 }
 */


/*

 // Plane
 planeMaterial = new THREE.MeshBasicMaterial({color: 0x7a7a7a, overdraw: true});
 //        planeMaterial.polygonOffset = true;
 //        planeMaterial.polygonOffsetFactor = -0.1;
 //planeMaterial.opacity = 0.5;
 //planeMaterial.overdraw = false;

 plane = new THREE.Mesh(new THREE.PlaneGeometry(solPanelParams.width, solPanelParams.height, 10, 10), planeMaterial);
 plane.rotation.x = -90 * ( Math.PI / 180 );
 //plane.overdraw = true;
 solarPanel.add(plane);
* */