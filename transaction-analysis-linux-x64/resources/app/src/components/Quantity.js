import React from 'react';
import { fromJS } from 'immutable';
import BlockUi from 'react-block-ui';
export default class Quantity extends React.Component {
	constructor() {
		super();
		this.blockView = this.blockView.bind(this);
		this.state = { 
			iProcessIdGroup:fromJS({}),
			blocking:false,
			total:0
		};
	}
	
	componentDidUpdate() {
	}
	blockView(blocking) {
		if(!blocking)
			setTimeout(()=>this.setState({blocking:blocking}),2000);				
		else
			this.setState({blocking:blocking});
	}
	
	getViewData(quantityMap,quantityData) {
		quantityMap.map((x,key)=>{
			quantityData.push({iProcessId:key, count:x.get('count'), flag:x.get('flag')?x.get('flag'):false});
		});
	}
	refreshQuantity(total,iProcessIdGroup) { 
		this.setState({
			total:total,
			iProcessIdGroup:iProcessIdGroup
		});
	}
	pressedButton(iProcessId) {
		const {iProcessIdGroup} = this.state;
		const {onSelectedIProcessId} = this.props;
		let pressedGroup;
		let isPressed = iProcessIdGroup.getIn([iProcessId,'flag']);
		if(isPressed) {
			pressedGroup = iProcessIdGroup.updateIn([iProcessId,'flag'],()=>false);	
			this.blockView(false);
		}
		else {
			pressedGroup = iProcessIdGroup.updateIn([iProcessId,'flag'],()=>true);	
			this.blockView(true);
		}
		//update pressed flag 
		this.setState({
			iProcessIdGroup : pressedGroup
		});
		onSelectedIProcessId(pressedGroup,iProcessId);
	}
	setAllButton(setValue) {
		const {iProcessIdGroup} = this.state;
		const {onSelectedIProcessId} = this.props;
		let iProcessIdsPlainObj = iProcessIdGroup.toJS();
		let isNeedBlock = false;
		iProcessIdGroup.map((x,key)=>{
			isNeedBlock = x.get('flag')?false:true;
			iProcessIdsPlainObj[key].flag = setValue;
		});
		const pressedGroup = fromJS(iProcessIdsPlainObj);	
		//update pressed flag to true
		this.setState({
			iProcessIdGroup : pressedGroup
		});
		this.blockView(isNeedBlock);
		onSelectedIProcessId(pressedGroup,"ALL");
	}
	render() {
		const {total,iProcessIdGroup} = this.state;
		let quantityData = [];
		if(iProcessIdGroup.map) {
			this.getViewData(iProcessIdGroup,quantityData);
		}
		//sort array by iProcessId
		quantityData.sort((a,b)=> (a.iProcessId.localeCompare(b.iProcessId)));
		//sort array by count
		//quantityData.sort((a,b)=> (b.count - a.count));
		
		return (
			<div className={total > 0 ? '':'hiddenCompletely'}>
			<BlockUi tag="div" blocking={this.state.blocking}>
				<div style={styles.divRow} >
					<div style={styles.padding5}>Total:{total}
						<button style={{marginLeft:20}} onClick={()=>this.setAllButton(true)} >Select All </button>
						<button style={{marginLeft:20}} onClick={()=>this.setAllButton(false)} >Unselect All </button>
					</div>
					{
						quantityData.map((x,key)=>{
							return(	
								<div key={key} style={styles.divEle}>
									<button onClick={()=>this.pressedButton(x.iProcessId)} style={x.flag?styles.pressedColor:{}} > {x.iProcessId+':'+x.count}</button>
								</div>
							);})
					}
					<br/>
				</div>
			</BlockUi>
			</div>
		);
	}
}

const styles = {
	divEle:{
		display: 'inline-block',
		width: 150
	},
	divRow:{
		textAlign:'left',
		width: 1200,
		display: 'inline-block',
		marginBottom: 20
	},
	padding5:{
		padding:5
	},
	pressedColor:{
		color:'blue'
	}

};

