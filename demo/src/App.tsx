import 'vanilla-x/Object'
import React, { ReactNode } from 'react'
import ReactDOM from 'react-dom'
import { Router, Link } from '@reach/router'
import AudioAnalyzer from './sections/AudioAnalyser'
import Boombox from './sections/Boombox'
import MultiTrack from './sections/MultiTrack'
import StepSequencer from './sections/StepSequencer'
import { ATOM } from '../../src'
import AudioView from './AudioView'
import { AppBar, Box, CssBaseline, Divider, Drawer, List, ListItem, ListItemText, Toolbar, Typography } from '@material-ui/core'
import { ThemeProvider, createMuiTheme } from '@material-ui/core/styles'
import * as Icon from '@material-ui/icons'
import IconButton from '@material-ui/core/IconButton'
import isMobile from 'ismobilejs'
import 'fontsource-roboto'

require('./App.scss')
require('github-fork-ribbon-css/gh-fork-ribbon.css')

const device = isMobile(window.navigator)
const logoURL = require('./logo.svg').default

const theme = createMuiTheme({
	palette: {
		primary: {
			main: '#003',
		},
		action: {
			active: '#fff',
		},
		text: {
			primary: '#003',
		},
	}
})

const routes = {
	'/audio-analyzer': 'Audio Analyser',
	'/boombox': 'Boombox',
	'/multi-track': 'Multi Track',
	'/step-sequencer': 'Step Sequencer',
}

type RouteKey = keyof typeof routes

class App extends React.Component<{}, App.State> {
	public state: App.State = {
		isMenuOpen: !(device.phone || device.tablet)
	}

	private stage = new ATOM.Stage

	constructor(props: {}) {
		super(props)
		;(window as any).STAGE = this.stage
	}

	public toggleMenu(): void {
		this.setState({ isMenuOpen: !this.state.isMenuOpen })
	}

	public updateRoute(): void {
		this.forceUpdate()
	}

	public render(): ReactNode {
		const isMenuOpen = this.state.isMenuOpen

		return <ThemeProvider theme={theme}>
			<div className="App">
				<CssBaseline />
				<a
					className={`github-fork-ribbon ${(device.phone || device.tablet) && 'right-bottom' || 'right-top'}`}
					href="https://github.com/FilipeBeck/react-audio-engine"
					target="new"
					data-ribbon="Fork me on GitHub"
					title="Fork me on GitHub"
				>
					Fork me on GitHub
				</a>
				<AppBar className={isMenuOpen && 'shift' || 'unshift'} position="fixed">
					<Toolbar>
						<Box>
							{!isMenuOpen && <IconButton
								color="inherit"
								aria-label="open drawer"
								onClick={this.xBind('toggleMenu')}
								edge="start"
							>
								<Icon.Menu color="action" />
							</IconButton>}
						</Box>
						<Box>
							<Typography variant={(device.phone || device.tablet) && 'h6' || 'h5'}>React Audio Engine</Typography>
						</Box>
						<Box/>
					</Toolbar>
				</AppBar>
				<Toolbar />
				<Drawer
					variant={(device.phone || device.tablet) && 'temporary' || 'persistent'}
					open={isMenuOpen}
					onClose={this.xBind('toggleMenu')}
				>
					<div className="header">
						<Box m={1}>
							<img className="logo" src={logoURL} />
						</Box>
						<IconButton onClick={this.xBind('toggleMenu')}>
							<Icon.ChevronLeft fontSize="large" fontWeight="bold" color="action"/>
						</IconButton>
					</div>
					<Divider/>
					<List>
						{(Object.keys(routes) as RouteKey[]).map(id => (
							<ListItem key={id}>
								<Link
									className={location.pathname === id && 'active' || 'inactive'}
									to={id}
									onClick={this.xBind((device.phone || device.tablet) && 'toggleMenu' || 'updateRoute')}
								>
									<ListItemText>{routes[id]}</ListItemText>
								</Link>
							</ListItem>
						))}
					</List>
				</Drawer>
				<main className={isMenuOpen && 'shift' || 'unshift'}>
					{/* <nav>
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
					</nav> */}
					{/* <section> */}
						<AudioView.Context.Provider value={{ stage: this.stage }}>
							<Router>
								<AudioAnalyzer path="/audio-analyzer" />
								<Boombox path="/boombox" />
								<MultiTrack path="/multi-track" />
								<StepSequencer path="/step-sequencer" />
							</Router>
						</AudioView.Context.Provider>
					{/* </section> */}
				</main>
			</div>
		</ThemeProvider>
	}
}
namespace App {
	export interface State {
		isMenuOpen: boolean
	}
}

const root = document.createElement('div')
document.body.appendChild(root)

ReactDOM.render(<App/>, root)