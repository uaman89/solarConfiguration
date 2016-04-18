var ConfigurationDrawModel =  function( paramsObj ){

    var params = paramsObj;

    var container, camera,
        moduleTexture, moduleMaterial, moduleBaseMaterials, supportMaterial,
        controls,
        light, renderer,  scene;

    var configurationContainer, supportBar, supportBarWidth;

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

        //"base" for supports
        supportBar = new THREE.Mesh(
            new THREE.BoxGeometry(),
            supportMaterial
        );

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
        var distanceToGround = params.distanceToGround / 1000;

        // clear old configuration model:
        configurationContainer.children = [];

        var modulesContainer = new THREE.Object3D();
        var supportsContainer = new THREE.Object3D();


        // module begin:
        var module = new THREE.Object3D();

        var moduleSize = {
            height: params.moduleHeight / 1000,
            width: params.moduleWidth / 1000,
            depth: params.moduleDepth / 1000
        };

        //change module orientation
        if (params.moduleOrientation == 'horizontal'){
            moduleTexture.repeat.set(10, 5);
        }
        else{
            moduleTexture.repeat.set(5, 10);
        }

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
        supportBarWidth = params.supports.width/1000;

        var tableFrameBarPositionOffset = moduleSize.height*0.3; //30% of height from center  [ 20% | < 30% * 30% > | 20% ]
        //end: рельса, на которой лежит ряд модулей


        // generate the "table" begin:

        // модули добавляем в "контейнер".
        // при добавлении в контейнер, середина модуля == середине контейнера, поєтому сдвинем каждай модуль влево на половину ширины, и вверх на половину высоту.
        // модули сдвигаютя относительно центра "контейнера" - таким образом, по горизонтали "нулевая точка" будет по центру стола:
        // по оси Х: сдвигаем каждый модуль влево на половину ширины стола, а затем вправо на половину ширины модуля                |_|_|*|_|_|
        var offsetX = -( tableWidth / 2 ) + moduleSize.width/2;

        //                                                                                                                    |_|_|_|_|_|_|_|
        //                                                                                                                    |_|_|_|_|_|_|_|
        //по вертикали "нулевая точка" будет в самом низу: так удобнее - относительно нее будет поворачиваться столешница     |_|_|_|*|_|_|_|
        var offsetY = moduleSize.height/2;
        var moduleInterval = params.r/1000;

        var longSupportBar = supportBar.clone();
        longSupportBar.geometry = new THREE.BoxGeometry(tableWidth, supportBarWidth, supportBarWidth, 1,1,1);

        for ( var row = 0; row < params.rows; row++ ){
            for ( var col = 0; col <  params.modulesCount; col++ ){
                var moduleClone = module.clone();

                moduleClone.position.x = col * (moduleSize.width + moduleInterval);
                moduleClone.position.x += offsetX; //move it left for half of table width

                moduleClone.position.y = row * (moduleSize.height + moduleInterval);
                moduleClone.position.y += offsetY;

                modulesContainer.add( moduleClone );
            }

            //add "frame bars"
            for ( var index = 0; index<2; index++ ) {
                var barOffsetY = ( index == 0 ) ? -tableFrameBarPositionOffset : tableFrameBarPositionOffset;
                barOffsetY = ( barOffsetY + moduleSize.height/2 ) + (moduleSize.height * row); //вот тут я уже сам запутался

                var bar = longSupportBar.clone();
                bar.position.set( 0, barOffsetY, -moduleSize.depth );
                modulesContainer.add( bar );
            }

        }//end for


        //add left & right frame bars begin:
        var xPos = -tableWidth / 2 + supportBarWidth/2;
        var yPos = tableHeight / 2;

        var sideSupportBar = supportBar.clone();
        sideSupportBar.geometry = new THREE.BoxGeometry(supportBarWidth, tableHeight, supportBarWidth);

        for ( var index = 0; index<2; index++ ) {
            var sideSupport = sideSupportBar.clone();
            xPos = (index==0) ?  xPos : -xPos;
            sideSupport.position.set( xPos, yPos, -moduleSize.depth);
            modulesContainer.add( sideSupport );
        }
        //end add left & right frame bars



        //move table up above the ground
        modulesContainer.position.set( 0, distanceToGround, 0 );

        //rotate for angle which was set by user
        //     +90* <- | -> -90*   ... / <- (-60) == (30)
        modulesContainer.rotation.x = ( -90 + parseInt(params.tableAngle) ) * Math.PI / 180;

        configurationContainer.add(modulesContainer);
        //end generate the "table"


        //draw supports begin:
        var supportOffset = 0;

        var frontSupportHeight = distanceToGround;
        var frontSupportOffsetY = frontSupportHeight/2;

        var backSupportHeight  = params.H/1000 - params.supports.width/2/1000;
        var backSupportOffsetY = backSupportHeight/2;
        var backSupportOffsetZ = -params.B/1000 + supportBarWidth/2;

        var offsetX = -tableWidth/2 + supportBarWidth/2;


        var frontSupport = supportBar.clone();
        frontSupport.geometry = new THREE.BoxGeometry(supportBarWidth, frontSupportHeight, supportBarWidth);

        var backSupport = supportBar.clone();
        backSupport.geometry = new THREE.BoxGeometry(supportBarWidth, backSupportHeight, supportBarWidth);

        for ( var i=0; i < params.supports.count; i++ ){
            var xPos = (params.supports.interval/1000 * i) + offsetX;

            //front supports
            var frontSupportClone = frontSupport.clone();
            frontSupportClone.position.set( xPos, frontSupportOffsetY, -supportBarWidth );
            supportsContainer.add(frontSupportClone);

            //back supports
            var backSupportClone = backSupport.clone();
            backSupportClone.position.set( xPos, backSupportOffsetY, backSupportOffsetZ );
            supportsContainer.add(backSupportClone);
        }

        configurationContainer.add( supportsContainer );
        //end draw supports

        console.log('drawModel');
    };
//--- end drawModel --------------------------------------------------------------------------------------------------------------------------------------------


    this.centerCamera = function(){
        controls.target = new THREE.Vector3(
            configurationContainer.position.x,
            configurationContainer.position.y + params.H/2/1000,
            configurationContainer.position.z
        );
        camera.position.y = params.H/2/1000 + 1;
        camera.position.z = configurationContainer.position.z + 5;
    }
//--- end centerCamera() --------------------------------------------------------------------------------------------------------------------------------------------


};

//end file