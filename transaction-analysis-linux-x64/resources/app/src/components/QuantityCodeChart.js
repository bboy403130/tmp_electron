import React from 'react';
import {Tooltip, ResponsiveContainer, PieChart, Pie, Sector, Cell } from 'Recharts';

export default class QuantityCodeChart extends React.Component {
	constructor() {
		super();
	}

	getViewData(quantityMap,quantityData) {
		quantityMap.map((x,key)=>{
			quantityData.push({responseCode:key, count:x.get('count')});
		});
	}

	render() {
		const {quantityMap} = this.props;
		let quantityData = [];
		if(quantityMap.map) {
			this.getViewData(quantityMap,quantityData);
		}
		quantityData.sort((a,b) => (parseInt(a.responseCode) - parseInt(b.responseCode)));
		const COLORS = {
			"200":"#00C49F",
			"301":"#D9BFD8",
			"501":"#0088FE",
			"502":"#FFBB28",
			"503":"#FF8042",
			"505":"#00FF7F",
			"506":"#4682b4",
			"598":"#D2B48C",
			"599":"#008080"
		}; 
		const RADIAN = Math.PI / 180;										
		const renderCustomizedLabel = (o) => {
			const { name, cx, cy, midAngle, innerRadius, outerRadius, percent, index } = o;
			const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
			const x	= cx + radius * Math.cos(-midAngle * RADIAN);
			const y = cy	+ radius * Math.sin(-midAngle * RADIAN);
			return (
						<text x={x} y={y} fill="black" 	dominantBaseline="central">
				{percent>0.05?(percent * 100).toFixed(2)+'% (' +name+')':''}
						</text>
			);
		};

		return (
		<div style={styles.outerDiv} className={quantityData.length>0 ? '':'hiddenCompletely'}>
			<div key={'pieChart'} style={styles.pieChart}>
				<PieChart	
						width={600}
						height={400}
						padding={{bottom:100}}
						margin={{top: 5, right: 30, left: 20, bottom: 5}}>
					<Pie
						data={quantityData} 
						nameKey='responseCode'
						dataKey='count'
						cx={400} 
						cy={200} 
						labelLine={false}
						label={renderCustomizedLabel}
						outerRadius={150} 
						fill="#8884d8">
						{
							quantityData.map((entry, index) => <Cell key={index} fill={COLORS[entry.responseCode]}/>)
						}
					</Pie>	
					<Tooltip/>
				</PieChart>
			</div>
			<div key={'dashboard'} style={styles.dashboard} >
			<div style={styles.unitDiv}>
				(responseCode) : amount 
			</div>
			<br/>
			{
				quantityData.map((entry, index) => {
					let css = Object.assign({}, styles.spanColor);
					css.backgroundColor = COLORS[entry.responseCode];
					return (<div key={index} style={styles.dashboard_row}><div style={css}></div>{'  ('+ entry.responseCode + ') : '+ entry.count }</div>);

				})
			}
			</div>


		</div>
		);

	}
}
const styles = {
	outerDiv:{
		height:400,
		marginBottom:50,
		marginTop:50
	},
	pieChart:{
		float:'left',
		display:'inline-block'
	},
	dashboard:{
		marginTop:50,
		float:'left',
		display:'inline-block'
	},
	spanColor:{
		display:'inline-block',
		width:20,
		height:20,
		marginBottom:-4
	},
	dashboard_row:{
		margin:5,
		float:'left'
	},
	unitDiv:{
		float:'left',
		textAlign:'left'
	}

};

