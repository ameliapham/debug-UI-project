import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import GUI from 'lil-gui'
import gsap from 'gsap'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';


// Debug
const gui = new GUI({
    title : 'Controls My Nice Cube',
    closeFolders : false
})
gui.close()
/* gui.hide()

window.addEventListener('keydown', (event) => {
    if (!gui.show & event.key == 'h'){
        gui.show()
    } if (gui.show & event.key == 'h'){
        gui.hide()
    }
}) */



const debugObject = {}


// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Models
const loader = new GLTFLoader()

const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath('/draco/');
loader.setDRACOLoader(dracoLoader);

loader.load('/models/Robot.glb', (gltf) => {
    scene.add(gltf.scene)
})


/* Object
debugObject.color = "#eea0dd"

const geometry = new THREE.BoxGeometry(1,1,1,2,2,2)
const material = new THREE.MeshBasicMaterial({color: debugObject.color, wireframe : true})

const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh) 

const scaleCube = gui.addFolder('Scale Cube')

scaleCube
    .add(mesh.scale, 'x')
    .min(-3)
    .max(3)
    .step(0.01)
    .name('scaleX')

scaleCube
    .add(mesh.scale, 'y')
    .min(-3)
    .max(3)
    .step(0.01)
    .name('scaleY')

gui
    .add(mesh, 'visible')

gui 
    .add(material, 'wireframe')

gui
    .addColor(debugObject, 'color')
    .onChange(() => {
        material.color.set(debugObject.color)
    })

debugObject.rotation = () => {
    gsap.to(mesh.rotation, {y: mesh.rotation.y + Math.PI, x: mesh.rotation.x + Math.PI})
}

gui
    .add(debugObject, 'rotation')

debugObject.subdivision = 2
gui
    .add(debugObject, 'subdivision')
    .min(1)
    .max(20)
    .step(1)
    .onFinishChange(() => {
        mesh.geometry.dispose()
        mesh.geometry = new THREE.BoxGeometry(
            1,1,1,
            debugObject.subdivision, debugObject.subdivision, debugObject.subdivision
        )
    })
*/
// Camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight)
camera.position.z = 3
scene.add(camera)

window.addEventListener('resize', () => {
    // Update camera 
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()

    // Update renderer 
    renderer.setSize(window.innerWidth, window.innerHeight)
})

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

// Renderer
const renderer = new THREE.WebGLRenderer({canvas: canvas})
renderer.setSize(window.innerWidth, window.innerHeight)

// Animation
const animation = () =>{
    // Controls Update
    controls.update()

    renderer.render(scene, camera)
    window.requestAnimationFrame(animation)
}

animation()
