const regexRules ={
	NODE_TYPE:"wmb:nodeType=\"([^\"]+)\"",
	CREATION_TIME:"wmb:creationTime=\"([^\"]+)\"",
	NODE_LABEL:"wmb:nodeLabel=\"([^\"]+)\"",
	HEADER:"(<header>.+</header>)",
	RESPONSE_CODE:"<responseCode>(\\d{3})</responseCode>",
	I_PROCESS_ID:"<iProcessId>([A-Z0-9-]+)</iProcessId>",
	MSG_SEQ_NO:"<msgSeqNo>([A-Z0-9]+)</msgSeqNo>"
};

export const isMatchStr = (str, rules)=> {
	let isMatch = false;	
	for(var k in rules) {
		isMatch = new RegExp("^" + rules[k].split("*").join(".*") + "$").test(str);		
		if(isMatch)
			break;
	}
	return isMatch;
};

export const getMsgSeqNo = (str)=> {
	const result = str.match(regexRules.MSG_SEQ_NO);
	return result?result[1]:null;
};

export const getHeader= (str)=> {
	const result = str.match(regexRules.HEADER);
	return result?result[0]:null;
};
export const getIProcessId = (str)=> {
	const result = str.match(regexRules.I_PROCESS_ID);
	return result?result[1]:null;
};

export const getResponseCode = (str)=> {
	const result = str.match(regexRules.RESPONSE_CODE);
	return result?result[1]:null;
};

export const getCreationTime = (str)=> {
	const result = str.match(regexRules.CREATION_TIME);
	return result?result[1]:null;
};

export const getNodeLabel = (str)=> {
	const result = str.match(regexRules.NODE_LABEL);
	return result?result[1]:null;
};

export const getNodeType= (str)=> {
	const result = str.match(regexRules.NODE_TYPE);
	return result?result[1]:null;
};
/*
			MESSAGE("(<Root>.+</Root>)", null),
	        JSON("(<JSON><Data>.+</Data></JSON>)", MESSAGE),
	        RESPONSE("<body>.*(<response>.+</response>).*</body>", JSON),
	        RESPONSE_CODE("<responseCode>(\\d{3})</responseCode>", RESPONSE),
	        RESPONSE_MSG("<responseMsg>(.+)</responseMsg>", RESPONSE),
	        HEADER("(<header>.+</header>)", JSON),
	        ACTOR("<actor>([A-Z]+)</actor>", HEADER),
	        I_PROCESS_ID("<iProcessId>([A-Z0-9\\-]+)</iProcessId>", HEADER),
	        SOURCE_I_PROCESS_ID("<sourceIProcessId>([A-Z0-9\\-]+)</sourceIProcessId>", HEADER),
	        E_MESSAGE_ID("<eMessageId>([A-Z0-9\\-]+)</eMessageId>", HEADER),
	        MSG_SEQ_NO("<msgSeqNo>([A-Z0-9]+)</msgSeqNo>", HEADER),
	        CREATION_TIME("wmb:creationTime=\"([^\"]+)\"", null),
	        FLOW_NAME("wmb:uniqueFlowName=\"([^\"]+)\"", null),
	        EVENT_NAME("wmb:eventName=\"([^\"]+)\"", null),
	        NODE_LABEL("wmb:nodeLabel=\"([^\"]+)\"", null),
	        JMS_CONTENT("(<JMSTransport>.+</JMSTransport>)", MESSAGE),
	        JMS_CORRELATION_ID("<JMSCorrelationID>([a-zA-Z0-9:]+)</JMSCorrelationID>", JMS_CONTENT),
	        JMS_MESSAGE_ID("<JMSMessageID>([a-zA-Z0-9:]+)</JMSMessageID>", JMS_CONTENT),
	        EXCEPTION_LIST("(<ExceptionList>.+</ExceptionList>)", null);
*/


