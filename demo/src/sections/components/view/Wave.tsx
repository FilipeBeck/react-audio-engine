import React, { useEffect, useRef, useState } from 'react'

require('./Wave.scss')

const vertexShaderSource = require('./glsl/wave.vert').default as string
const fragmentShaderSource = require('./glsl/wave.frag').default as string

const Wave: React.FC<Wave.Props> = props => {
	const canvasRef = useRef<HTMLCanvasElement>(null)
	const [gl, setGL] = useState<WebGLRenderingContext | null>(null)
	const [currentProgram, setCurrentProgram] = useState<WebGLProgram | null>(null)
	const [widthUniform, setWidthUniform] = useState<WebGLUniformLocation | null>(null)
	const [offsetUniform, setOffsetUniform] = useState<WebGLUniformLocation | null>(null)

	useEffect(() => {
		const canvas = canvasRef.current
		const gl = canvas?.getContext('webgl') ?? null

		if (gl) {
			const canvasRect = canvas!.getBoundingClientRect()
			canvas!.width = canvasRect.width
			canvas!.height = canvasRect.height

			const vertexShader = gl.createShader(gl.VERTEX_SHADER)
			const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER)

			if (!vertexShader || !fragmentShader) {
				throw new Error('Cannot create shader.')
			}

			gl.shaderSource(vertexShader, vertexShaderSource)
			gl.shaderSource(fragmentShader, fragmentShaderSource)

			gl.compileShader(vertexShader)
			gl.compileShader(fragmentShader)

			for (const shader of [vertexShader, fragmentShader]) {
				if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
					throw new Error('Cannot compile shader.')
				}
			}

			const program = gl.createProgram()

			if (!program) {
				throw new Error('Cannot create shader.')
			}

			gl.attachShader(program, vertexShader)
			gl.attachShader(program, fragmentShader)
			gl.linkProgram(program)

			if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
				throw new Error('Cannot link program.')
			}

			gl.useProgram(program)
			gl.clearColor(250 / 255, 1, 250 / 255, 1.0)
			gl.clearDepth(1.0)

			setCurrentProgram(program)
		}

		setGL(gl)
	}, [canvasRef.current])

	useEffect(() => {
		const canvas = props.canvas

		if (canvasRef.current && canvas && gl && currentProgram) {
			const width: string | number = canvas.width ?? canvasRef.current.width
			const height = canvas.height ?? canvasRef.current.height

			gl.viewport(0, 0, typeof width === 'string' && parseFloat(width) || width as number, typeof height === 'string' && parseFloat(height) || height as number)

			const widthUniform = gl.getUniformLocation(currentProgram, 'width')
			const offsetUniform = gl.getUniformLocation(currentProgram, 'offset')

			setWidthUniform(widthUniform)
			setOffsetUniform(offsetUniform)
		}
	}, [gl, currentProgram, props.canvas?.width, props.canvas?.height])

	useEffect(() => {
		if (gl && currentProgram) {
			const buffer = props.buffer
			const waveBuffer = gl.createBuffer()

			const data = new Float32Array(buffer.data.length * 2)

			for (let i = 0, count = buffer.data.length; i < count; i++) {
				const x = i * 2
				data[x + 0] = i
				data[x + 1] = buffer.data[i]!
			}

			gl.bindBuffer(gl.ARRAY_BUFFER, waveBuffer)
			gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW)

			const positionAttribute = gl.getAttribLocation(currentProgram, 'position')

			gl.enableVertexAttribArray(positionAttribute)
			gl.vertexAttribPointer(positionAttribute, 2, gl.FLOAT, false, 0, 0)
		}
	}, [gl, currentProgram, props.buffer.data])

	useEffect(() => {
		if (gl) {
			gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
			gl.uniform1f(widthUniform, props.buffer.width ?? props.buffer.data.length)
			gl.uniform1f(offsetUniform, props.buffer.offset ?? 0)
			gl.drawArrays(gl.LINE_STRIP, props.buffer.offset ?? 0, props.buffer.width ?? props.buffer.data.length)
		}
	}, [gl, widthUniform, offsetUniform, props.buffer.data, props.buffer.width, props.buffer.offset])

	return <div className="Wave">
		<canvas {...props.canvas} ref={canvasRef}></canvas>
	</div>
}
namespace Wave {
	export interface Props {
		canvas?: React.DetailedHTMLProps<React.CanvasHTMLAttributes<HTMLCanvasElement>, HTMLCanvasElement>
		buffer: {
			data: Float32Array
			width?: number
			offset?: number
		}
	}
}

Wave.displayName = 'Wave'

export default Wave
