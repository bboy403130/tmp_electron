import React from 'react';
import { shallow} from 'enzyme';
import FileDropzone from '../src/components/FileDropzone';

function setup() {
	const state = {
		files:[{name:"Transaction-log4j.log",size:"5566"}],
		iProcessIdGroup:{},
		timeGroup:{}
	};
	const enzymeWrapper = shallow(<FileDropzone files={state.files}	/>);
	
	return {
		enzymeWrapper
	};
}
describe('component of FileDropzone', () => {
	describe('FileDropzone', () => {
		it('should render self and subcomponents', () => {
			const { enzymeWrapper } = setup();
			expect(enzymeWrapper.html().includes("Transaction-log4j.log - 5566 bytes")).toBe(true);
			
		});

	});
});

