import React from 'react';
import Dropzone from 'react-dropzone';

export default class FileDropzone extends React.Component {
	constructor() {
		super();
	}

	onDrop(files) {
		//reject the same file
		let validFile = true;
		for(var k in files) {
			const dropFile = files[k].name;
			for(var l in this.props.files) {
				if(dropFile == this.props.files[l].name) {
					validFile = false;
					alert(dropFile +" is already dropped");
					break;
				}
			}
			
		}
		if(validFile)
			this.props.getFiles(files);
	}

	render() {
		return (
			<div style={styles.outerDiv}>
				<div >
					<Dropzone activeStyle={styles.activeStyle} rejectStyle={styles.rejectStyle}	style={styles.dropArea} onDrop={this.onDrop.bind(this)}>
						<p>Try dropping transaction.log here, or click to select it to upload.</p>
					</Dropzone>
				</div>
				<div>
					<h2>Dropped files</h2>
					<div>
							{
								this.props.files.map(f => <p key={f.name}>{f.name} - {f.size} bytes</p>)
							}
					</div>
					<h1>--------------------------------------------------</h1>
				</div>
			</div>
		);
	}
}
const styles = {
	outerDiv:{
		marginBottom:'-40px'
	},
	dropArea: {
		//width: '50%',
		display:'inline-block',	
		height: '200px',
		borderWidth: '2px',
		borderColor: 'rgb(102, 102, 102)',
		borderStyle: 'dashed',
		borderRadius: '5px'
	},
	activeStyle: {
		borderStyle: 'solid',
		borderColor: '#6c6',
		backgroundColor: '#eee'
	},
	rejectStyle: {
		borderStyle: 'solid',
		borderColor: '#c66',
		backgroundColor: '#eee'
	}
};

