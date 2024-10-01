import {
	Object3D,
	Object3DEventMap,
	Vector3,
	Mesh,
	Material,
	MeshStandardMaterial,
	MeshPhongMaterial,
} from 'three'
import { moveCameraToPosition } from './cameraUtils'

export const handleMouseMove = (
	event: { clientX: number; clientY: number },
	mouse: { x: number; y: number }
) => {
	mouse.x = (event.clientX / window.innerWidth) * 2 - 1
	mouse.y = -(event.clientY / window.innerHeight) * 2 + 1
}

export const handleClick = (
	INTERSECTED: { current: Mesh | null },
	camera: { position: gsap.TweenTarget; lookAt: (arg0: any) => void },
	controls: { target: gsap.TweenTarget; update: () => void },
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
				2 // Duration
			)
		}
	}
}

const isMeshMaterial = (
	material: Material
): material is MeshStandardMaterial | MeshPhongMaterial => {
	return (material as MeshStandardMaterial).emissive !== undefined
}

const setEmissiveHex = (material: Material, hex: number) => {
	if (isMeshMaterial(material)) {
		material.emissive.setHex(hex)
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
	INTERSECTED: { current: Mesh | null }
) => {
	const animate = () => {
		requestAnimationFrame(animate)

		raycaster.setFromCamera(mouse, camera)

		const intersects = raycaster.intersectObjects(scene.children, true)

		if (intersects.length > 0) {
			if (INTERSECTED.current !== intersects[0].object) {
				if (INTERSECTED.current) {
					if (Array.isArray(INTERSECTED.current.material)) {
						INTERSECTED.current.material.forEach((mat) =>
							setEmissiveHex(mat, INTERSECTED.current!.userData.currentHex)
						)
					} else {
						setEmissiveHex(
							INTERSECTED.current.material,
							INTERSECTED.current.userData.currentHex
						)
					}
				}

				INTERSECTED.current = intersects[0].object as Mesh
				INTERSECTED.current.userData.currentHex = Array.isArray(
					INTERSECTED.current.material
				)
					? (
							INTERSECTED.current.material[0] as MeshStandardMaterial
					  ).emissive.getHex()
					: (
							INTERSECTED.current.material as MeshStandardMaterial
					  ).emissive.getHex()

				if (Array.isArray(INTERSECTED.current.material)) {
					INTERSECTED.current.material.forEach((mat) =>
						setEmissiveHex(mat, 0xff0000)
					)
				} else {
					setEmissiveHex(INTERSECTED.current.material, 0xff0000)
				}
			}
		} else {
			if (INTERSECTED.current) {
				if (Array.isArray(INTERSECTED.current.material)) {
					INTERSECTED.current.material.forEach((mat) =>
						setEmissiveHex(mat, INTERSECTED.current!.userData.currentHex)
					)
				} else {
					setEmissiveHex(
						INTERSECTED.current.material,
						INTERSECTED.current.userData.currentHex
					)
				}
			}
			INTERSECTED.current = null
		}

		renderer.render(scene, camera)
		controls.update()
	}

	animate()
}
