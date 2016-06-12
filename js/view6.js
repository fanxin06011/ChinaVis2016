(function(){
	
	
	
	function View6(Observer){
		
		
		
		var view6={};
		var width=$("div#view6").width();
		var height=$("div#view6").height()-$("#view6choose").height();
		
		
		var svg = d3.select("#view6")
					.append("svg")  
					.attr("width",width)  
					.attr("height",height);
		
		var timeselected=1;//数据的开始时间
		var playtime=timeselected;//当前播放到的时间
		var idlist=[];
		//var idlist=[29736];//选中的ip列表
		var idflag=0;//是否筛选ip 0-no 1-yes
		//var revsec=60;
		//var nowsec=1;
		
		$("#view6all").click(function(){
		  if(document.getElementById("view6all").checked){
			idflag=0;
			choosedata();
		 }});
		$("#view6selected").click(function(){
		  if(document.getElementById("view6selected").checked){
			idflag=1;
			choosedata();
		 }});
		
		var ipdataAll;
		var totalip;


		
		d3.csv("./data/Uqip.csv",function(error,data){
			ipdataAll=data;
			totalip=ipdataAll.length;


		});
		
		
		//axis
		
		var timex = d3.time.scale().range([width*0.1,0.8*width]);
		var datax=[1,1];
		datax[0]=new Date(Date.parse("2015/7/22  0:00:00")+timeselected);
		datax[1]=new Date(Date.parse("2015/7/22  0:00:00")+timeselected+3600000);
		//console.log(datax);
		timex.domain(d3.extent(datax.map(function(d) { return d; })));
		var xAxis = d3.svg.axis().scale(timex).orient("bottom").ticks(10);
		var timeAxis=svg.append("g")
			.attr("class","axisx")
			.attr("transform", "translate("+0+","+0.9*height+")")
			.call(xAxis)
			.attr("fill","black")
			.attr("font-family", "Georgia");
		var timetext=svg.append("g")
				.selectAll("text")
				.data(["2015/7/22","0:00:01"])  
				.enter()
				.append("text")
				.attr("transform",(d,i)=>("translate("+0.83*width+","+(height/5+height*0.1*i)+")"))
				.text(function(d,i){return d;})
				.attr("font-size", height*0.07+"px")
				.attr("dy",height*0.07) 
				.attr("dx",0)
				.attr("fill","black")
				.attr("font-family", "Georgia");
		
		function drawaxis(){
			datax[0]=new Date(Date.parse("2015/7/22  0:00:00")+timeselected);
			datax[1]=new Date(Date.parse("2015/7/22  0:00:00")+timeselected+3600000);
			timex.domain(d3.extent(datax.map(function(d) { return d; })));
			xAxis = d3.svg.axis().scale(timex).orient("bottom").ticks(10);
			timeAxis=timeAxis.call(xAxis);
			
			
		}  
		var sliderect=svg.append("g").append("rect")
				.attr("fill","grey" )
				.attr("y",0.9*height)
				.attr("x",0.1*width)
				.attr("height", 0.02*height)
				.attr("width", 0.7*width)
		var dragrect=svg.append("g")
				.append("rect")
				.attr("fill","black" )
				.attr("y",0.89*height)
				.attr("x",0.1*width)
				.attr("id","view6dragrect")
				.attr("height", 0.04*height)
				.attr("width", 0.015*width)
				.call(d3.behavior.drag()
					.on("drag", dragmove)
					.on("dragend", dragend)
				);
		var draglinear=d3.scale.linear()
					.domain([0.1*width,0.7*width-0.015*width+0.1*width])
					.range([timeselected,timeselected+3600]);		
		var antidraglinear=d3.scale.linear()
					.domain([timeselected,timeselected+3600])
					.range([0.1*width,0.7*width-0.015*width+0.1*width]);
		function dragmove(){
			console.log("dragmove");

			var newx=event.clientX-$(window).width()*0.35-0.015*width;
			if(newx>0.1*width+0.7*width-0.015*width){newx=0.1*width+0.7*width-0.015*width;}
			if(newx<0.1*width){newx=0.1*width;}
			
			dragrect.attr("x",newx);
			playtime=Math.floor(draglinear(newx)+0.5);
			drawtiemtag();
			//console.log(newx);
			//console.log(playtime);
		}
		function dragend(){
			console.log("dragend");
			//playtime=Math.floor(draglinear(newx)+0.5);
			drawlight(playtime);
		}
		
		
		var linename= [ "FILELEN","SRCID","SRCPORT","TIMEINT","VCI1","VPI1","ATM1AALTYPE","DSTPORT","DSTID"];
		var	quantitatives = [ "FILELEN","SRCID","SRCPORT","TIMEINT","VCI1","VPI1","ATM1AALTYPE","DSTPORT","DSTID"];
		
		
					
		var x = d3.scale.ordinal()
				  .domain(quantitatives)
				  .rangePoints([width*0.1, 0.8*width]);
		var	y = {};
		

		var foreground;
		var foregroundg=svg.append("g");
		var foregroundtitle;
		var lightline;
		var lightlineg=svg.append("g");
		var highlightline;
		var highlightlineg=svg.append("g");

		var g;
		var gg=svg.append("g");

		var line = d3.svg.line();
		var	axis = d3.svg.axis().orient("left").ticks(5);;
		
		var dataAll;
		var datanow=new Array();
		var timearr;
		
		var sto;//event
		var playflag=0;//0-stop 1-play
		document.getElementById("view6play").onclick=function(){
			if(playflag==0){
				playflag=1;
				autop();
			}
		}
		document.getElementById("view6stop").onclick=function(){
			if(playflag==1){
				playflag=0;
				clearTimeout(sto);
			}
		}
		function autop(){
			drawtiemtag();
			var newx=antidraglinear(playtime);
			dragrect.attr("x",newx);
			if(playtime<=timeselected+3600){
				sto=setTimeout(function(){
					playtime=playtime+1;
					drawlight(playtime);
					autop();
				},100);
			}
			
		}
		
		

	
		
		function choosedata(){
			var url="chooseData.php";
			var idstr="";
			for(var i=0;i<idlist.length;i++){
				idstr=idstr+idlist[i]+",";
			}
			idstr=idstr.substr(0,idstr.length-1);
			$.ajax({ url:url, 
				type:"post",
				data:{timestart:timeselected,idlist:idstr,idflag:idflag},
				dataType:'json',
				success:function(data){  
						dataAll=data;
						console.log(dataAll);
						timearr=_.pluck(dataAll,"TIMEINT");
						timearr=_.map(timearr,function(num){return parseInt(num);});
						//console.log(timearr);
						setrange();
						drawaxis();
						drawlines();
						setinit();
						//drawlight(14);
				},
				error:function(xhr){
					console.log("error");
				} 
			 })
		}
		choosedata();
		function fangcha(arr){
		  var e=0;var s=0;
		  for(var i=0;i<arr.length;i++){
			e=e+arr[i];
		  }
		  e=e/arr.length;
		  for(var i=0;i<arr.length;i++){
			s=s+(arr[i]-e)*(arr[i]-e);
		  }
		  s=s/(arr.length-1);
		  s=Math.sqrt(s);
		  return e+" "+s;
		}


		function setrange(){
			var filelendata=_.pluck(dataAll,"FILELEN");
			filelendata=_.map(filelendata, function(num){ return parseInt(num); });
			var lenmin=_.min(filelendata);
			var lenmax=_.max(filelendata);
			//console.log(lenmax+" "+lenmin);
			var ext=[[lenmin,lenmax],[0,31195],[0,65526],[timeselected,timeselected+3600],[0,64874],[0,64874],[0,15],[0,65526],[0,31195]]
			
			for(var i=0;i<quantitatives.length;i++){
				y[quantitatives[i]] = d3.scale.linear()
					.domain(ext[i])
					.range([height*0.85, height*0.1]);
				y[quantitatives[i]].brush = d3.svg.brush()
					.y(y[quantitatives[i]])
					.on("brushstart", brushstart)
					.on("brushend", brush);
			}
			
		}
		
		function drawlines(){
			foreground =foregroundg.attr("class", "foreground")
							.selectAll("path")
							.data([]).exit().remove();
			foreground=foregroundg.attr("class", "foreground")
							.selectAll("path")
							.data(dataAll)
							.enter()
							.append("path")
							.attr("d", function(d,i){return path(d);})
							.attr("stroke","grey").attr("opacity",0.25);
							/*
							.on("mouseover",function(d,i){
								console.log("mouseover");
								$(this).attr("stroke","red");
								$(this).attr("stroke","1");
							})
							.on("mouseout",function(d,i){
								$(this).attr("stroke","black");
								$(this).attr("stroke","0.25");
							});*/
			foregroundtitle=foreground.append("title").text(function(d,i){
				//console.log(dataAll[i]);
				var a=_.values(dataAll[i]);
				var b=_.keys(dataAll[i]);
				var s="";
				for(var m=0;m<a.length;m++){
					s=s+b[m]+":"+a[m]+" ";  
				}
				return s;
			});
			
			gg.selectAll(".quantitative")
				.data([]).exit().remove();

			g = gg.selectAll(".quantitative")
				.data(quantitatives)
				.enter()
				.append("g")
				.attr("class", "quantitative")
				.attr("transform", function(d) { return "translate(" + x(d) + ")"; });
			
			g.append("g")
				  .attr("class", "axis")
				  .each(function(d) { 
						//console.log(d);
						if(d=="SRCID"||d=="DSTID"){
							console.log(d);
							d3.select(this).call(axis.scale(y[d])); 
						}else{
							d3.select(this).call(axis.scale(y[d])); 
						}
						
					})
				  .append("text")
				  .attr("text-anchor", "middle")
				  .attr("y", 0.08*height)
				  .text(function(d) {
						//console.log(d);
						return d;
				  });
			
			g.append("g")
				  .attr("class", "brush")
				  .each(function(d) { d3.select(this).call(y[d].brush); })
				  .selectAll("rect")
				  .attr("x", -8)
				  .attr("width", 16);  
		}

		function path(d) {
		  return line(quantitatives.map(function(p) { 
				//console.log(d[p]);
				return [x(p), y[p](parseInt(d[p]))];
		  }));
		}
		
		function drawlight(timeint){
			datanow=new Array();
			
			var tmpi=_.indexOf(timearr, timeint,true);

			lightline =lightlineg.attr("class", "lightline")
							.selectAll("path")
							.data([]).exit().remove();
			if(tmpi>0){
				var tmpi2=tmpi;
				for(;tmpi2<dataAll.length;tmpi2++){
					if(timearr[tmpi2]!=timeint){
						break;
					}
				}
				for(var i=tmpi;i<tmpi2;i++){
					datanow[i-tmpi]=dataAll[i];
				}
				lightline=lightlineg.attr("class", "lightline")
							.selectAll("path")
							.data(datanow)
							.enter()
							.append("path")
							.attr("d", function(d,i){return path(d);})
							.attr("stroke","red");
			}
			
			
		}
		function drawtiemtag(){
			var t=new Date(Date.parse("2015/7/22  0:00:00")+playtime*1000);
			var a= t.getFullYear()+"/"+(t.getMonth()+1)+"/"+t.getDate();
		    var b=t.getHours()+":"+t.getMinutes()+":"+t.getSeconds();
			//console.log(a+" "+b);
			timetext.data([a,b]).text(function(d,i){return d;});
		}
		
		function brushstart() {
		  d3.event.sourceEvent.stopPropagation();
		}	

		function brush() {
			//console.log("brush");
		
		    var actives = quantitatives.filter(function(p) { return !y[p].brush.empty(); });
			var extents = actives.map(function(p) { return y[p].brush.extent(); });
			console.log(actives);
			console.log(extents);
			if(actives.length==0){
				//console.log("aaa");
				foreground.attr("opacity",0.25);
				foreground.attr("stroke","grey");
			}else{
				foreground.attr("stroke",function(d){
					var flag=( !actives.every(function(p, i) {return extents[i][0] <= parseInt(d[p]) && parseInt(d[p]) <= extents[i][1];}));
					if(flag==0){
						$(this).attr("opacity",1);
						return "steelblue";
						//return 0.25;
						}
					else {
						$(this).attr("opacity",0.01);
						return "grey";
						//return 0.005;
					}
				});
			}
			

		}

		
		function setinit(){
			playtime=timeselected;
			drawtiemtag();
			var newx=antidraglinear(playtime);
			dragrect.attr("x",newx);
			
		}
		
		view6.onMessage = function(message, data, from){
			/*if(message == "choosetime"){
				if(from == "view4"){
					console.log(data);
					timeselected=data;
					choosedata();
				}
			}*/
			if(message == "matrix_selected"){
				if(from == "view4"){
					console.log(data);
					if(data!="cancel"){
						var dtmp=data.split("d");
						var day=parseInt(dtmp[1]);
						var hour=parseInt(dtmp[0].split("h")[1]);
						timeselected=(day-1)*86400+hour*3600;
						console.log(timeselected);
						choosedata();
					}else{
						timeselected=1;
						choosedata();
					}
					
				}
			}
			if(message == "highlight"){
				if(from=="view3"){
					console.log("highlight"+data);
					var tmp= _.filter(dataAll, function(d){
							return (_.indexOf(data,parseInt(d.SRCID))>=0)||(_.indexOf(data,parseInt(d.DSTID))>=0); 
						});
					//console.log(tmp);
					highlightline =highlightlineg.attr("class", "highlightline")
							.selectAll("path")
							.data([]).exit().remove();
					highlightline=highlightlineg.attr("class", "highlightline")
								.selectAll("path")
								.data(tmp)
								.enter()
								.append("path")
								.attr("d", function(d,i){return path(d);})
								.attr("stroke","pink");
				}
			}
			if(message == "chooseip"){
				if(from=="view3"){
					console.log("chooseip"+data);
					idlist=data;
					if(idflag==1){
						choosedata();
					}
					
				}
			}

		}
		Observer.addView(view6);
		return view6;
		
	}
	window["View6"] = View6;
})()