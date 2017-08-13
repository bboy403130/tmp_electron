import React, {Component} from 'react';
import FileDropzone from './FileDropzone';
import Quantity from './Quantity';
import QuantityChart from './QuantityChart';
import QuantityTimeChart from './QuantityTimeChart';
import QuantityCodeChart from './QuantityCodeChart';
import AnalysisIProcessId from './AnalysisIProcessId';
import { getResponseCode, getCreationTime } from '../utils/ParserUtil';
import { isRequestRecord, isResponseRecord} from '../utils/BrokerUtil';
import BlockUi from 'react-block-ui';
import { JSDOM } from 'jsdom';
import { fromJS } from 'immutable';
import fs from 'fs';
import readline from 'readline';
import moment from 'moment';

export default class Analysis extends Component {
	constructor() {
		super();
		this.getFiles = this.getFiles.bind(this);
		this.onSelectedIProcessId = this.onSelectedIProcessId.bind(this);
		this.parsedData = {
			total:0,
			iProcessIdGroup:fromJS({}),
			timeGroup:fromJS({}),
			responseCodeGroup:fromJS({})
		};
		this.state = {
			files:[],
			total:0,
			iProcessIdGroup:fromJS({}),
			timeGroup:fromJS({}),
			responseCodeGroup:fromJS({})
		};
	}
	getFiles(files) {
		let filesAry = this.state.files.concat(files);
		this.setState({files:filesAry});
		this.parseLog(files);
	}
	_CreationTimeClassify(unit,timeValue,key) {
		const creationTimeMap = this.parsedData.timeGroup.get(unit);
		const count = creationTimeMap != null ? creationTimeMap.getIn([timeValue,key]):false;
		if(count) {
			this.parsedData.timeGroup = this.parsedData.timeGroup.updateIn([unit,timeValue,key],v=>v+1);	
		}
		else {
			this.parsedData.timeGroup = this.parsedData.timeGroup.setIn([unit,timeValue,key],1);	
		}
	}
	runTimeGroup(line) {
		const creationTime = getCreationTime(line);
		if(creationTime) {
			this._CreationTimeClassify('min',creationTime.substring(0,14),'count');	
			this._CreationTimeClassify('hour',creationTime.substring(0,11),'count');	
			this._CreationTimeClassify('day',creationTime.substring(0,8),'count');	
		}

	}
	_ResponseCodeClassify(responseCodeValue,key) {
		const responseCodeMap = this.parsedData.responseCodeGroup.get(responseCodeValue);
		const count = responseCodeMap != null ? responseCodeMap.get(key):false;
		if(count) {
			this.parsedData.responseCodeGroup = this.parsedData.responseCodeGroup.updateIn([responseCodeValue,key],v=>v+1);	
		}
		else {
			this.parsedData.responseCodeGroup = this.parsedData.responseCodeGroup.setIn([responseCodeValue,key],1);	
		}
	}
	runResponseCodeGroup(line) {
		const responseCode = getResponseCode(line);
		if(responseCode) {
			this._ResponseCodeClassify(responseCode,'count');
		}
	}
	runIProcessIdGroup(dom) {
		const iProcessIdDom = dom.window.document.querySelector("iProcessId");
		const iProcessId = iProcessIdDom ? iProcessIdDom.textContent:'Others';	
		const iProcessIdMap = this.parsedData.iProcessIdGroup.get(iProcessId);		
		const count = iProcessIdMap != null ? iProcessIdMap.get('count'):false;
		if(count) {
			this.parsedData.iProcessIdGroup = this.parsedData.iProcessIdGroup.updateIn([iProcessId,'count'],v=>v+1);
		}
		else {
			this.parsedData.iProcessIdGroup = this.parsedData.iProcessIdGroup.setIn([iProcessId,'count'],1);
		}
		this.parsedData.total = this.parsedData.total + 1;

	}
	addTimeGap(unit,key) {
		let unitFullName = "minutes";
		let pattern = "YYYYMMDD HH:mm";
		if("min" == unit) {
			unitFullName = "minutes";
			pattern = "YYYYMMDD HH:mm";
		}else if("hour" == unit) {
			unitFullName = "hours";
			pattern = "YYYYMMDD HH";
		}else if("day" == unit) {
			unitFullName = "days";
			pattern = "YYYYMMDD";
		}
		if(this.parsedData.timeGroup.get(unit)) {
			const keys = Object.keys(this.parsedData.timeGroup.get(unit).toJS()).sort();
			const startTime = moment(keys[0],pattern);
			const endTime = moment(keys[keys.length-1],pattern);
			for(let sTime = startTime.format(pattern); sTime < endTime.format(pattern);sTime = moment(sTime,pattern).add(1,unitFullName).format(pattern)) {
				const count = this.parsedData.timeGroup != null ? this.parsedData.timeGroup.getIn([unit,sTime,key]):false;
				if(!count) {
					this.parsedData.timeGroup = this.parsedData.timeGroup.setIn([unit,sTime,key],0);	
				}

			}
		}
		return this;
	}
	parseLog(files) {
		this.refs.quantity.blockView(true);
		for(var k in files) {
			const filePath = files[k].path;
			//const filePath = '/Users/tony/Desktop/Transaction-log4j.log';
			const inputStream = fs.createReadStream(filePath);
			const lineReader = readline.createInterface({input: inputStream });
			lineReader.on('line', (line)=>{
				const xmlLine = line.substring(line.indexOf("<"),line.length);
				if(isRequestRecord(line)) {
					this.runTimeGroup(xmlLine);
					const dom = new JSDOM(xmlLine);
					this.runIProcessIdGroup(dom);
					//refresh quantity every line
					this.refs.quantity.refreshQuantity(this.parsedData.total,this.parsedData.iProcessIdGroup); 

				}else if(isResponseRecord(line)) {
					this.runResponseCodeGroup(xmlLine);
				}


			});
			lineReader.on('close',()=>{
			//refresh data until file has been parsed.
				
				//add time gap between startTime and endTime
				this.addTimeGap("min","count")
				.addTimeGap("hour","count")
				.addTimeGap("day","count");

				//sort iprocessId
				this.refs.quantity.refreshQuantity(this.parsedData.total,this.parsedData.iProcessIdGroup); 

				//refresh state for Chart
				this.setState({
					total:this.parsedData.total,
					iProcessIdGroup:this.parsedData.iProcessIdGroup,
					timeGroup:this.parsedData.timeGroup,
					responseCodeGroup:this.parsedData.responseCodeGroup
				});
				this.refs.quantity.blockView(false);
			});
		}
		
	}
	onSelectedIProcessId(iProcessIdGroup,iProcessId) {
		console.log(iProcessIdGroup,iProcessId);
		this.setState({
			iProcessIdGroup:iProcessIdGroup
		});
		
	}
	componentDidUpdate() {
		this.state.iProcessIdGroup.map((a,iProcessId)=>{
			if(a.get('flag')) {
				this.refs['analysisIProcessId'+iProcessId].parseLogByIProcessId(this.state.files,iProcessId);	
	
			}
		});	

	}
	render() {
		console.log("Analysis state",this.state,this.refs);
		const{files, total, iProcessIdGroup, timeGroup, responseCodeGroup} = this.state;
		let selectedIProcessIdArray = [];
		iProcessIdGroup.map((x,key)=>{
			if(x.get('flag'))
				selectedIProcessIdArray.push({iProcessId:key});	
		});
		return (
		<div style={styles.outerDiv}>
			<BlockUi tag="div" blocking={this.state.blocking}>
				<FileDropzone getFiles={this.getFiles} files={files}/>		
				<div className="breakPage"/>
				<Quantity ref="quantity" onSelectedIProcessId={this.onSelectedIProcessId}/>
			
			</BlockUi>
				<QuantityChart total={total} quantityMap={iProcessIdGroup}/>
				<QuantityTimeChart total={total} quantityMap={timeGroup}/>
				<QuantityCodeChart quantityMap={responseCodeGroup}/>

				{
					selectedIProcessIdArray.map((x)=>{
						return(
							<div key={x.iProcessId}>
								<div className="breakPage"/>
								<AnalysisIProcessId  ref={"analysisIProcessId"+x.iProcessId} blockView={this.refs.quantity.blockView} files={files}/>	
							</div>
						);})
				}
		</div>);
	}
}

const styles = {
	outerDiv:{
		textAlign:'center',
		display:'inline-block'	
	},	
	unitDiv:{
		float:'left',
		paddingLeft:50
	}
};
	
