import React, {Component} from 'react';
import QuantityTimeChart from './QuantityTimeChart';
import QuantityCodeChart from './QuantityCodeChart';
import ResponseTimeChart from './ResponseTimeChart';
import { getMsgSeqNo, getIProcessId, getResponseCode, getCreationTime, getHeader,
	isMatchStr } from '../utils/ParserUtil';
import { isRequestRecord, isResponseRecord, isRecordByIProcessId} from '../utils/BrokerUtil';
import { fromJS } from 'immutable';
import fs from 'fs';
import readline from 'readline';
import moment from 'moment';

export default class AnalysisIProcessId extends Component {
	constructor() {
		super();
		this.parsedData = {
			total:0,
			timeGroup:fromJS({}),
			resGroup:fromJS({}),
			reqGroup:fromJS({}),
			responseCodeGroup:fromJS({})
		};
		this.state = {
			isParsed:false,
			iProcessId:'',
			files:[],
			total:0,
			timeGroup:fromJS({}),
			msgSeqNoGroup:fromJS({}),
			responseCodeGroup:fromJS({})
		};
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
	runReqGroup(line) {
		const creationTime = getCreationTime(line);
		const msgSeqNo = getMsgSeqNo(line);
		this.parsedData.reqGroup = this.parsedData.reqGroup.setIn([msgSeqNo],{type:"RQ",creationTime:creationTime});	
	}
	runResGroup(line) {
		const creationTime = getCreationTime(line);
		const msgSeqNo = getMsgSeqNo(line);
		this.parsedData.resGroup = this.parsedData.resGroup.setIn([msgSeqNo],{type:"RS",creationTime:creationTime});	
	}
	parseLogByIProcessId(files,iProcessId) {
		const {blockView} = this.props;
		blockView(true);
		if(!this.state.isParsed) {
			for(var k in files) {
				const filePath = files[k].path;
				const inputStream = fs.createReadStream(filePath);
				const lineReader = readline.createInterface({input: inputStream });
				lineReader.on('line', (line)=>{
					const xmlLine = line.substring(line.indexOf("<"),line.length);
					const header = getHeader(xmlLine);
					if(header) {
						if(isRecordByIProcessId(header, iProcessId)) {
							if(isRequestRecord(line)) {
								this.runTimeGroup(xmlLine);
								this.runReqGroup(xmlLine);
								this.parsedData.total = this.parsedData.total + 1;
							}else if(isResponseRecord(line)) {
								this.runResponseCodeGroup(xmlLine);
								this.runResGroup(xmlLine);
							}							
						}
					}


				});
				lineReader.on('close',()=>{
				//refresh data until file has been parsed.
					const {total, responseCodeGroup, reqGroup, resGroup} = this.parsedData;	
					//add time gap between startTime and endTime
					this.addTimeGap("min","count")
						.addTimeGap("hour","count")
						.addTimeGap("day","count");
					//compute responseTime
					const pattern = "YYYYMMDD HH:mm:ss.SSS";
					let msgSeqNoGroup = fromJS({}); 
					reqGroup.map((req,msgSeqNo)=>{
						const res = resGroup.get(msgSeqNo);
						if(res) {
							const reqTime = req.creationTime;
							const resTime = res.creationTime;
							const duration = moment(resTime,pattern).diff(moment(reqTime,pattern));
							msgSeqNoGroup = msgSeqNoGroup.set(msgSeqNo,{reqTime:reqTime,resTime:resTime,duration:duration});
						}
					});
					//refresh state for Chart
					this.setState({
						isParsed:true,
						iProcessId:iProcessId,
						total:total,
						timeGroup:this.parsedData.timeGroup,
						msgSeqNoGroup:msgSeqNoGroup,
						responseCodeGroup:responseCodeGroup
					});

					blockView(false);
				});
			}

		}
		
	}
	render() {
		console.log("AnalysisIProcessId state",this.state);
		const {iProcessId, total, timeGroup, responseCodeGroup, msgSeqNoGroup} = this.state;
		return (
		<div style={styles.outerDiv}>
			<h1>{iProcessId}</h1>
			<ResponseTimeChart msgSeqNoMap={msgSeqNoGroup}/>
			<QuantityTimeChart total={total} quantityMap={timeGroup}/>
			<QuantityCodeChart quantityMap={responseCodeGroup}/>
		</div>);
	}
}

const styles = {
	outerDiv:{
		textAlign:'center',
		display:'inline-block',
		width:'100%'
	}	
};
	
