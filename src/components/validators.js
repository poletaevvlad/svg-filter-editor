module.exports = (()=>{
	const INVALID = 0;
	const VALID = 1;
	const MAY_BE_VALID = 2;

	return {
		INVALID: INVALID,
		VALID: VALID,
		MAY_BE_VALID: MAY_BE_VALID,

		isNumber: (n) => {
			if (n.length == 0){
				return MAY_BE_VALID;
			}
			let separatorFound = false;
			let i = 0;
			if (n[0] == "-"){
				i++;
			}

			if (i == n.length){
				return MAY_BE_VALID;
			}
			for (; i < n.length; i++){
				if (n[i] == "-"){
					return INVALID;
				}else if (n[i] == '.' || n[i] == ","){
					if (separatorFound){
						return INVALID;
					}else{
						separatorFound = true;
					}
				}else if ("0123456789".indexOf(n[i]) < 0){
					return INVALID;
				}
			}
			return VALID;
		}
	}
})();