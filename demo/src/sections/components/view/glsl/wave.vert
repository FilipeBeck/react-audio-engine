attribute vec2 position;
varying lowp float amplitude;
uniform lowp float width;
uniform lowp float offset;

void main() {
	gl_Position = vec4(((position.x - offset) / (width / 2.0) - 1.0), position.y, 0.0 , 1.0);
	amplitude = abs(float(position.y));
}