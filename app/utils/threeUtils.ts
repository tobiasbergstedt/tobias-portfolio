// src/utils/threeUtils.js
import {
	AmbientLight,
	DirectionalLight,
	PerspectiveCamera,
	Scene,
	WebGLRenderer,
} from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

export const initializeScene = () => {
	const scene = new Scene()
	return scene
}

export const initializeCamera = () => {
	const camera = new PerspectiveCamera(
		75,
		window.innerWidth / window.innerHeight,
		0.01,
		10000
	)
	camera.position.set(1.067, 1.883, 2.945)
	return camera
}

export const initializeRenderer = (mountRef: HTMLDivElement) => {
	const renderer = new WebGLRenderer()
	renderer.setSize(window.innerWidth, window.innerHeight)
	mountRef.appendChild(renderer.domElement)
	return renderer
}

export const addLights = (scene: Scene) => {
	const ambientLight = new AmbientLight(0x404040, 2)
	scene.add(ambientLight)
	const directionalLight = new DirectionalLight(0xffffff, 0.5)
	directionalLight.position.set(0, 1, 0)
	scene.add(directionalLight)
}

export const loadModel = (scene: Scene, modelPath: string) => {
	const loader = new GLTFLoader()
	loader.load(
		modelPath,
		(gltf: { scene: any }) => {
			const model = gltf.scene
			scene.add(model)
			model.position.set(0, 0, 0)
			console.log('Model added:', model.position)
		},
		(xhr: { loaded: number; total: number }) => {
			console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
		},
		(error: any) => {
			console.error('An error happened loading the GLTF file:', error)
		}
	)
}
