import { OutlinePass } from 'three/examples/jsm/postprocessing/OutlinePass.js'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { WebGLRenderer, Scene, PerspectiveCamera, Vector2 } from 'three'

export const setupPostProcessing = (
	renderer: WebGLRenderer,
	scene: Scene,
	camera: PerspectiveCamera
) => {
	const renderPass = new RenderPass(scene, camera)
	const outlinePass = new OutlinePass(
		new Vector2(window.innerWidth, window.innerHeight),
		scene,
		camera
	)

	outlinePass.edgeStrength = 1
	outlinePass.edgeGlow = 10
	outlinePass.edgeThickness = 10
	outlinePass.pulsePeriod = 5
	outlinePass.visibleEdgeColor.set('#ffffff')
	outlinePass.hiddenEdgeColor.set('#190a05')

	const composer = new EffectComposer(renderer)
	composer.addPass(renderPass)
	composer.addPass(outlinePass)

	return { composer, outlinePass }
}
