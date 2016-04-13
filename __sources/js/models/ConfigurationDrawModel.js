var ConfigurationDrawModel =  function( paramsObj ){

    var params = paramsObj;

    var moduleSize = {
        height: params.moduleHeight,
        width: params.moduleWidth,
        length: params.moduleLength,
    };

    var rows = params.rows, cols = params.modulesCount;


    var solPanelParams = {
        height: null,
        width: null,
        isRotate: false,
        rotateDirection: null
    };

    var spaceBetweenModules = 5;

    var container, camera, texture, moduleMaterial, renderer, controls;

    var configurationContainer, scene;

// InitDrawModel begin:

    this.init = function(){
        container = $('#configuration' + params.configurationId + ' .renderer-container');

        containerWidth = container.width();
        containerHeight =  container.width() * 0.75;


        scene = new THREE.Scene();


        camera = new THREE.PerspectiveCamera( 75,containerWidth / containerHeight, 0.1, 1000 );
        camera.position.z = 5;


        // Load a texture, set wrap mode to repeat
        texture = new THREE.TextureLoader().load("textures/solar-cell.png");
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(5, 10);


        moduleMaterial = new THREE.MeshBasicMaterial( {map: texture,  overdraw: true} );


        configurationContainer = new THREE.Object3D();

        scene.add( configurationContainer );
        console.log('scene',scene);


        renderer = Detector.webgl ? new THREE.WebGLRenderer({ alpha: true }) : new THREE.CanvasRenderer({ alpha: true });
        //renderer.antialias = true;
        renderer.setSize( containerWidth, containerHeight);
        //renderer.setClearColor(0x00C0DC, 1);


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

        //camera.lookAt(solarPanel.position);

        //renderer = new THREE.CanvasRenderer({ alpha: true });




    };
//--- end Init ----------------------------------------------------------------------------------------------------------------------------

    this.drawModel = function(){

        // clear children:
        configurationContainer.children = [];

        var modulesContainer = new THREE.Object3D();

        // module begin:
        var module = new THREE.Object3D();

        moduleSize = {
            height: params.moduleHeight / 1000,
            width: params.moduleWidth / 1000,
            depth: params.moduleDepth / 1000,
        };

        var moduleBase = new THREE.Mesh(
            new THREE.BoxGeometry( moduleSize.width, moduleSize.height, moduleSize.depth, 1,1,1 ),
            new THREE.MeshBasicMaterial({ color: 0xE0E0E0 })
        );

        var moduleTopFace = new THREE.Mesh(new THREE.PlaneGeometry( moduleSize.width-0.05, moduleSize.height-0.05, 10, 10), new THREE.MeshBasicMaterial({ map: texture }) );
        moduleTopFace.position.z += moduleSize.depth;


        module.add(moduleBase, moduleTopFace);
        // end module


        // generate the "table"
        var arrModules = new Array();
        var offsetX = (params.modulesCount * moduleSize.width) / 2 - moduleSize.width/2;
        var offsetY = (params.rows * moduleSize.height) / 2 - moduleSize.height/2;

        for ( var row = 0; row < params.rows; row++ ){
            arrModules[ row ] = new Array();
            for ( var col = 0; col <  params.modulesCount; col++ ){
                arrModules[ row ][ col ] = module.clone();

                //centered table in the middle of the screen
                arrModules[ row ][ col ].position.x = col * moduleSize.width;
                arrModules[ row ][ col ].position.y = row * moduleSize.height;
                modulesContainer.add( arrModules[ row ][ col ] );
            }
        }

        modulesContainer.position.x -= offsetX;
        modulesContainer.position.y -= offsetY;
        modulesContainer.rotation.x = -params.tableAngle * Math.PI / 180;

        configurationContainer.add(modulesContainer);

        console.log('draw module');
    };


};
//--- end ConfigurationDrawModel() -----------------------------------------------------------------------------------------------------------


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