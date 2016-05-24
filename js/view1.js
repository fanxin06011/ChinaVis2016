(function(){
	
	
	
	function View1(Observer){
		var view1={};
		var width=$("div#view1").width();
		var height=$("div#view1").height();

		


		
		setTimeout(function(){
			Observer.fireEvent("addip", [1,29736,4,5], "view2");
			
		},9000); 
	    setTimeout(function(){
			Observer.fireEvent("addip", [1,2], "view2");
			
		},11000); 
	  
	  
		
	
		

		view1.onMessage = function(message, data, from){
			if(message == "aaa"){
				if(from == "view2"){

				}
			}

		}
		Observer.addView(view1);
		return view1;
		
	}
	window["View1"] = View1;
})()