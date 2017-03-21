module.exports = (()=>{
	const INVALID = 0;
	const VALID = 1;
	const MAY_BE_VALID = 2;

	return {
		INVALID: INVALID,
		VALID: VALID,
		MAY_BE_VALID: MAY_BE_VALID,

		isNumber: n => {
			if (n.length == 0 || n == "." || n == ","){
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
		},

		isPositiveNumber: n => {
			if (n.length == 0 || n == "," || n == "."){
				return MAY_BE_VALID;
			}
			let separatorFound = false;
			for (let i = 0; i < n.length; i++){
				if (n[i] == '.' || n[i] == ","){
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
		},

		isNumber01: n => {
			if (n.length == 0 || n == "," || n == "."){
				return MAY_BE_VALID;
			}
			let i = 0;
			while (i < n.length && n[i] == '0'){
				i++
			}
			if (i == n.length){
				return VALID;
			}else if (n[i] == "." || n[i] == ","){
				i++;
				for (; i < n.length; i++){
					if ("0123456789".indexOf(n[i]) < 0){
						return INVALID
					}
				}
				return VALID;
			}else{
				return INVALID;
			}

		},

		isColorComponent: n => {
			if(n.length == 0){
				return MAY_BE_VALID;
			}
			for (let i = 0; i < n.length; i++){
				if ("0123456789".indexOf(n[i]) < 0){
					return INVALID;
				}
			}
			let number = parseInt(n);
			if (n < 0 || n > 255){
				return MAY_BE_VALID;
			}
			return VALID;
		},

		isColorHex: n => {
			if (n.length == 0){
				return MAY_BE_VALID;
			}
			let i = 0;
			if (n[0] == "#"){
				i++;
			}
			for (; i < n.length; i++){
				if ("0123456789ABCDEFabcdef".indexOf(n[i]) < 0){
					return INVALID;
				}
			}
			if ((n[0] == "#" && (n.length == 4 || n.length == 7)) || (n[0] != "#" && (n.length == 3 || n.length == 6))){
				return VALID;
			}
			return MAY_BE_VALID;
		}
	}
})();