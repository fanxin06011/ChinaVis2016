(
function(){
	function Observer(){
		var observer={};
		
		observer.print=function(ms){
			console.log(ms);
		}
		var viewList = [];
		observer.addView=function(view){
			viewList.push(view);
		}
		observer.fireEvent=function(message, data ,from){

			viewList.forEach(function(view){
				view.onMessage(message, data, from);
			})


		}
		return observer;
	}
	window["Observer"] = Observer;
}

)()