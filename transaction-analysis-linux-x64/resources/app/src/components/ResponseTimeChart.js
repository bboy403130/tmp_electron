import React from 'react';
import {ResponsiveContainer,LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend} from 'Recharts';

export default class ResponseTimeChart extends React.Component {
	constructor() {
		super();
	}
	setUnit(unit) {
		this.setState({unit:unit});
	}
	getViewData(msgSeqNoMap,msgSeqNoData) {
		if(msgSeqNoMap) {
			msgSeqNoMap.map((x,key)=>{
				msgSeqNoData.push({msgSeqNo:key,reqTime:x.reqTime,duration:(x.duration/1000)});
			});
		}
	}
	render() {
		const {msgSeqNoMap,total} = this.props;
		let msgSeqNoData = [];
		if(msgSeqNoMap.map) {
			this.getViewData(msgSeqNoMap,msgSeqNoData);
		}
		msgSeqNoData.sort((a,b) => (a.reqTime > b.reqTime) - (a.reqTime < b.reqTime));

		const CustomizedAxisTick = React.createClass({
			render () {
				const {x, y, stroke, payload} = this.props;
				
				return (
					<g transform={`translate(${x},${y})`}>
						<text x={0} y={0} dy={16} textAnchor="end" fill="#666" 
							transform="rotate(-90)">{payload.value.slice(9)}</text>
					</g>
				);
			}
		});
		const CustomTooltip	= React.createClass({
			render() {
				const { active } = this.props;

				if (active) {
					const { payload, label } = this.props;
					return (
						<div style={styles.customTooltip}>
							<p>{label}</p>
							<p style={styles.tooltipFont}>{payload[0].payload.msgSeqNo}</p>
							<p style={styles.tooltipFont}>responsetime:{payload[0].value}s</p>
						</div>
					);
				}

				return null;
			}
		});
		return (
		<div name="customX" style={styles.outerDiv} className={msgSeqNoData.length>0 ? '':'hiddenCompletely'}>
			<div style={styles.unitDiv}>
				x : datetime
				<br/>
				y : responsetime (sec)
			</div>
			<ResponsiveContainer>
				<LineChart	data={msgSeqNoData}
						padding={{bottom:100}}
						margin={{top: 5, right: 30, left: 20, bottom: 5}}>
					<XAxis interval={'preserveStart'} dataKey="reqTime" tick={<CustomizedAxisTick/>} />
					<YAxis/>
					<CartesianGrid strokeDasharray="3 3"/>
					<Tooltip content={<CustomTooltip/>}/>
					<Line dataKey="duration" fill="#8884d8" />
				</LineChart>
			</ResponsiveContainer>
		</div>
		);
	}
}
const styles = {
	outerDiv:{
		height:400,
		marginBottom:150
	},
	btnStyle:{
		marginLeft:15
	},
	unitDiv:{
		float:'left',
		paddingLeft:50,
		textAlign:'left'
	},
	btnDiv:{
		display:'inline-block'
	},
	customTooltip:{
		margin: 0,
		padding: 10,
		backgroundColor: 'rgb(255, 255, 255)',
		border: '1px solid rgb(204, 204, 204)',
		whiteSpace:'nowrap'
	},
	tooltipFont:{
		color:'blue'
	}
};


