import React from 'react';
import {ResponsiveContainer,BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend} from 'Recharts';

export default class QuantityChart extends React.Component {
	constructor() {
		super();
	}
	getViewData(quantityMap,quantityData) {
		quantityMap.map((x,key)=>{
			quantityData.push({iProcessId:key, count:x.get('count')});
		});
	}
	render() {
		const {quantityMap,total} = this.props;
		let quantityData = [];
		if(quantityMap.map) {
			this.getViewData(quantityMap,quantityData);
		}
		//sort array
		quantityData.sort((a,b)=> (b.count - a.count));

		const CustomizedAxisTick = React.createClass({
			render () {
				const {x, y, stroke, payload} = this.props;
				
				return (
					<g transform={`translate(${x},${y})`}>
						<text x={0} y={0} dy={16} textAnchor="end" fill="#666" 
							transform="rotate(-90)">{payload.value}</text>
					</g>
				);
			}
		});
		const CustomizedLabel = React.createClass({
			render () {
				const {x, y, stroke, value, width} = this.props;
				return <text x={x+width/2} y={y+10} dy={-0} fill={stroke} fontSize={10} textAnchor="middle">{(value/total*100).toFixed(2)}%</text>;
			}
		});

		return (
		<div name="customX" style={styles.outerDiv} className={quantityData.length>0 ? '':'hiddenCompletely'}>
			<h1>Summaries</h1>
			<div style={styles.unitDiv}>
				x : iProcessId 
				<br/>
				y :	amount	
			</div>
			<ResponsiveContainer>
				<BarChart	data={quantityData}
						padding={{bottom:100}}
						margin={{top: 5, right: 30, left: 20, bottom: 5}}>
					<XAxis interval={0} dataKey="iProcessId" tick={<CustomizedAxisTick/>}/>
					<YAxis/>
					<CartesianGrid strokeDasharray="3 3"/>
					<Tooltip/>
					<Bar dataKey="count" fill="#8884d8" label={<CustomizedLabel/>}/>
				</BarChart>
			</ResponsiveContainer>
		</div>
		);

	}
}
const styles = {
	outerDiv:{
		height:400,
		marginBottom:210
	},	
	unitDiv:{
		float:'left',
		paddingLeft:50,
		textAlign:'left'
	},
};

