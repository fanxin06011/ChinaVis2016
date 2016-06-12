(function(){
	function View4(Observer){
		var view4 = {};
		var width = $("div#view4").width();
		var height = $("div#view4").height();
		var pix = d3.min([Math.floor((width)/24), Math.floor(height/53)]);
		var show_m;
		var show_m_temp=[];
		var selected;
		var data_type = 0;
		var type_port = null, type_c = null, type_p = null, type_f = null, type_i = null,type_ip = null;
		console.log(pix);
		d3.selectAll(".view4s")
			.on("click", function(d, i){
				if(document.getElementById("view4"+i).checked){
					change_type(i);
					//console.log(i)
				}
			});
		var svg5 = d3.select("div#view4")
			.append("svg")
			.attr("height", 20)
			.attr("width", 24*pix)
			.attr("class", "m2");
		var svg4 = d3.select("div#view4")
			.append("svg")
			.attr("height", 53*pix)
			.attr("width", 24*pix)
			.attr("class", "m");


		svg5.append("rect")
			.attr("width",10)
			.attr("height",10)
			.attr("x",0)
			.attr("y",0)
			.attr("fill","#06799F");
		svg5.append("text")
			.attr("x",12)
			.attr("y",10)
			.attr("class","v4t")
			.text("NULL");
		svg5.append("rect")
			.attr("width",10)
			.attr("height",10)
			.attr("x",45)
			.attr("y",0)
			.attr("fill","rgba(248,62,91,1)");
		svg5.append("text")
			.attr("x",57)
			.attr("y",10)
			.attr("class","v4t")
			.text("large");
		svg5.append("rect")
			.attr("width",10)
			.attr("height",10)
			.attr("x",90)
			.attr("y",0)
			.attr("fill","rgba(103,155,0,1)");
		svg5.append("text")
			.attr("x",102)
			.attr("y",10)
			.attr("class","v4t")
			.text("small");
		//初始化矩阵视图
		for(var i = 1; i<54; i++){
			show_m_temp.push([]);
			for(var j = 0; j<24; j++){
				show_m_temp[show_m_temp.length-1].push(0);
			}
		}
		for(var i = 0; i<24; i++){
			//console.log(i);
			for(var j = 1; j<54; j++){
				//console.log(j);
				var s = "week:"+Math.floor(j/7+1)+"\nday:"+j+"\nhour:"+i;
				var g = svg4.append("g");
				g.append("title")
					.text(s)
					.attr("class", "th"+i+"d"+j);
				g.append("rect")
					.attr("x", i*pix)
					.attr("y", (j-1)*pix)
					.attr("width", pix-1)
					.attr("height", pix-1)
					.attr("class", "h"+i+"d"+j)
					.attr("fill", "white")
					.on("click",function(d){
						var s = d3.select(this).attr("class");
						if(s==selected){
							d3.select("."+s)
								.attr("stroke-width",0);
							Observer.fireEvent("matrix_selected", "cancel", "view4");
						}else{
							d3.select("."+selected)
								.attr("stroke-width",0);
							selected = s;
							d3.select(this)
								.attr("stroke","green")
								.attr("stroke-width",2);
							Observer.fireEvent("matrix_selected", s, "view4");
						}
					});
			}
		}
//console.log(show_m_temp);
		function redraw_m(){
			var maxd = d3.max(show_m, function(d, i){
				return d3.max(d);
			});
			var percent = 0.9;
			var mScale_small = d3.scale.linear()
				.domain([0, maxd*percent])
				.range([0, 1]);
			var mScale_large = d3.scale.linear()
				.domain([maxd*percent, maxd])
				.range([0.7, 1]);
			for(var j = 1; j<53; j++){
				for(var i = 0; i<24; i++){
					svg4.selectAll(".h"+i+"d"+j)
						.attr("fill", function(d){
							var data = show_m[j-1][i];
							if(data==0){
								return "#06799F";
							}else if(data>maxd*percent){
								return "rgba(248,62,91,"+mScale_large(data)+")";
							}else{
								return "rgba(103,155,0,"+mScale_small(data)+")";
							}
						});
					var s = "week:"+Math.floor(j/7+1)+"\nday:"+j+"\nhour:"+i;
					s = s + "\n"+show_m[j-1][i];
					svg4.selectAll(".th"+i+"d"+j)
						.text(s);
				}
			}
		}

		function change_type(type){
			data_type = type;
			if(data_type==0){
				if(type_port!=null){
					d3.text("data/view4/dst/p"+type_port+".csv", function(d1){
						var dst_temp = d3.csv.parseRows(d1);
						d3.text("data/view4/src/p"+type_port+".csv", function(d2){
							var src_temp = d3.csv.parseRows(d2);
							for(var i = 0; i<53; i++){
								for(var j = 0; j<24; j++){
									src_temp[i][j] = src_temp[i][j]+dst_temp[i][j];
								}
							}
							show_m = src_temp;
							//console.log(show_m)
							redraw_m();
						});
					});
				}
			}else if(data_type==1){
				if(type_port!=null){
					d3.text("data/view4/src/p"+type_port+".csv", function(d){
						show_m = d3.csv.parseRows(d);
						redraw_m();
					});
				}
			}else if(data_type==2){
				if(type_port!=null){
					d3.text("data/view4/dst/p"+type_port+".csv", function(d){
						show_m = d3.csv.parseRows(d);
						redraw_m();
					});
				}
			}else if(data_type==3){
				if(type_c!=null){
					d3.text("data/view4/VCI1/v"+type_c+".csv", function(d){
						show_m = d3.csv.parseRows(d);
						redraw_m();
					});
				}
			}else if(data_type==4){
				if(type_p!=null){
					d3.text("data/view4/VPI1/v"+type_p+".csv", function(d){
						show_m = d3.csv.parseRows(d);
						redraw_m();
					});
				}
			}else if(data_type==5){
				d3.text("data/view4/filelen.csv", function(d){
					show_m = d3.csv.parseRows(d);
					redraw_m();
				});
			}else if(data_type==6){
				d3.text("data/view4/iscracked.csv", function(d){
					show_m = d3.csv.parseRows(d);
					redraw_m();
				});
			}else if(data_type==7){
				getdata(type_ip,0);
			}else if(data_type==8){
				getdata(type_ip,1);
			}

		}


		//Observer.fireEvent("addip", [1,29736,4,5], "view2");
		function getdata(d,sd){
			var id=d;//被选中的ip的id号
			var flag=sd;//0-作为srcip 1-作为dstip
			var url="ipdata.php";
			url=url+"?ipselected="+id+"&SrcOrDst="+flag;
	
			$.ajax({
				dataType:'json',
				url:url,
				success:function(data){

					show_m=data["cnt"];
					
					console.log(show_m);
					redraw_m();
				},
				error:function(xhr){
					console.log("error");
				}
			})
		}

		view4.onMessage = function(message, data, from){
			if(message=="VCI1"){
				if(from=="view1"){
					if(data!="cancel"){
						type_c = data;
						change_type(data_type);
					}
				}
			}else if(message=="VPI1"){
				if(from=="view1"){
					if(data!="cancel"){
						type_p = data;
						change_type(data_type);
					}
				}
			}else if(message=="port"){
				if(from=="view1"){
					if(data!="cancel"){
						type_port = data;
						change_type(data_type);
					}
				}
			}else if(message=="addip"){
				if(from=="view2"){
					type_ip = parseInt(data)+1;
					change_type(data_type);
				}
			}
		};
		Observer.addView(view4);
		return view4;

	}

	window["View4"] = View4;
})()