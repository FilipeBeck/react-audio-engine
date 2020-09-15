import React, { ReactNode } from 'react'
import ReactDOM from 'react-dom'
import { Router, Link } from '@reach/router'
import AudioAnalyzer from './sections/AudioAnalyser'
import Boombox from './sections/Boombox'
import MultiTrack from './sections/MultiTrack'
import StepSequencer from './sections/StepSequencer'
import { ATOM } from '../../src'
import AudioView from './AudioView'

require('./App.scss')
require('github-fork-ribbon-css/gh-fork-ribbon.css')

const routes = {
	'/audio-analyzer': 'Audio Analyser',
	'/boombox': 'Boombox',
	'/multi-track': 'Multi Track',
	'/step-sequencer': 'Step Sequencer'
}

type RouteKey = keyof typeof routes

class App extends React.Component {
	private stage = new ATOM.Stage

	constructor(props: {}) {
		super(props)
		;(window as any).STAGE = this.stage
	}

	public render(): ReactNode {
		return <div className="App">
			<header>React Audio Engine Demo</header>
			<a
				className="github-fork-ribbon right-top"
				href="https://github.com/FilipeBeck/react-audio-engine"
				target="new"
				data-ribbon="Fork me on GitHub"
				title="Fork me on GitHub"
			>
					Fork me on GitHub
			</a>
			<main>
				<nav>
					<ul>
						{(Object.keys(routes) as RouteKey[]).map(id => (
							<li key={id}>
								<Link
									to={id}
									style={{ fontWeight: location.pathname === id && 'bold' || 'normal' }}
									onClick={() => this.forceUpdate()}
								>
									{routes[id]}
								</Link>
							</li>
						))}
					</ul>
				</nav>
				<section>
					<AudioView.Context.Provider value={{ stage: this.stage }}>
						<Router>
							<AudioAnalyzer path="/audio-analyzer" />
							<Boombox path="/boombox" />
							<MultiTrack path="/multi-track" />
							<StepSequencer path="/step-sequencer" />
						</Router>
					</AudioView.Context.Provider>
				</section>
			</main>
		</div>
	}
}

const root = document.createElement('div')
document.body.appendChild(root)

ReactDOM.render(<App/>, root)