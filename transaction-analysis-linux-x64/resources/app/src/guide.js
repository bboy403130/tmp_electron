import React from 'react';
import ReactDOM from 'react-dom';
import OS from 'os';																																												 
window.onload = function() {
	ReactDOM.render(
		<div>
				<h1>
					Hi { OS.userInfo().username }
				</h1>
		<div>
					<h3>
					This page is showing how to use Transaction-Analysis
					</h3>
					<div style={styles.displayInline}>
						<p style={styles.pFont}> Drop it</p> 
						<img src="src/resource/guide.gif" />
						<br/>
						<p style={styles.pFont}> Shortcut Keys</p> 
						<ul style={styles.textAlignLeft}>
							<li style={styles.margin5px}>ControlOrCommand +{' '}<p style={styles.keys}> ?</p> : Show this guide</li>
							<li style={styles.margin5px}>ControlOrCommand +{' '}<p style={styles.keys}> r</p> : Restart app</li>
							<li style={styles.margin5px}>ControlOrCommand +{' '}<p style={styles.keys}>e</p> : Show develop console</li>
							<li style={styles.margin5px}>ControlOrCommand +{' '}<p style={styles.keys}>p</p> : Print to PDF</li>
							<li style={styles.margin5px}>ControlOrCommand +{' '}<p style={styles.keys}>-</p> : Zoom out</li>
							<li style={styles.margin5px}>ControlOrCommand +{' '}<p style={styles.keys}> +</p> : Zoom in</li>
						</ul>		
					
					</div>
			</div>
		</div>	
		, document.getElementById('app'));
};
const styles = {
	keys:{
		width: 10,
		display: 'inline-block',
		color: 'darkred',
		fontSize:20
	},
	margin5px:{
		margin:5,
		height: 30
	},
	pFont:{
		fontSize: 25,
		margin: 10 
	},
	displayInline:{
		display:'inline-block'
	},
	textAlignLeft:{
		textAlign:'left'
	}
};
