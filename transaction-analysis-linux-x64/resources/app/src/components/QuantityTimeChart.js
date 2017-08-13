import React from 'react';
import {ResponsiveContainer,LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend} from 'Recharts';

export default class QuantityTimeChart extends React.Component {
	constructor() {
		super();
		this.state = {
			unit:'min'
		};
	}
	setUnit(unit) {
		this.setState({unit:unit});
	}
	getViewData(quantityMap,quantityData) {
		if(quantityMap) {
			quantityMap.map((x,key)=>{
				quantityData.push({time:key, count:x.get('count')});
			});
		}
	}
	render() {
		const {quantityMap,total} = this.props;
		let quantityData = [];
		if(quantityMap.map) {
			this.getViewData(quantityMap.get(this.state.unit),quantityData);
		}
		quantityData.sort((a,b) => (a.time > b.time) - (a.time < b.time));
		return (
		<div style={styles.outerDiv} className={quantityData.length>0 ? '':'hiddenCompletely'}>
			<div style={styles.unitDiv}>
				x : datetime 
				<br/>
				y : amount 
				<br/>
				unit : {this.state.unit}
			</div>
			<div style={styles.btnDiv}>
				<button style={styles.btnStyle} onClick={()=>this.setUnit('min')} >Min</button>
				<button style={styles.btnStyle} onClick={()=>this.setUnit('hour')}>Hour</button>
				<button style={styles.btnStyle} onClick={()=>this.setUnit('day')}>Day</button>
			</div>
			<ResponsiveContainer>
				<LineChart	data={quantityData}
						padding={{bottom:100}}
						margin={{top: 5, right: 30, left: 20, bottom: 5}}>
					<XAxis interval={'preserveStart'} dataKey="time" />
					<YAxis/>
					<CartesianGrid strokeDasharray="3 3"/>
					<Tooltip/>
					<Line dataKey="count" fill="#8884d8" />
				</LineChart>
			</ResponsiveContainer>
		</div>
		);
	}
}
const styles = {
	outerDiv:{
		height:400,
		marginBottom:50
	},
	btnStyle:{
		marginLeft:15
	},
	unitDiv:{
		float:'left',
		paddingLeft:50,
		display:'inline-block',
		textAlign:'left'
	},
	btnDiv:{
		display:'inline-block'
	}
};


