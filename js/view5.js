(function($){
	
	(function(){
		
		
		
		function View5(Observer){
			var view5={};
			var datachoosed;
			var initLayout = function() {
				$('#date').DatePicker({
					flat: true,
					format: 'Y/m/d',
					date:  ['2015/07/22','2015/09/12'],
					current: '2015/07/22',
					calendars: 1,
					starts: 0,
					onChange: function(formated, dates){
						console.log(formated);
						datachoosed=formated;
						Observer.fireEvent("calendar",datachoosed, "view5");
						//console.log(dates);
					}
				});
			}
			EYE.register(initLayout, 'init');
			
			view5.onMessage = function(message, data, from){}
			Observer.addView(view5);
			return view5;
			
		}
		window["View5"] = View5;
	})()
	
	
	
})(jQuery)

