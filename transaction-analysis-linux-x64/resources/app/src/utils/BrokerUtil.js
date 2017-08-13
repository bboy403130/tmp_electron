import { getNodeLabel, getNodeType, isMatchStr, getIProcessId } from './ParserUtil';

export const isRequestRecord = (line)=> {
	if (isMatchStr(getNodeLabel(line),['CL.IN.EB*REQ*']) && getNodeType(line) == "ComIbmJMSClientInputNode")
		return true;
	else
		return isMatchStr(getNodeLabel(line),['CL.EX.EB.PUB*']) && getNodeType(line) == "ComIbmJMSClientInputNode";
	
};
export const isResponseRecord = (line)=> {
	if (isMatchStr(getNodeLabel(line),['*CL.IN.EB*RES*']) && getNodeType(line) == "ComIbmJMSClientOutputNode")
		return true;
	else
		return isMatchStr(getNodeLabel(line),['CL.EX.EB.PUB*']) && getNodeType(line) == "ComIbmJMSClientOutputNode";
};
export const isRecordByIProcessId = (header,iProcessId)=> {
	return isMatchStr(getIProcessId(header),[iProcessId]);
};
