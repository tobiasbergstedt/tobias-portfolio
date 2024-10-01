'use client'

import { useEffect, useRef } from 'react'
import { setupScene } from '@three/sceneSetup'
import { setupControls } from '@three/controlsSetup'
import { setupPostProcessing } from '@three/postProcessingSetup'
import {
	handleResize,
	handleMouseMove,
	handleClick,
	animate,
} from '@three/eventHandlers'
import { Vector3, Raycaster, Vector2, Mesh } from 'three'
import dynamic from 'next/dynamic'
import styles from '@styles/page.module.css'
import { addLights, loadModel } from '@utils/threeUtils'

const predefinedMeshConfigurations = [
	{
		name: 'mesh_7',
		cameraPosition: new Vector3(2, 2, 5),
		cameraTarget: new Vector3(0, 1.75, 0),
	},
	{
		name: 'mesh_13',
		cameraPosition: new Vector3(3, 3, 7),
		cameraTarget: new Vector3(1, 1, 0),
	},
	{
		name: 'mesh_10',
		cameraPosition: new Vector3(-2, 2, 4),
		cameraTarget: new Vector3(-1, 1.5, 0),
	},
]

const Home = () => {
	const mountRef = useRef<HTMLDivElement>(null)

	useEffect(() => {
		if (!mountRef.current) return

		const { scene, camera, renderer } = setupScene(mountRef.current)
		const controls = setupControls(camera, renderer)
		const { composer, outlinePass } = setupPostProcessing(
			renderer,
			scene,
			camera
		)

		loadModel(scene, '/models/test.glb')
		addLights(scene)

		const raycaster = new Raycaster()
		const mouse = new Vector2()
		const INTERSECTED = { current: null as Mesh | null }

		window.addEventListener(
			'resize',
			() => handleResize(camera, renderer, composer),
			false
		)
		window.addEventListener(
			'mousemove',
			(event) => handleMouseMove(event, mouse),
			false
		)
		window.addEventListener(
			'click',
			() =>
				handleClick(
					INTERSECTED,
					camera,
					controls,
					predefinedMeshConfigurations
				),
			false
		)

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

		return () => {
			window.removeEventListener('resize', () =>
				handleResize(camera, renderer, composer)
			)
			window.removeEventListener('mousemove', (event) =>
				handleMouseMove(event, mouse)
			)
			window.removeEventListener('click', () =>
				handleClick(INTERSECTED, camera, controls, predefinedMeshConfigurations)
			)

			if (mountRef.current) {
				mountRef.current.removeChild(renderer.domElement)
			}
			scene.clear()
			renderer.dispose()
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
