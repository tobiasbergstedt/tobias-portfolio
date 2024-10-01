'use client'

import { useEffect, useRef } from 'react'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { Object3D, Object3DEventMap, Raycaster, Vector2 } from 'three'
import {
	initializeScene,
	initializeCamera,
	initializeRenderer,
	addLights,
	loadModel,
} from './utils/threeUtils'
import {
	handleMouseMove,
	handleClick,
	animateScene,
} from './utils/interactionUtils'
import dynamic from 'next/dynamic'
import styles from './styles/page.module.css'

const Home = () => {
	const mountRef = useRef<HTMLDivElement>(null)

	useEffect(() => {
		if (!mountRef.current) return

		const scene = initializeScene()
		const camera = initializeCamera()

		// Check if mountRef.current is not null before initializing renderer
		if (mountRef.current) {
			const renderer = initializeRenderer(mountRef.current)
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

			loadModel(scene, '/models/test.glb')
			addLights(scene)

			camera.lookAt(controls.target)

			const handleResize = () => {
				camera.aspect = window.innerWidth / window.innerHeight
				camera.updateProjectionMatrix()
				renderer.setSize(window.innerWidth, window.innerHeight)
			}

			window.addEventListener('resize', handleResize, false)

			const raycaster = new Raycaster()
			const mouse = new Vector2()
			let INTERSECTED: Object3D<Object3DEventMap> | null = null

			window.addEventListener(
				'mousemove',
				(event) => handleMouseMove(event, mouse),
				false
			)
			window.addEventListener(
				'click',
				() => handleClick(INTERSECTED, camera, controls),
				false
			)

			animateScene(
				renderer,
				scene,
				camera,
				controls,
				raycaster,
				mouse,
				INTERSECTED
			)

			return () => {
				window.removeEventListener('resize', handleResize)
				window.removeEventListener('mousemove', (event) =>
					handleMouseMove(event, mouse)
				)
				window.removeEventListener('click', () =>
					handleClick(INTERSECTED, camera, controls)
				)
				if (mountRef.current) {
					mountRef.current.removeChild(renderer.domElement)
				}
				scene.clear()
				renderer.dispose()
			}
		}
	}, [])

	return (
		<>
			<h1 className={styles.heading}>My Portfolio</h1>
			<div ref={mountRef} className={styles.canvasContainer} />
		</>
	)
}

export default Home
