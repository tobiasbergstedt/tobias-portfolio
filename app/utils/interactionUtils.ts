import { Object3D, Object3DEventMap, Vector3 } from 'three'
import { moveCameraToPosition } from './cameraUtils'

export const handleMouseMove = (
	event: { clientX: number; clientY: number },
	mouse: { x: number; y: number }
) => {
	mouse.x = (event.clientX / window.innerWidth) * 2 - 1
	mouse.y = -(event.clientY / window.innerHeight) * 2 + 1
}

export const handleClick = (
	INTERSECTED: Object3D<Object3DEventMap> | null,
	camera: { position: gsap.TweenTarget; lookAt: (arg0: any) => void },
	controls: { target: gsap.TweenTarget; update: () => void }
) => {
	if (INTERSECTED) {
		console.log('Clicked on mesh:', INTERSECTED)
		switch (INTERSECTED.name) {
			case 'mesh_7':
				moveCameraToPosition(
					camera,
					controls,
					new Vector3(5, 5, 5), // Camera position
					new Vector3(0, 0, 0), // Camera target
					2 // Duration
				)
				break
			case 'mesh_8':
				moveCameraToPosition(
					camera,
					controls,
					new Vector3(10, 10, 10),
					new Vector3(1, 1, 1),
					2
				)
				break
			// Add more cases for other meshes
			default:
				break
		}
	}
}

export const animateScene = (
	renderer: { render: (arg0: any, arg1: any) => void },
	scene: { children: any },
	camera: any,
	controls: { update: () => void },
	raycaster: {
		setFromCamera: (arg0: any, arg1: any) => void
		intersectObjects: (arg0: any, arg1: boolean) => any
	},
	mouse: any,
	INTERSECTED: {
		material: {
			emissive: { setHex: (arg0: number) => void; getHex: () => any }
		}
		currentHex: any
	} | null
) => {
	const animate = () => {
		requestAnimationFrame(animate)

		raycaster.setFromCamera(mouse, camera)

		const intersects = raycaster.intersectObjects(scene.children, true)

		if (intersects.length > 0) {
			if (INTERSECTED !== intersects[0].object) {
				if (INTERSECTED)
					INTERSECTED.material.emissive.setHex(INTERSECTED.currentHex)

				INTERSECTED = intersects[0].object
				INTERSECTED.currentHex = INTERSECTED.material.emissive.getHex()
				INTERSECTED.material.emissive.setHex(0xff0000) // Change color on hover
			}
		} else {
			if (INTERSECTED)
				INTERSECTED.material.emissive.setHex(INTERSECTED.currentHex)
			INTERSECTED = null
		}

		renderer.render(scene, camera)
		controls.update()
	}

	animate()
}
