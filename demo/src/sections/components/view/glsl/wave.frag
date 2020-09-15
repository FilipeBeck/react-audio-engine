varying lowp float amplitude;

void main() {
	gl_FragColor = vec4(0, 0, 51.0 / 255.0, 1.0 - amplitude / 1.5);
}