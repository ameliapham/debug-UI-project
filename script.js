import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import GUI from 'lil-gui'

// Debug
const gui = new GUI()
const debugObject = {}

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Object

const geometry = new THREE.BoxGeometry(1,1,1,2,2,2)
const material = new THREE.MeshBasicMaterial({color: debugObject.color = "#eea0dd"
})
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)

gui
    .add(mesh.scale, 'x')
    .min(-3)
    .max(3)
    .step(0.01)
    .name('scaleX')

gui
    .add(mesh, 'visible')

gui 
    .add(material, 'wireframe')

gui
    .addColor(material, 'color')

 
// Camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000)
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
