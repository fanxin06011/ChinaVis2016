(function(){
	function View4(Observer){
		var view4={};
		var width=$("div#view4").width();
		var height=$("div#view4").height();
		var pix = d3.min([Math.floor((width)/24), Math.floor(height/53)]);
		var show_m;
		console.log(pix);
		var svg4 = d3.select("div#view4")
			.append("svg")
			.attr("height",53*pix+10)
			.attr("width",24*pix+10)
			.attr("class","m");
		for(var i=0;i<24;i++){
			svg4.append("text")
				.attr("x",i*pix)
				.attr("y",10)
				.attr("class","view4text")
				.attr("transform","translate(10,-1)")
				.text(i);
		}
		for(var j=1;j<54;j++){
			svg4.append("text")
				.attr("x",0)
				.attr("y",(j-1)*pix)
				.attr("class","view4text")
				.attr("transform","translate(0,15)")
				.text(j);
		}
		//初始化矩阵视图
		for(var i=0;i<24;i++){
			//console.log(i);
			for(var j=1;j<54;j++){
				//console.log(j);
				svg4.append("rect")
					.attr("x",i*pix)
					.attr("y",(j-1)*pix)
					.attr("width",pix-1)
					.attr("height",pix-1)
					.attr("class","h"+i+"d"+j)
					.attr("fill","white")
					.attr("transform","translate(10,10)");
			}
		}

		function redraw_m(){
			var mScale = d3.scale.linear()
				.domain([0,d3.max(show_m,function(d,i){return d3.max(d);})])
				.range([0,1]);
			for(var j=1;j<53;j++){
				for(var i=0;i<24;i++){
					svg4.selectAll(".h"+i+"d"+j)
						.attr("fill",function(d){
							return "rgba(255,0,0,"+mScale(show_m[j-1][i])+")";
						});
				}
			}
		}


			//Observer.fireEvent("addip", [1,29736,4,5], "view2");


		view4.onMessage = function(message, data, from){
			if(message == "VCI1"){
				if(from == "view1"){
					d3.text("data/view4/VCI1/v"+data+".csv",function(d){
						show_m = d3.csv.parseRows(d);
						redraw_m();
					});
				}
			}else if(message == "VPI1"){
				if(from == "view1"){
					d3.text("data/view4/VPI1/v"+data+".csv",function(d){
						show_m = d3.csv.parseRows(d);
						redraw_m();
					});
				}
			}

		};
		Observer.addView(view4);
		return view4;

	}
	window["View4"] = View4;
})()