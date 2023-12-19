import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'


// GUI
const gui = new GUI({
    title : 'Control'
})

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

window.addEventListener('resize', () =>
{
    // Update camera
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(window.innerWidth, window.innerHeight)
})

// Base camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
camera.position.set(5, 5, 8)
scene.add(camera)

// Add AudioListener
const audioListener = new THREE.AudioListener()
camera.add(audioListener)

// Models
const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('/draco/')

const gltfLoader = new GLTFLoader()
gltfLoader.setDRACOLoader(dracoLoader)

let mixer = null
const foxFolder = gui.addFolder('Control My Nice Fox')
const wireframeFox = { wireframe: false }
const animationFox = { run : false }

// Add shadow control to model
const shadowControl = {castShadow : true}

// Add speed control 
const animationSpeed = {speed: 1.0}

// Add Sounds
const soundControl = {sound : false} // This controls whether sound is playing
const soundPlaylist = {song : 'The Fox Remix'} // This selects the current song
const soundProperties = { volume: 1.0 } // This controls the volume

const sounds = {
    'The Fox Remix' : null,
    'Boggis Bunce Bean Remix' : null
}

const soundFolder = gui.addFolder('Control Sound') // Create folder GUI to control sound

// Add checkbox GUI to active sound
soundFolder.add(soundControl, 'sound').name('Active Sound').onChange((value) => {
    if (value) {
        if (sounds[soundPlaylist.song] && !sounds[soundPlaylist.song].isPlaying) {
            sounds[soundPlaylist.song].play()
        }
    } else {
        Object.keys(sounds).forEach(key => {
            if (sounds[key] && sounds[key].isPlaying) {
                sounds[key].pause()
            }
        })
    }
});

// Control to change the song
soundFolder.add(soundPlaylist, 'song', Object.keys(sounds)).name('Sound').onChange((value) => {
    // Stop current song
    Object.keys(sounds).forEach(key => {
        if (sounds[key] && sounds[key].isPlaying) {
            sounds[key].stop();
        }
    });

    // Update the current song
    soundPlaylist.song = value;

    // Play nouvelle song (only if the checkbox sound is actived)
    if (soundControl.sound) {
        if (sounds[soundPlaylist.song]) {
            sounds[soundPlaylist.song].play();
        }
    }
});

// Control the volume 
soundFolder.add(soundProperties, 'volume', 0, 1, 0.01).name('Volume').onChange((value) => {
    for (let key in sounds) {
        if (sounds[key]) {
            sounds[key].setVolume(value);
        }
    }
});

const audioLoader = new THREE.AudioLoader()

audioLoader.load('/models/fox/sound/The-fox-remix.mp3', (buffer) => {
    sounds['The Fox Remix'] = new THREE.PositionalAudio(audioListener)
    sounds['The Fox Remix'].setBuffer(buffer)
    sounds['The Fox Remix'].setRefDistance(20)
    sounds['The Fox Remix'].setLoop(true)
    sounds['The Fox Remix'].setVolume(soundProperties.volume)
})

audioLoader.load('/models/fox/sound/Boggis-Bunce-Bean-remix.mp3', (buffer) => {
    sounds['Boggis Bunce Bean Remix'] = new THREE.PositionalAudio(audioListener)
    sounds['Boggis Bunce Bean Remix'].setBuffer(buffer)
    sounds['Boggis Bunce Bean Remix'].setRefDistance(20)
    sounds['Boggis Bunce Bean Remix'].setLoop(true)
    sounds['Boggis Bunce Bean Remix'].setVolume(soundProperties.volume)
})

// Update Models
gltfLoader.load('/models/fox/glTF/Fox.gltf', (gltf) => {
    gltf.scene.scale.set(0.03, 0.03, 0.03);
    scene.add(gltf.scene);   

    // Add shadow situation for each mesh in the models
    gltf.scene.traverse((object) => {
        if (object.isMesh) {
            object.castShadow = shadowControl.castShadow
        }
    })

    // Add sound
    if (sounds['The Fox Remix']) gltf.scene.add(sounds['The Fox Remix'])
    if (sounds['Boggis Bunce Bean Remix']) gltf.scene.add(sounds['Boggis Bunce Bean Remix'])

    // GUI
    // Scale
    foxFolder.add(gltf.scene.scale, 'x', 0.025, 0.1).name('Scale X')
    foxFolder.add(gltf.scene.scale, 'y', 0.025, 0.1).name('Scale Y')
    foxFolder.add(gltf.scene.scale, 'z', 0.025, 0.1).name('Scale Z')

    // Wireframe
    foxFolder.add(wireframeFox, 'wireframe').name('Wireframe').onChange((value) => {
        // Mettre à jour le wireframe 
        gltf.scene.traverse((object) => {
            if (object.isMesh && object.material) {
                    object.material.wireframe = value;
            }
        });
    });
    // Shadow
    foxFolder.add(shadowControl, 'castShadow').name('Shadow').onChange((value) => {
        gltf.scene.traverse((object) => {
            if (object.isMesh) {
                object.castShadow = value // Enable shadow casting for object
            }
        })
    })
    // Animation 'Run'
    foxFolder.add(animationFox, 'run').name('Run').onChange((value) => {
        if (value) {
            action.play()
        } else {
            action.stop()
        }
    })

    // Animation Speed
    foxFolder.add(animationSpeed, 'speed', 0.1, 3.0, 0.1).name('Animation Speed').onChange((value) => {
        if (action) {
            action.setEffectiveTimeScale(value)
        }
    })

    // Animation
    mixer = new THREE.AnimationMixer(gltf.scene)
        const action = mixer.clipAction(gltf.animations[2])
        action.setEffectiveTimeScale(animationSpeed.speed)
    }
)

/* Floor
const textureLoader = new THREE.TextureLoader()
const floorTexture = textureLoader.load('/models/floor/Grass.jpg')

const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(10, 10),
    new THREE.MeshStandardMaterial({
        map: floorTexture,
        metalness: 0,
        roughness: 0.5
    })
)
floor.receiveShadow = true
floor.rotation.x = - Math.PI * 0.5
scene.add(floor) */

// Floor video
const floorVideo = document.createElement('video')
floorVideo.src = '/models/floor/Beach.webm'
floorVideo.load()
floorVideo.play()
floorVideo.loop = true

const floorVideoTexture = new THREE.VideoTexture(floorVideo)
floorVideoTexture.minFilter = THREE.LinearFilter
floorVideoTexture.magFilter = THREE.LinearFilter
floorVideoTexture.format = THREE.RGBAFormat 
floorVideoTexture.wrapS = THREE.ClampToEdgeWrapping;
floorVideoTexture.wrapT = THREE.ClampToEdgeWrapping;
floorVideoTexture.repeat.set(1, 1);

floorVideo.addEventListener('loadeddata', () => {
    const aspectVideo = floorVideo.videoWidth / floorVideo.videoHeight;
    const floorGeometry = new THREE.PlaneGeometry(100, 100 / aspectVideo);
    const floorMaterial = new THREE.MeshStandardMaterial({
        map: floorVideoTexture,
        metalness: 0,
        roughness: 0.5
    })
    const floor = new THREE.Mesh( floorGeometry, floorMaterial)
    floor.receiveShadow = true
    floor.rotation.x = - Math.PI * 0.5
    scene.add(floor)
})



// Light
const ambientLight = new THREE.AmbientLight(0xffffff, 2.4)
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight(0xffffff, 1.8)
directionalLight.castShadow = true

directionalLight.shadow.mapSize.set(1024, 1024)
directionalLight.shadow.camera.far = 15
directionalLight.shadow.camera.left = - 7
directionalLight.shadow.camera.top = 7
directionalLight.shadow.camera.right = 7
directionalLight.shadow.camera.bottom = - 7
directionalLight.position.set(- 5, 5, 0)
scene.add(directionalLight)

// Add spotlightHelper
const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight, 5);
scene.add(directionalLightHelper);
directionalLightHelper.visible = false

const lightHelper = {showDirectionalLightHelper : false}
const lightFolder = gui.addFolder('Control Light')
lightFolder.add(lightHelper, 'showDirectionalLightHelper').name('Light Helper').onChange((value) => {
    directionalLightHelper.visible = value
})


// Controls
const controls = new OrbitControls(camera, canvas)
controls.target.set(0, 0.75, 0)
controls.enableDamping = true

// Renderer

const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.shadowMap.enabled = true

// Animation
const clock = new THREE.Clock()
let previousTime = 0

const animation = () =>{
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - previousTime
    previousTime = elapsedTime

    // Speed
    if (mixer && animationFox.run) {
        mixer.update(deltaTime * animationSpeed.speed)
    }

    // Model animation
    if(mixer && animationFox.run)
    {
        mixer.update(deltaTime)
    }
    // Controls Update
    controls.update()

    // Update spotlightHelper 
    directionalLightHelper.update()

    // Update video floor
    if (floorVideo.readyState === floorVideo.HAVE_ENOUGH_DATA) {
        floorVideoTexture.needsUpdate = true;
    }

    // Render
    renderer.render(scene, camera)
    window.requestAnimationFrame(animation)
}

animation()