// src/utils/cameraUtils.js
import { gsap } from 'gsap'
import * as THREE from 'three'

export const moveCameraToPosition = (
	camera: { position: gsap.TweenTarget; lookAt: (arg0: any) => void },
	controls: { target: gsap.TweenTarget; update: () => void },
	targetPosition: { x: any; y: any; z: any },
	target: { x: any; y: any; z: any },
	duration: number
) => {
	gsap.to(camera.position, {
		x: targetPosition.x,
		y: targetPosition.y,
		z: targetPosition.z,
		duration,
		onUpdate: () => {
			camera.lookAt(target)
		},
	})

	gsap.to(controls.target, {
		x: target.x,
		y: target.y,
		z: target.z,
		duration,
		onUpdate: () => {
			controls.update()
		},
	})
}
