import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { PerspectiveCamera, WebGLRenderer } from 'three'

export const setupControls = (
	camera: PerspectiveCamera,
	renderer: WebGLRenderer
) => {
	const controls = new OrbitControls(camera, renderer.domElement)
	controls.enableDamping = true
	controls.dampingFactor = 0.25
	controls.enableZoom = true
	controls.minDistance = 1
	controls.maxDistance = 5
	controls.enablePan = false
	controls.minPolarAngle = Math.PI / 5
	controls.maxPolarAngle = Math.PI / 1.75

	controls.target.set(0, 1.75, 0)
	controls.update()

	return controls
}
