import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'


// Debug
const gui = new GUI({
    title : 'Control my nice fox'
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
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100)
camera.position.set(2, 2, 2)
scene.add(camera)

// Sound
const audioListener = new THREE.AudioListener()
camera.add(audioListener)

// Models
const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('/draco/')

const gltfLoader = new GLTFLoader()
gltfLoader.setDRACOLoader(dracoLoader)

let mixer = null
const wireframeFox = { wireframe: false }
const animationFox = { run : false }

const foxSound = new THREE.PositionalAudio(audioListener)
const audioLoader = new THREE.AudioLoader()
const soundControl = {sound : false}
const soundProperties = { volume: 1.0 }

gui.add(soundControl, 'sound').name('Sound').onChange((value) => {
    if (value) {
        foxSound.play();
    } else {
        foxSound.pause();
    }
});

gui.add(soundProperties, 'volume', 0, 1, 0.01).name('Volume').onChange((value) => {
    foxSound.setVolume(value);
});

audioLoader.load('/models/fox/sound/Fox.mp3', (buffer) => {
    foxSound.setBuffer(buffer)
    foxSound.setRefDistance(20)
    foxSound.setLoop(true)
    foxSound.setVolume(soundProperties.volume)
})

gltfLoader.load(
    '/models/fox/glTF/Fox.gltf', (gltf) => {
        gltf.scene.scale.set(0.025, 0.025, 0.025);
        scene.add(gltf.scene);

        // Add sound
        gltf.scene.add(foxSound)

    // GUI
    gui.add(wireframeFox, 'wireframe').name('Wireframe').onChange((value) => {
        
        // Mettre à jour le wireframe 
        gltf.scene.traverse((object) => {
            if (object.isMesh && object.material) {
                 object.material.wireframe = value;
            }
        });
    });

    gui.add(animationFox, 'run').name('Run').onChange((value) => {
        if (value) {
            action.play()
        } else {
            action.stop()
        }
    })

    

    // Animation
    mixer = new THREE.AnimationMixer(gltf.scene)
        const action = mixer.clipAction(gltf.animations[2])
    }
)

// Floor
const floor = new THREE.Mesh(

    new THREE.PlaneGeometry(10, 10),
    new THREE.MeshStandardMaterial({
        color: '#444444',
        metalness: 0,
        roughness: 0.5

    })
)
floor.receiveShadow = true
floor.rotation.x = - Math.PI * 0.5
scene.add(floor)

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

// Controls
const controls = new OrbitControls(camera, canvas)
controls.target.set(0, 0.75, 0)
controls.enableDamping = true

// Renderer

const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(window.innerWidth, window.innerHeight)

// Animation
const clock = new THREE.Clock()
let previousTime = 0

const animation = () =>{
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - previousTime
    previousTime = elapsedTime

    // Model animation
    if(mixer && animationFox.run)
    {
        mixer.update(deltaTime)
    }
    // Controls Update
    controls.update()

    // Render
    renderer.render(scene, camera)
    window.requestAnimationFrame(animation)
}

animation()
