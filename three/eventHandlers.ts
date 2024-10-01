import { moveCameraToPosition } from '@utils/cameraUtils'
import {
	Raycaster,
	Vector2,
	Mesh,
	Scene,
	PerspectiveCamera,
	WebGLRenderer,
	Vector3,
} from 'three'
import {
	EffectComposer,
	OrbitControls,
	OutlinePass,
} from 'three/examples/jsm/Addons.js'

export const handleResize = (
	camera: PerspectiveCamera,
	renderer: WebGLRenderer,
	composer: EffectComposer
) => {
	camera.aspect = window.innerWidth / window.innerHeight
	camera.updateProjectionMatrix()
	renderer.setSize(window.innerWidth, window.innerHeight)
	composer.setSize(window.innerWidth, window.innerHeight)
}

export const handleMouseMove = (event: MouseEvent, mouse: Vector2) => {
	mouse.x = (event.clientX / window.innerWidth) * 2 - 1
	mouse.y = -(event.clientY / window.innerHeight) * 2 + 1
}

export const handleClick = (
	INTERSECTED: { current: Mesh | null },
	camera: PerspectiveCamera,
	controls: OrbitControls,
	predefinedMeshConfigurations: {
		name: string
		cameraPosition: Vector3
		cameraTarget: Vector3
	}[]
) => {
	if (INTERSECTED.current) {
		console.log('Clicked on mesh:', INTERSECTED.current)

		const meshConfig = predefinedMeshConfigurations.find(
			(config) => config.name === INTERSECTED.current!.name
		)

		if (meshConfig) {
			moveCameraToPosition(
				camera,
				controls,
				meshConfig.cameraPosition,
				meshConfig.cameraTarget,
				2
			)
		}
	}
}

export const animate = (
	raycaster: Raycaster,
	mouse: Vector2,
	camera: PerspectiveCamera,
	scene: Scene,
	outlinePass: OutlinePass,
	composer: EffectComposer,
	controls: OrbitControls,
	INTERSECTED: { current: Mesh | null },
	predefinedMeshConfigurations: {
		name: string
		cameraPosition: Vector3
		cameraTarget: Vector3
	}[]
) => {
	requestAnimationFrame(() =>
		animate(
			raycaster,
			mouse,
			camera,
			scene,
			outlinePass,
			composer,
			controls,
			INTERSECTED,
			predefinedMeshConfigurations
		)
	)

	raycaster.setFromCamera(mouse, camera)
	const intersects = raycaster.intersectObjects(scene.children, true)

	if (intersects.length > 0) {
		const intersectedMesh = intersects[0].object as Mesh

		const meshConfig = predefinedMeshConfigurations.find(
			(config) => config.name === intersectedMesh.name
		)

		if (meshConfig) {
			if (INTERSECTED.current !== intersectedMesh) {
				INTERSECTED.current = intersectedMesh
				outlinePass.selectedObjects = [INTERSECTED.current]
			}
		} else {
			if (INTERSECTED.current !== null) {
				INTERSECTED.current = null
				outlinePass.selectedObjects = []
			}
		}
	} else {
		if (INTERSECTED.current !== null) {
			INTERSECTED.current = null
			outlinePass.selectedObjects = []
		}
	}

	composer.render()
	controls.update()
}
