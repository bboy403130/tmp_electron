import React from 'react';
import { shallow} from 'enzyme';
import Analysis from '../src/components/Analysis';
import FileDropzone from '../src/components/FileDropzone';
import Quantity from '../src/components/Quantity';
import QuantityChart from '../src/components/QuantityChart';
import QuantityTimeChart from '../src/components/QuantityTimeChart';
import QuantityCodeChart from '../src/components/QuantityCodeChart';
import AnalysisIProcessId from '../src/components/AnalysisIProcessId';
import { fromJS } from 'immutable';

function setup() {
	const enzymeWrapper = shallow(<Analysis	/>);
	
	return {
		enzymeWrapper
	};
}
describe('component of Analysis', () => {
	describe('Analysis', () => {
		it('should render self and subcomponents', () => {
			const state = {
				files:[{name:"Transaction-log4j.log",size:"5566"}],
				total:30,
				iProcessIdGroup:fromJS({'IP-UW-000001':{count:30}}),
				timeGroup:fromJS({}),
				responseCodeGroup:fromJS({})
			};
			const { enzymeWrapper } = setup();
			enzymeWrapper.setState(state);
			const AnalysisHTML = enzymeWrapper.html();
			//FileDropzone descrition
			expect(AnalysisHTML.includes("Try dropping transaction.log here, or click to select it to upload")).toBe(true);
			//Dropped file size
			expect(AnalysisHTML.includes("Transaction-log4j.log - 5566 bytes")).toBe(true);
			//Summaries title
			expect(AnalysisHTML.includes("Summaries")).toBe(true);
			//Quantity component
			//expect(enzymeWrapper.find(Quantity)).to.have.length(1);
			//QuantityChart component
			//expect(enzymeWrapper.find(QuantityChart)).to.have.length(1);
			//QuantityTimeChart component
			//QuantityCodeChart component
			
		});

	});
});

