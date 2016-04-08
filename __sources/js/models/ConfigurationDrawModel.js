/**
 * Created by victor on 08.04.16.
 */
var ConfigurationDrawModel =  {
    init: function( canvasId, paramsObj ){

        container = document.createElement('div');
        container.className = "container";
        document.body.appendChild(container);

        camera = new THREE.PerspectiveCamera(70, window.innerWidth / canvasHeight, 1, 2000);
        camera.position.y = 250;
        camera.position.z = 500;


        scene = new THREE.Scene();


        // load a texture, set wrap mode to repeat
        var texture = new THREE.TextureLoader().load("textures/2.jpg");
//        texture.wrapS = THREE.RepeatWrapping;
//        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(1, 1);
        //var moduleMaterial = new THREE.MeshLambertMaterial({map: texture});
        var moduleMaterial = new THREE.MeshBasicMaterial({map: texture, overdraw: true});


        solPanelParams.height = rows * ( moduleSize.height + spaceBetweenModules );
        solPanelParams.width = cols * ( moduleSize.width + spaceBetweenModules );
        solPanelParams.halfHeight = solPanelParams.height/2;
        solPanelParams.halfWidth = solPanelParams.width/2;

        for ( r = 0; r < rows; r++ ) {
            for ( c = 0; c < cols; c++ ) {
                // module
                module = new THREE.Mesh(new THREE.CubeGeometry(moduleSize.width, 10, moduleSize.height, 10, 4, 4), moduleMaterial);
                module.overdraw = true;

                module.position.x = c * ( moduleSize.width + spaceBetweenModules );
                module.position.z = r * ( moduleSize.height + spaceBetweenModules );

                solarModulesContainer.add(module);
            }
        }

        //correct position
        solarModulesContainer.position.x = -solPanelParams.halfWidth + moduleSize.width/2;
        solarModulesContainer.position.z = -moduleSize.height/2;
        solarModulesContainer.position.y = 150;
        rotateAroundWorldAxis(solarModulesContainer, new THREE.Vector3(1, 0, 0), 30 * Math.PI / 180);

        solarPanel.add(solarModulesContainer);


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

        scene.add(solarPanel);
        camera.lookAt(solarPanel.position);



        renderer = new THREE.CanvasRenderer({ alpha: true });

        renderer.antialias = true;

        renderer.setSize(window.innerWidth, canvasHeight);
        //renderer.setClearColor(0x00C0DC, 1);

        container.appendChild(renderer.domElement);

    },
};