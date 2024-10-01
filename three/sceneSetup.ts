import { WebGLRenderer } from 'three'
import {
	initializeScene,
	initializeCamera,
	initializeRenderer,
} from '@utils/threeUtils'

export const setupScene = (mountRef: HTMLDivElement) => {
	const scene = initializeScene()
	const camera = initializeCamera()
	const renderer = initializeRenderer(mountRef) as WebGLRenderer

	return { scene, camera, renderer }
}
