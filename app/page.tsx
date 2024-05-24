'use client'

import { useEffect, useRef } from 'react'
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls.js'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

import styles from './page.module.css'

const Home = () => {
	const mountRef = useRef(null)
	const minXValue = 4.8
	const maxXValue = -4.8
	const minYValue = 4.8
	const maxYValue = -4.8

	useEffect(() => {
		// Basic setup
		const scene = new THREE.Scene()
		const camera = new THREE.PerspectiveCamera(
			75,
			window.innerWidth / window.innerHeight,
			0.1,
			10000
		)
		camera.position.set(1.5, 1.5, 1.8)

		const renderer = new THREE.WebGLRenderer()
		renderer.setSize(window.innerWidth, window.innerHeight)
		mountRef.current.appendChild(renderer.domElement)

		// Initialize controls
		const controls = new PointerLockControls(camera, renderer.domElement)
		const onClick = () => {
			if (!controls.isLocked) {
				controls.lock()
				console.log('Attempting to lock controls')
			}
		}
		mountRef.current.addEventListener('click', onClick)

		// Lighting
		const ambientLight = new THREE.AmbientLight(0x404040, 2)
		scene.add(ambientLight)
		const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5)
		directionalLight.position.set(0, 1, 0)
		scene.add(directionalLight)

		// Load model
		const loader = new GLTFLoader()
		loader.load('/models/test.glb', (gltf) => {
			scene.add(gltf.scene)
		})

		// Handle resizing
		const handleResize = () => {
			camera.aspect = window.innerWidth / window.innerHeight
			camera.updateProjectionMatrix()
			renderer.setSize(window.innerWidth, window.innerHeight)
		}
		window.addEventListener('resize', handleResize)

		// Movement variables
		let moveForward = false
		let moveBackward = false
		let moveLeft = false
		let moveRight = false
		let canJump = false

		const onKeyDown = function (event) {
			switch (event.code) {
				case 'ArrowUp':
				case 'KeyW':
					moveForward = true
					break
				case 'ArrowDown':
				case 'KeyS':
					moveBackward = true
					break
				case 'ArrowLeft':
				case 'KeyA':
					moveLeft = true
					break
				case 'ArrowRight':
				case 'KeyD':
					moveRight = true
					break
			}
		}

		const onKeyUp = function (event) {
			switch (event.code) {
				case 'ArrowUp':
				case 'KeyW':
					moveForward = false
					break
				case 'ArrowDown':
				case 'KeyS':
					moveBackward = false
					break
				case 'ArrowLeft':
				case 'KeyA':
					moveLeft = false
					break
				case 'ArrowRight':
				case 'KeyD':
					moveRight = false
					break
			}
		}

		document.addEventListener('keydown', onKeyDown)
		document.addEventListener('keyup', onKeyUp)

		// Velocity and direction vectors
		const velocity = new THREE.Vector3()
		const direction = new THREE.Vector3()

		// Raycaster for mouse click
		const raycaster = new THREE.Raycaster()
		const mouse = new THREE.Vector2()

		const targetPosition = new THREE.Vector3()
		let isMoving = false

		const onMouseClick = (event) => {
			// Calculate mouse position in normalized device coordinates (-1 to +1) for both components
			mouse.x = (event.clientX / window.innerWidth) * 2 - 1
			mouse.y = -(event.clientY / window.innerHeight) * 2 + 1

			// Update the picking ray with the camera and mouse position
			raycaster.setFromCamera(mouse, camera)

			// Calculate objects intersecting the picking ray
			const intersects = raycaster.intersectObjects(scene.children, true)
			if (intersects.length > 0) {
				console.log('Clicked object:', intersects[0].object)
				if (intersects[0].object.name === 'mesh_7') {
					console.log('Correct!')
					// Constrain target position within set boundaries
					const constrainedX = Math.max(maxXValue, Math.min(minXValue, 6))
					const constrainedZ = Math.max(maxYValue, Math.min(minYValue, 6))
					targetPosition.set(constrainedX, camera.position.y, constrainedZ)
					camera.lookAt(new THREE.Vector3(0, 0, 0))
					isMoving = true
				}
			}
		}
		document.addEventListener('click', onMouseClick)

		// Animation loop
		const animate = () => {
			requestAnimationFrame(animate)

			if (controls.isLocked) {
				const delta = 0.1 // adjust for speed

				if (!isMoving) {
					// Update direction based on input flags
					direction.z = Number(moveForward) - Number(moveBackward)
					direction.x = Number(moveRight) - Number(moveLeft)
					direction.normalize() // Ensures consistent movements in all directions

					// Update velocity
					if (moveForward || moveBackward) velocity.z -= direction.z * delta
					if (moveLeft || moveRight) velocity.x -= direction.x * delta

					// Apply movement
					controls.moveRight(-velocity.x * delta)
					controls.moveForward(-velocity.z * delta)

					// Apply damping
					velocity.x *= 0.9 // damping for x
					velocity.z *= 0.9 // damping for z

					// Clamp the camera's x and z position
					camera.position.x = Math.max(
						maxXValue,
						Math.min(minXValue, camera.position.x)
					)
					camera.position.z = Math.max(
						maxYValue,
						Math.min(minYValue, camera.position.z)
					)
				} else {
					// Smoothly interpolate to the target position
					camera.position.lerp(targetPosition, 0.05)
					if (camera.position.distanceTo(targetPosition) < 0.1) {
						camera.position.copy(targetPosition) // Set final position without clamping
						isMoving = false // Stop moving
					}
				}
			}

			renderer.render(scene, camera)
		}
		animate()

		// Cleanup function
		return () => {
			mountRef.current.removeEventListener('click', onClick)
			document.removeEventListener('click', onMouseClick)
			window.removeEventListener('resize', handleResize)
			document.removeEventListener('keydown', onKeyDown)
			document.removeEventListener('keyup', onKeyUp)
			mountRef.current.removeChild(renderer.domElement)
			controls.dispose()
			scene.clear()
			renderer.dispose()
		}
	}, [])

	return (
		<div className={styles.homeContainer}>
			<h1 className={styles.heading}>My Portfolio</h1>
			<div ref={mountRef} className={styles.canvasContainer} />
			<div className={styles.crosshair}></div>
		</div>
	)
}

export default Home
