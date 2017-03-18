module.exports = {
	isNumber: (n) => {
		if (n.length == 0){
			return false;
		}
		let separatorFound = false;
		let i = 0;
		if (n[0] == "-"){
			i++;
		}

		for (; i < n.length; i++){
			if (n[i] == "-"){
				return false;
			}else if (n[i] == '.' || n[i] == ","){
				if (separatorFound){
					return false;
				}else{
					separatorFound = true;
				}
			}else if ("0123456789".indexOf(n[i]) < 0){
				return false;
			}
		}
		return true;
	}
}