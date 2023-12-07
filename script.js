import * as THREE from 'three'

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Object
const geometry = new THREE.BoxGeometry(1,1,1,2,2,2)
const material = new THREE.MeshBasicMaterial({color: 'pink'})
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)

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

// Renderer
const renderer = new THREE.WebGLRenderer({canvas: canvas})
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.render(scene, camera)