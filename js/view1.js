(function(){
	function View1(Observer){
		var view1={};
		var width=$("div#view1").width();
		var height=$("div#view1").height();
		var padding=10;
		//初始化界面
		//svg1是Port，svg2是VCI1，svg3是VPI1，svg4是矩阵


		var svg1 = d3.select("div#view1")
			.append("svg")
			.attr("height",height/4+padding)
			.attr("width",width-padding)
			.attr("class","p1");
		var svg2 = d3.select("div#view1")
			.append("svg")
			.attr("height",height/4+padding)
			.attr("width",width-padding)
			.attr("class","p2");
		var svg3 = d3.select("div#view1")
			.append("svg")
			.attr("height",height/4+padding)
			.attr("width",width-padding)
			.attr("class","p3");

		//初始化svg2
		atm=[15,14,6,5,2,1];
		vpi1=[64874,9075,4063,3212,3181,2133,1699,1696,1606,1174,543,179,159,153,138,135,100,94,49,42,37];
		var xScale2 = d3.scale.ordinal()
			.domain(d3.range(vpi1.length))
			.rangeRoundBands([0,width-40],0.05);
		var yScale2 = d3.scale.linear()
			.domain([0,1000])
			.range([height/4,0]);

		var yAxis2 = d3.svg.axis()
			.scale(yScale2)
			.orient("left");

		svg2.append("g")
			.attr("class","view1axis")
			.attr("transform","translate(30,5)")
			.call(yAxis2);
//初始化svg3
		vci1=[64874,55994,9075,5952,3495,3247,2800,2133,1699,1696,1684,1175,1174,883,543,179,159,153,138,135,100,94,49,42,38,37];

		var xScale3 = d3.scale.ordinal()
			.domain(d3.range(vci1.length))
			.rangeRoundBands([0,width-40],0.05);
		var yScale3 = d3.scale.linear()
			.domain([0,1000])
			.range([height/4,0]);

		var yAxis3 = d3.svg.axis()
			.scale(yScale3)
			.orient("left");

		svg3.append("g")
			.attr("class","view1axis")
			.attr("transform","translate(30,5)")
			.call(yAxis3);
//初始化svg1
		var port = [445,389,135,21,139,443,88,80,53,20,25,110];

		var xScale1 = d3.scale.ordinal()
			.domain(d3.range(port.length))
			.rangeRoundBands([0,width-40],0.05);
		var yScale1 = d3.scale.linear()
			.domain([0,1000])
			.range([height/4,0]);

		var yAxis1 = d3.svg.axis()
			.scale(yScale1)
			.orient("left");

		svg1.append("g")
			.attr("class","view1axis")
			.attr("transform","translate(30,5)")
			.call(yAxis1);

		//day_or_all表示是视图5选中这一天的数据还是所有数据，0代表所有
//data_type表示应用层1、网络层2、链路层3三个方面的选项
		var day_or_all = 1;
		var data_type = 1;
		var temp_day = 1;
		var color = d3.scale.category10();
//定义数据变量
		var dport,sport;
		var c,p;
		var show_m;
		var s1,s1_i=-1;
		var s2 = [0,0];
		$("#view1all").click(function(){
			if(document.getElementById("view1all").checked){
				day_or_all=0;
				change_day(day_or_all);
			}});
		$("#view1day").click(function(){
			if(document.getElementById("view1day").checked){
				day_or_all=temp_day;
				change_day(day_or_all);
			}});
//读入数据
		d3.csv("data/view1/dstportall.csv", function(data){
			dport = data;
			d3.csv("data/view1/srcportall.csv", function(data){
				sport = data;
				draw();
			});

		});

		d3.text("data/view1/day/VCI1/d1.csv",function(data){
			c = d3.csv.parseRows(data);
			for(var i=0;i<27;i++){
				for(var j=0;j<6;j++){
					c[j][i] = +c[j][i];
				}
			}
			for(var i=0;i<27;i++){
				for(var j=1;j<6;j++){
					c[j][i] = c[j][i]+c[j-1][i];
				}
			}
			draw_c();
		});

		d3.text("data/view1/day/VPI1/d1.csv", function(data){
			p = d3.csv.parseRows(data);
			for(var i=0;i<22;i++){
				for(var j = 0; j<6; j++){
					p[j][i] = +p[j][i];
				}
			}
			for(var i=0;i<22;i++){
				for(var j=1;j<6;j++){
					p[j][i] = p[j][i]+p[j-1][i];
				}
			}
			draw_p();
		});

		function draw(){
			//显示port视图
			var show_s = [];
			var show_d = [];
			for(var i in port){
				show_d.push(+dport[port[i]]["d"+day_or_all]);
				show_s.push(+sport[port[i]]["d"+day_or_all]);
			}
			yScale1.domain([0,d3.max(show_d,function(d,i){return d+show_s[i];})]);
			svg1.select("g.view1axis").call(yAxis1);
			s1 = svg1.append("rect")
				.attr("height",0)
				.attr("width",0)
				.attr("x",0)
				.attr("y",height/4)
				.attr("fill","rgba(255,255,255,0.5)")
				.attr("stroke","green")
				.attr("stroke-width",2)
				.attr("class","select")
				.attr("transform","translate(30,5)");

			svg1.selectAll(".dport")
				.data(show_d)
				.enter()
				.append("rect")
				.attr("class","dport")
				.attr("x",function(d,i){return xScale1(i);})
				.attr("y",function(d,i){return yScale1(d);})
				.attr("width",(width-40)/show_d.length/2)
				.attr("height",function(d,i){return height/4-yScale1(d);})
				.attr("fill",color(1))
				.attr("transform","translate(30,5)")
				.on("click", function(d,i){
					if(s1.attr("x")==xScale1(i)-1){
						s1_i = -1;
						s1.transition()
							.duration(700)
							.attr("height",0)
							.attr("width",0)
							.attr("x",0)
							.attr("y",height/4);
						console.log("cancel");
					}else{
						s1_i = i;
						s1.transition()
							.duration(700)
							.attr("height",height/2-yScale1(show_d[i])-yScale1(show_s[i]))
							.attr("width",(width-40)/show_d.length/2+2)
							.attr("x",xScale1(i)-1)
							.attr("y",yScale1(show_d[i]+show_s[i]));
						console.log(port[i]);
						Observer.fireEvent("port", port[i], "view1");
					}

				});
			svg1.selectAll(".sport")
				.data(show_s)
				.enter()
				.append("rect")
				.attr("class","sport")
				.attr("x",function(d,i){return xScale1(i);})
				.attr("y",function(d,i){return yScale1(d+show_d[i]);})
				.attr("width",(width-40)/show_s.length/2)
				.attr("height",function(d,i){return height/4-yScale1(d);})
				.attr("fill",color(2))
				.attr("transform","translate(30,5)")
				.on("click", function(d,i){
					if(s1.attr("x")==xScale1(i)-1){
						console.log("cancel");
						s1_i = -1;
						s1.transition()
							.duration(700)
							.attr("height",0)
							.attr("width",0)
							.attr("x",0)
							.attr("y",height/4);
					}else{
						s1_i = i;
						console.log(port[i]);
						s1.transition()
							.duration(700)
							.attr("height",height/2-yScale1(show_d[i])-yScale1(show_s[i]))
							.attr("width",(width-40)/show_s.length/2+2)
							.attr("x",xScale1(i)-1)
							.attr("y",yScale1(show_d[i]+show_s[i]));
						Observer.fireEvent("port", port[i], "view1");
					}
				});
			svg1.selectAll(".port")
				.data(port)
				.enter()
				.append("text")
				.attr("class","port")
				.attr("x",function(d,i){return xScale1(i);})
				.attr("y",height/4+5)
				.text(function(d,i){return d;})
				.attr("transform","translate(30,5)");

			//显示VCI和VPI

		}

		function draw_c(){
			yScale3.domain([0,d3.max(c,function(d,i){return d3.max(d);})]);
			svg3.select("g.view1axis").call(yAxis3);
			for(var j=5;j>=0;j--){
				var temp = [];
				for(var i=1;i<27;i++){
					temp.push(c[j][i]);
				}
				//console.log(temp);
				svg3.selectAll('.rect3_'+j)
					.data(temp)
					.enter()
					.append("rect")
					.attr("width",(width-40)/temp.length/2)
					.attr("height",function(d,i){return height/4-yScale3(d);})
					.attr("x",function(d,i){return xScale3(i);})
					.attr("y",function(d,i){return yScale3(d);})
					.attr("fill",color(j))
					.attr("class","rect3_"+j)
					.attr("transform","translate(30,5)")
					.on("click",function(d,i){
						if(s2[0]==3&&s2[1]==i){
							console.log("cancel");
							s2 = [0,0];
							svg3.selectAll('.rect3_5')
								.attr("stroke","rgba(255,255,255,0)")
								.attr("stroke-width",0);
						}else{
							/*
							d3.text("data/view1/day/VCI1/d"+vci1[i]+".csv",function(data){
								show_m = d3.csv.parseRows(data);
								redraw_m();
							});
							*/
							Observer.fireEvent("VCI1", vci1[i], "view1");
							s2 = [3,i];
							console.log("vci1:"+vci1[i]);
							svg3.selectAll('.rect3_5')
								.attr("stroke",function(d,n){
									if(n==i) return "black";
									else return d3.select(this).attr("fill");
								})
								.attr("stroke-width",function(d,n){
									if(n==i) return 2;
									else return 0;
								});
							svg2.selectAll('.rect2_5')
								.attr("stroke","rgba(255,255,255,0)")
								.attr("stroke-width",0);
						}
					});
			}
			svg3.selectAll(".view1text3")
				.data(vci1)
				.enter()
				.append("text")
				.attr("x",function(d,i){return xScale3(i);})
				.attr("y",function(d,i){
					return height/4+5;
				})
				.attr("transform","translate(30,5)")
				.attr("class","view1text3")
				.text(function(d,i){
					if(c[5][i+1]==0){
						return '';
					}else{
						return i;
					}
				});
		}

		function draw_p(){
			yScale2.domain([0,d3.max(p,function(d,i){return d3.max(d);})]);
			svg2.select("g.view1axis").call(yAxis2);
			for(var j=5;j>=0;j--){
				var temp = [];
				for(var i=1;i<22;i++){
					temp.push(p[j][i]);
				}
				//console.log(temp);
				svg2.selectAll('.rect2_'+j)
					.data(temp)
					.enter()
					.append("rect")
					.attr("width",(width-40)/temp.length/2)
					.attr("height",function(d,i){return height/4-yScale2(d);})
					.attr("x",function(d,i){return xScale2(i);})
					.attr("y",function(d,i){return yScale2(d);})
					.attr("fill",color(j))
					.attr("class","rect2_"+j)
					.attr("transform","translate(30,5)")
					.on("click",function(d,i){
						if(s2[0]==2&&s2[1]==i){
							console.log("cancel");
							s2 = [0,0];
							svg2.selectAll('.rect2_5')
								.attr("stroke","rgba(255,255,255,0)")
								.attr("stroke-width",0);
						}else{
							/*
							d3.text("data/view1/day/VPI1/v"+vpi1[i]+".csv",function(data){
								show_m = d3.csv.parseRows(data);
								redraw_m();
							});
							*/
							Observer.fireEvent("VPI1", vpi1[i], "view1");
							s2 = [2,i];
							console.log("vpi1:"+vpi1[i]);
							svg2.selectAll('.rect2_5')
								.attr("stroke",function(d,n){
									if(n==i) return "black";
									else return d3.select(this).attr("fill");
								})
								.attr("stroke-width",function(d,n){
									if(n==i) return 2;
									else return 0;
								});
							svg3.selectAll('.rect3_5')
								.attr("stroke","rgba(255,255,255,0)")
								.attr("stroke-width",0);
						}
					});
			}
			svg2.selectAll(".view1text2")
				.data(vpi1)
				.enter()
				.append("text")
				.attr("x",function(d,i){return xScale2(i);})
				.attr("y",function(d,i){
					return height/4+5;
				})
				.attr("transform","translate(30,5)")
				.attr("class","view1text2")
				.text(function(d,i){
					if(p[5][i+1]==0){
						return '';
					}else{
						return i;
					}
				});
		}

		function change_day(day){
			day_or_all = day;
			redraw();
			d3.text("data/view1/day/VCI1/d"+day_or_all+'.csv', function(data){
				c = d3.csv.parseRows(data);
				for(var i=0;i<27;i++){
					for(var j=0;j<6;j++){
						c[j][i] = +c[j][i];
					}
				}
				for(var i=0;i<27;i++){
					for(var j=1;j<6;j++){
						c[j][i] = c[j][i]+c[j-1][i];
					}
				}
				redraw_c();
			});
			d3.text("data/view1/day/VPI1/d"+day_or_all+'.csv', function(data){
				p =d3.csv.parseRows(data);
				for(var i=0;i<22;i++){
					for(var j = 0; j<6; j++){
						p[j][i] = +p[j][i];
					}
				}
				for(var i=0;i<22;i++){
					for(var j=1;j<6;j++){
						p[j][i] = p[j][i]+p[j-1][i];
					}
				}
				redraw_p();
			});
		}

		function redraw_c(){
			yScale3.domain([0,d3.max(c,function(d,i){return d3.max(d);})]);
			svg3.select("g.view1axis").call(yAxis3);
			for(var j=5;j>=0;j--){
				var temp = [];
				for(var i=1;i<27;i++){
					temp.push(c[j][i]);
				}
				svg3.selectAll('.rect3_'+j)
					.data(temp)
					.transition()
					.duration(700)
					.attr("height",function(d,i){return height/4-yScale3(d);})
					.attr("y",function(d,i){return yScale3(d);});
			}
			svg3.selectAll(".view1text3")
				.data(vci1)
				.transition()
				.duration(700)
				.text(function(d,i){
					if(c[5][i+1]==0){
						return '';
					}else{
						return i;
					}
				});
		}

		function redraw_p(){
			yScale2.domain([0,d3.max(p,function(d,i){return d3.max(d);})]);
			svg2.select("g.view1axis").call(yAxis2);
			for(var j=5;j>=0;j--){
				var temp = [];
				for(var i=1;i<22;i++){
					temp.push(p[j][i]);
				}
				svg2.selectAll('.rect2_'+j)
					.data(temp)
					.transition()
					.duration(700)
					.attr("height",function(d,i){return height/4-yScale2(d);})
					.attr("y",function(d,i){return yScale2(d);});
			}
			svg2.selectAll(".view1text2")
				.data(vpi1)
				.transition()
				.duration(700)
				.text(function(d,i){
					if(p[5][i+1]==0){
						return '';
					}else{
						return i;
					}
				});
		}

		function redraw(){
			//重画port视图
			var show_s = [];
			var show_d = [];
			for(var i in port){
				show_d.push(+dport[port[i]]["d"+day_or_all]);
				show_s.push(+sport[port[i]]["d"+day_or_all]);
			}
			yScale1.domain([0,d3.max(show_d,function(d,i){return d+show_s[i];})]);
			svg1.select("g.view1axis").call(yAxis1);
			svg1.selectAll('.dport')
				.data(show_d)
				.on("click", function(d,i){
					if(s1.attr("x")==xScale1(i)-1){
						s1_i = -1;
						s1.transition()
							.duration(700)
							.attr("height",0)
							.attr("width",0)
							.attr("x",0)
							.attr("y",height/4);
						console.log("cancel");
					}else{
						s1_i = i;
						s1.transition()
							.duration(700)
							.attr("height",height/2-yScale1(show_d[i])-yScale1(show_s[i]))
							.attr("width",(width-40)/show_d.length/2+2)
							.attr("x",xScale1(i)-1)
							.attr("y",yScale1(show_d[i]+show_s[i]));
						console.log(port[i]);
						Observer.fireEvent("port", port[i], "view1");
					}

				})
				.transition()
				.duration(700)
				.attr("y",function(d,i){return yScale1(d);})
				.attr("height",function(d,i){return height/4-yScale1(d);});
			svg1.selectAll(".sport")
				.data(show_s)
				.on("click", function(d,i){
					if(s1.attr("x")==xScale1(i)-1){
						s1_i = -1;
						console.log("cancel");
						s1.transition()
							.duration(700)
							.attr("height",0)
							.attr("width",0)
							.attr("x",0)
							.attr("y",height/4);
					}else{
						s1_i = i;
						console.log(port[i]);
						s1.transition()
							.duration(700)
							.attr("height",height/2-yScale1(show_d[i])-yScale1(show_s[i]))
							.attr("width",(width-40)/show_d.length/2+2)
							.attr("x",xScale1(i)-1)
							.attr("y",yScale1(show_d[i]+show_s[i]));
						Observer.fireEvent("port", port[i], "view1");
					}
				})
				.transition()
				.duration(700)
				.attr("y",function(d,i){return yScale1(d+show_d[i]);})
				.attr("height",function(d,i){return height/4-yScale1(d);});
			if(s1_i!=-1){
				s1.transition()
					.duration(700)
					.attr("height",height/2-yScale1(show_d[s1_i])-yScale1(show_s[s1_i]))
					.attr("y",yScale1(show_d[s1_i]+show_s[s1_i]));
			}
		}




			//Observer.fireEvent("addip", [1,29736,4,5], "view2");
			//Observer.fireEvent("addip", [1,2], "view2");
	


		view1.onMessage = function(message, data, from){
			if(message == "calendar"){
				if(from == "view5"){
					if(day_or_all!=0){
						var a = data.split("/");
						var month = +a[1];
						var day = +a[2];
						var d = day-21+(month-7)*31;
						//console.log(d);
						if(d>0&&d<54)
							change_day(d);
					}else{
						temp_day = day_or_all;
					}

				}
			}
		}
		Observer.addView(view1);
		return view1;
		
	}
	window["View1"] = View1;
})();