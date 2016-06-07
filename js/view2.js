(function(){
	function View2(Observer){
		var view2={};
		var width=$("div#view2").width();
		var height=$("div#view2").height()-$("#view2radio").height();		
			           var a;
			           var compute;
                      var edges=[];
                      var drag;
					   var nodes=[];
				
						var repeat=[];  
						var weight=[];
						var data1;
						var data2;
						var data3;	
						var sources=[];
						var targets=[];
						var arraynode=[];
						var srtsum=[];
						var dstsum=[];
						var ipname=[];
						var vp1=[];
						var vp2=[];
						var srcport=[];
						var dstport=[];
						 var average1=0;
						 var yvc=0;//标志是否选中该筛选事件
                      var yvp=0;
                     var yport=0;
                   var yip=0;
                   var change=0;
              var vc;
              var vp;
             var port;
             var ipre=[];
             var current=1;

			  
				var average2=0;
				var fangcha=0;
				var date=[-1,0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,
						21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,
						42,43,44,45,46,47,48,49,50,51,52];

		var srclinear;
		var dstlinear;
		var srclinear1;
		var dstlinear1;
		var maxbig;
		
	
		
var svg = d3.select("#view2")
					.append("svg")
					.attr("width",width)
					.attr("height",height);

	function draw(day)	
	{	

			           
                      edges=[];
                      
					   nodes=[];
					   
						 repeat=[];  
						 weight=[];
							
						 sources=[];
						 targets=[];
						 arraynode=[];
						srtsum=[];
						 dstsum=[];
						 ipname=[];
						 vp1=[];
						 vp2=[];
						 srcport=[];
						 dstport=[];
							svg.selectAll("g").remove();
       svg.selectAll("path").remove();
        svg.selectAll("line").remove();
        svg.selectAll("rect").remove();
       svg.selectAll("text").remove();
		d3.csv("./data/view2/Uqip.csv",function(error,csvdata)
				{
					data1=csvdata;

						csv1(day);
							});
	}
	
					
			function csv1(day)	
				{
					 d3.csv("./data/view2/uqcomb.csv",function(error,csvdata2)
						{
							data2=csvdata2;
							
							//n=100;	
							csv2(day);
					 });
					
			 }
								
				function csv2(day)

				{ 
					var s;
				    if(day==0)s="data/view2/Data.csv"
					else s="./data/view2/day/day"+date[day]+".csv";

					 d3.csv(s,function(error,csvdata3)
					 {
					 
				
						
				//读取nodes
				var datalen=data1.length;
						for(var i=0;i<datalen;i++)
						 {
								
								repeat[i]=0;
								srtsum[i]=0;
								dstsum[i]=0;
								
						 }   

					 data1.forEach(function(d,i)
					 {
							 
								arraynode[i]=i;
								ipname[i]=d.ip;
						}
						 
							 
						);
			
			 //读取edges
			 var datalen2=data2.length;
					 for(var r=0;r<datalen2;r++)
								{
										
										weight[r]=0;
								
								}
						 
							 data2.forEach(function(d,i)
							 {
								sources[i]=parseInt(d.srcid)-1;
								targets[i]=parseInt(d.dstid)-1;
								
						});
					
				//读取通信次数
						csvdata3.forEach(function(d,i)
						{
								weight[parseInt(d.COMBID)-1]++;
								vp1[parseInt(d.COMBID)-1]=parseInt(d.VPI1);
								vp2[parseInt(d.COMBID)-1]=parseInt(d.VCI1);
								srcport[parseInt(d.COMBID)-1]=parseInt(d.SRCPORT);
								dstport[parseInt(d.COMBID)-1]=parseInt(d.DSTPORT);
								repeat[parseInt(d.SRCID)-1]++;
								srtsum[parseInt(d.SRCID)-1]++;
								repeat[parseInt(d.DSTID)-1]++;
								dstsum[parseInt(d.DSTID)-1]++;
						});
			
					
			 for(var i=0;i<repeat.length;i++)
			 {
               average1=average1+repeat[i];

			 }
			 for(var i=0;i<weight.length;i++)
			 {
			 	average2=average2+weight[i];
			 }
			 average1=parseInt(average1/repeat.length);
			  for(var i=0;i<repeat.length;i++)
			 {
               fangcha=fangcha+Math.pow((repeat[i]-average1),2);

			 }
			if(day==0)fangcha=Math.sqrt(fangcha/repeat.length);
			else if(day==8||day==19||day==1) fangcha=2*Math.sqrt(fangcha/repeat.length);
			 else fangcha=1.5*Math.sqrt(fangcha/repeat.length);
			 average2=parseInt(average2/weight.length);

             

		
			 
  console.log(average1);
  console.log("fangcha:"+fangcha);
  console.log(average2);
  
			 //处理start   
              var k=-1;
			 
			  sources=_.filter(sources,function(num){k++;return weight[k]>average2;

			  });
			  k=-1;
			  targets=_.filter(targets,function(num){k++;return weight[k]>average2;

			  });
			 
              k=-1;
			  vp1=_.filter(vp1,function(num){k++;return weight[k]>average2;

			  });
			  k=-1;
			  vp2=_.filter(vp2,function(num){k++;return weight[k]>average2;

			  });
			   k=-1;
			  srcport=_.filter(srcport,function(num){k++;return weight[k]>average2;

			  });
			  k=-1;
			  dstport=_.filter(dstport,function(num){k++;return weight[k]>average2;

			  });


			  weight=_.filter(weight,function(num){return num>average2;

			  });

			  var arraynode1=[];
			  arraynode1=_.filter(arraynode,function(num){
			  	return (repeat[num]>average1+fangcha)&&
			  	(_.indexOf(sources,num)!=-1||_.indexOf(targets,num)!=-1);
			  });
			 
			  k=-1;
			  srtsum=_.filter(srtsum,function(num){k++;
			  	return (repeat[k]>average1+fangcha)&&
			  	(_.indexOf(sources,arraynode[k])!=-1||_.indexOf(targets,arraynode[k])!=-1);
			  });
			  k=-1;
			  dstsum=_.filter(dstsum,function(num){k++;
			  	return (repeat[k]>average1+fangcha)&&
			  	(_.indexOf(sources,arraynode[k])!=-1||_.indexOf(targets,arraynode[k])!=-1);
			  });
			   k=-1;
			  repeat=_.filter(repeat,function(num){k++;
			  	return (num>average1+fangcha)&&
			  	(_.indexOf(sources,arraynode[k])!=-1||_.indexOf(targets,arraynode[k])!=-1);
			  });
			  arraynode=arraynode1;

             
		

			 

			  
			  for(var i=0;i<sources.length;i++)
			  {
			  	var index1=_.indexOf(arraynode,sources[i]);
			  	var index2=_.indexOf(arraynode,targets[i]);
			  	sources[i]=index1;
			  	targets[i]=index2;
			  }

			
			 
			  
			  for(var i=0;i<sources.length;i++)
			  {
			  	for(var r=i+1;r<sources.length;r++)
			  	{
			  		if(sources[i]==targets[r]&&targets[i]==sources[r]){sources.splice(r,1);targets.splice(r,1);
			  			weight[i]=weight[i]+weight[r];
			  			weight.splice(r,1);vp1.splice(r,1);
			  			vp2.splice(r,1);srcport.splice(r,1);
			  			dstport.splice(r,1);break;}

			  	}

			  }
			  
			  
			 

			  

                  
					 
				 for(var i=0;i<arraynode.length;i++)
				 {
					nodes[i]=new Object();
                    a=String(arraynode[i]);
					nodes[i].name=a;
					nodes[i].srtnum=srtsum[i];
					nodes[i].dstnum=dstsum[i];
					nodes[i].flagip=0;
					nodes[i].flagport=0;
				 }
				 
				 
				 for(var i=0;i<sources.length;i++)
				 {
				 	
					edges.push({source:Number(sources[i]),target:Number(targets[i]),
						vp1:vp1[i],vp2:vp2[i],srcport:srcport[i],dstport:dstport[i],
						flagvc:0});
					
						
				 }

				 k=-1;
                weight=_.filter(weight,function(item){k++;return edges[k].source!=-1&&edges[k].target!=-1;});
                k=-1;
                vp1=_.filter(vp1,function(item){k++;return edges[k].source!=-1&&edges[k].target!=-1;});
                k=-1;
                vp2=_.filter(vp2,function(item){k++;return edges[k].source!=-1&&edges[k].target!=-1;});
                k=-1;
                srcport=_.filter(srcport,function(item){k++;return edges[k].source!=-1&&edges[k].target!=-1;});
                k=-1;
                dstport=_.filter(dstport,function(item){k++;return edges[k].source!=-1&&edges[k].target!=-1;});

				edges=_.filter(edges,function(item){return item.source!=-1&&item.target!=-1;});
				


				
				
					
					console.log(nodes);	   
			   console.log(edges);
				console.log("权重等");
				console.log(srcport);
			    console.log(dstport);
				
				
				
		
		
		var weimax=_.max(weight);
		
		var distanceliner=d3.scale.linear()
								.domain([0, weimax])
								.range([20,70]);
		
		
		var force = d3.layout.force()
				.nodes(nodes)		//指定节点数组
				.links(edges)		//指定连线数组
				.size([width,height])	//指定范围
				.linkDistance(function(d,i)
				{return 35;

				})	//指定连线长度
				.charge(-105)
				.gravity(0.4);	//相互之间的作用力
		
		force.start();	//开始作用
       
       
     
      
        
		
		var srtsum1=srtsum;
		var dstsum1=dstsum;
		srtsum1.splice(_.indexOf(srtsum,_.max(srtsum)),1);
		dstsum1.splice(_.indexOf(dstsum,_.max(dstsum)),1);


		
		var srcmax=_.max(srtsum1);
		var dstmax=_.max(dstsum1);

		 srclinear=d3.scale.linear()
								.domain([0, srcmax])
								.range([2, 5]);
		 dstlinear=d3.scale.linear()
								.domain([0, dstmax])
								.range([2, 5]);
		
	     srclinear1=d3.scale.linear()
								.domain([0, srcmax])
								.range([4, 10]);
		 dstlinear1=d3.scale.linear()
								.domain([0, dstmax])
								.range([4, 10]);
		maxbig=12;
		
			
	  drag = force.drag()
						.on("dragstart",function(d,i){
							d.fixed = true; 
						});	
		//添加连线		
		var svg_edges = svg.selectAll("line")
							.data(edges)
							.enter()
							.append("line")
							.style("stroke","#ccc")
							.style("stroke-width",1);	


						
	

		var svg_nodes = svg.selectAll("rect")  
								.data(nodes)  
								.enter()  
								.append("rect")  
								.attr("width",function(d,i){
									if(d.srtnum>(average1+4*fangcha)){return 7;}
									else{
										//console.log(srclinear(d.srtnum));
										return srclinear(d.srtnum);
									}
									
								})  
								.attr("height",function(d,i){
									if(d.dstnum>(average1+4*fangcha)){return 7;}
									else{
										//console.log(dstlinear(d.dstnum));
										return dstlinear(d.dstnum);
									}
									
								})
							    .style("fill","#33ffff")
							    .on("click",function(d,i){
									console.log(d);
 									Observer.fireEvent("addip", [parseInt(d.name)], "view2");								
 								})
							.on("dblclick",function(d,i){
									console.log(repeat[i]);
									d.fixed=false;								
								})
							.call(drag);	//使得节点能够拖动
              svg_nodes.append("title")
						.text(function(d,i) { return repeat[i]});
		//添加描述节点的文字
		/*var svg_texts = svg.selectAll("text")
							.data(nodes)
							.enter()
							.append("text")
							.style("fill", "black")
							.attr("dx", 20)
							.attr("dy", 8)
							.text(function(d){
								return d.name;
							});
*/
					

		force.on("tick", function(){	//对于每一个时间间隔
		
			 //更新连线坐标
			 svg_edges.attr("x1",function(d){ return d.source.x; })
					.attr("y1",function(d){ return d.source.y; })
					.attr("x2",function(d){ return d.target.x; })
					.attr("y2",function(d){ return d.target.y; });
			 
			 //更新节点坐标
			 svg_nodes.attr("x",function(d){ return d.x; })
					.attr("y",function(d){ return d.y; });

			 //更新文字坐标
			/* svg_texts.attr("x", function(d){ return d.x; })
				.attr("y", function(d){ return d.y; });
				*/
		});
		if(yvp==1)gaoliang1(vp);
    if(yvc==1)gaoliang2(vc);
	if(yport==1)portfilter(port);
	if(yip==1)ipgaoliang(ipre);
	});
	}

	    
		var a = d3.rgb(0,255,000); //src
		var b = d3.rgb(0,0,255);    //dst
		compute= d3.interpolate(a,b); 


	function portfilter(m)
{
	console.log("yvc:"+yvc+"yvp"+yvp);
	var f=[];
   	var g=[];
   	if(yvc==1||yvp==1)
   	for(var r=0;r<edges.length;r++)
    	{

    	
    
    	 if(edges[r].flagvc==1)
   		{
   			if(edges[r].srcport==m)
   			{f.push(edges[r].source.name);nodes[edges[r].source.index].flagport=1; console.log("once");}
   		    if(edges[r].dstport==m)
   			{ g.push(edges[r].target.name);nodes[edges[r].target.index].flagport=1; console.log("once");}
     	}
     }
     if(yvc==0&&yvp==0)
     		for(var r=0;r<edges.length;r++)
     		{
     		if(edges[r].srcport==m)
   			{f.push(edges[r].source.name);nodes[edges[r].source.index].flagport=1;}
   		    if(edges[r].dstport==m)
   			{ g.push(edges[r].target.name);nodes[edges[r].target.index].flagport=1;}
    	
    }
   	


   	console.log(f);
   	console.log(g);
						

		
		 	
							
				svg.selectAll("rect")
							.data(nodes)
							.transition()
							.duration(1000)
							.attr("width",function(d){
								if(d.flagip==1)return maxbig;//highlight ip颜色
								else{
									if(_.indexOf(f,d.name)!=-1||
										_.indexOf(g,d.name)!=-1)
										{
											if(d.srtnum>(average1+4*fangcha)){return maxbig;}
									else{
										return srclinear1(d.srtnum);
										}
										}//筛选颜色
									else //初始颜色
										{
											if(d.srtnum>(average1+4*fangcha)){return 7;}
									else{
										return srclinear(d.srtnum);
									}
									
								}}})  
						  	.attr("height",function(d){
								if(d.flagip==1)return maxbig;
								else{
									if(_.indexOf(f,d.name)!=-1||
										_.indexOf(g,d.name)!=-1)
									{
										if(d.dstnum>(average1+4*fangcha)){return maxbig;}
									else{
										return dstlinear1(d.dstnum);
									}
								}
									else 
										{
											if(d.dstnum>(average1+4*fangcha)){return 7;}
									else{
										return dstlinear(d.dstnum);
									}
									
								}}})  
							.style("fill",function(d,i){

							if(d.flagip==1)return "red";
							else{
								if(_.indexOf(f,d.name)!=-1||_.indexOf(g,d.name)!=-1)return "#00ee00";
								
								else  
								{
									 return "#33ffff";
								}
							}});
	}

	
			  function gaoliang1(n)
   {

   	var f=[];
   	var g=[];
   	if(yport==1)
   	{
   	for(var r=0;r<edges.length;r++)
   	{
   		
   		
   		  if(edges[r].vp1==n)
   			{
   				if(nodes[edges[r].source.index].flagport==1)f.push(edges[r].source.name);
   			 if(nodes[edges[r].target.index].flagport==1)g.push(edges[r].target.name);
   			 edges[r].flagvc=1;
   			}
   		
   	}	
   }
    if(yport==0)
    {
      for(var r=0;r<edges.length;r++)
      {
   			if(edges[r].vp1==n)
   			{f.push(edges[r].source.name);
   			 g.push(edges[r].target.name);
   			 edges[r].flagvc=1;
   			}
   		}
   	}


   	console.log(f);
   	console.log(g);
						
	
		
		//var srcmax=_.max(srtsum);
		//var dstmax=_.max(dstsum);

		
		 		
							
				svg.selectAll("rect")
							.data(nodes)
							.transition()
							.duration(1000)	
							.attr("width",function(d){
								if(d.flagip==1)return maxbig;//highlight ip颜色
								else{
									if(_.indexOf(f,d.name)!=-1||
										_.indexOf(g,d.name)!=-1)
										{
											if(d.srtnum>(average1+4*fangcha)){return maxbig;}
									else{
										return srclinear1(d.srtnum);
										}
										}//筛选颜色
									else //初始颜色
										{
											if(d.srtnum>(average1+4*fangcha)){return 7;}
									else{
										return srclinear(d.srtnum);
									}
									
								}}})  
						  	.attr("height",function(d){
								if(d.flagip==1)return maxbig;
								else{
									if(_.indexOf(f,d.name)!=-1||
										_.indexOf(g,d.name)!=-1)
									{
										if(d.dstnum>(average1+4*fangcha)){return maxbig;}
									else{
										return dstlinear1(d.dstnum);
									}
								}
									else 
										{
											if(d.dstnum>(average1+4*fangcha)){return 7;}
									else{
										return dstlinear(d.dstnum);
									}
									
								}}})  	
							.style("fill",function(d,i){
								if(d.flagip==1){console.log(d.name);return "red";}
								else
								{
								if(_.indexOf(f,d.name)!=-1||_.indexOf(g,d.name)!=-1)return "#00ee00";
								
								else  
								{
									 return "#33ffff";
								}
							}
							});
								
}

function gaoliang2(m)
   {
  console.log(yport);
   	var f=[];
   	var g=[];
   	if(yport==1)
   	{

   	for(var r=0;r<edges.length;r++)
   	{

   		
   	
   		
   		
   		  if(edges[r].vp2==m)
   			{if(nodes[edges[r].source.index].flagport==1)f.push(edges[r].source.name);
   			 if(nodes[edges[r].target.index].flagport==1)g.push(edges[r].target.name);
   			 console.log("once");
   			 edges[r].flagvc=1;
   			}
   		
   	}
   }
   	else if(yport==0)
   		for(var r=0;r<edges.length;r++)
   			{
   				if(edges[r].vp2==m)
   			{f.push(edges[r].source.name);
   			 g.push(edges[r].target.name);
   			 edges[r].flagvc=1;
   			}
   	}


   	console.log(f);
   	console.log(g);
								
							
				svg.selectAll("rect")
							.data(nodes)
							.transition()
							.duration(1000)	
							.attr("width",function(d){
								if(d.flagip==1)return maxbig;//highlight ip颜色
								else{
									if(_.indexOf(f,d.name)!=-1||
										_.indexOf(g,d.name)!=-1)
										{
											if(d.srtnum>(average1+4*fangcha)){return maxbig;}
									else{
										return srclinear1(d.srtnum);
										}//筛选颜色
									}
									else //初始颜色
										{
											if(d.srtnum>(average1+4*fangcha)){return 7;}
									else{
										return srclinear(d.srtnum);
									}
									
								}}})  
						  	.attr("height",function(d){
								if(d.flagip==1)return maxbig;
								else{
									if(_.indexOf(f,d.name)!=-1||
										_.indexOf(g,d.name)!=-1)
									{
										if(d.dstnum>(average1+4*fangcha)){return maxbig;}
									else{
										return dstlinear1(d.dstnum);
									}
								}
									else 
										{
											if(d.dstnum>(average1+4*fangcha)){return 7;}
									else{
										return dstlinear(d.dstnum);
									}
									
								}}})  		
							.style("fill",function(d,i){
								if(d.flagip==1){console.log(d.name);return "red";}
								else{
								if(_.indexOf(f,d.name)!=-1||_.indexOf(g,d.name)!=-1)return "#00ee00";
								
								else  
								{
									 return "#33ffff";
								}
							}
							});
								
}

function ipgaoliang(data)
{
	console.log("12313");
	console.log(data);
	
	for(var i=0;i<nodes.length;i++)

	{
		if(_.indexOf(data,parseInt(nodes[i].name))!=-1){console.log("flagip");nodes[i].flagip=1;}
	}
	svg.selectAll("rect")
							.data(nodes)
							.transition()
							.duration(1000)	
							.attr("width",function(d){
									if(d.flagip==1){console.log(d.name);return maxbig;}
									else {
										if(d.srtnum>(average1+4*fangcha)){return 7;}
									else{
										return srclinear(d.srtnum);
									}}})
							.attr("height",function(d){
									if(d.flagip==1){console.log(d.name);return maxbig;}
									else {
										if(d.dstnum>(average1+4*fangcha)){return 7;}
									else{
										return dstlinear(d.dstnum);
									}}})		
							.style("fill",function(d,i){
								if(d.flagip==1){console.log(d.name);return "red";}
								else { return "#33ffff";
							}
							});
if(yvp==1)gaoliang1(vp);
if(yvc==1)gaoliang2(vc);
if(yport==1)portfilter(port);



}
function recoverip()
{
	for(var r=0;r<nodes.length;r++)
	{
		nodes[r].flagip=0;
	}

	svg.selectAll("rect")
							.data(nodes)
							.attr("width",function(d,i){
									if(d.srtnum>(average1+4*fangcha)){return 7;}
									else{
										return srclinear(d.srtnum);
									}
									
								})  
								.attr("height",function(d,i){
									if(d.dstnum>(average1+4*fangcha)){return 7;}
									else{
										return dstlinear(d.dstnum);
									}
									
								})
							.style("fill",function(d,i){
								 return "#33ffff";
							});

	if(yvp==1)gaoliang1(vp);
    if(yvc==1)gaoliang2(vc);
	if(yport==1)portfilter(port);


}

function recovervpc()
{
	
   
   	for(var r=0;r<edges.length;r++)
   	{
   		    edges[r].flagvc=0;
    }
		
		 		
							
				
svg.selectAll("rect")
							.data(nodes)
							.attr("width",function(d)
								{
									if(d.flagip==1)return maxbig;
									else {
										if(d.srtnum>(average1+4*fangcha)){return 7;}
									else{
										return srclinear(d.srtnum);

									}
								}})
							.attr("height",function(d)
								{
									if(d.flagip==1)return maxbig;
									else {
										if(d.dstnum>(average1+4*fangcha)){return 7;}
									else{
										return dstlinear(d.dstnum);

									}
								}})
							.style("fill",function(d,i){
								if(d.flagip==1)return "red";
								else{
								 return "#33ffff";
							}});
if(yport==1)portfilter(port);

}

function recoverport()
{
	
   
   	for(var r=0;r<nodes.length;r++)
   	{
   		 		    nodes[r].flagport=0;
   		 
   	}
		 							
				
svg.selectAll("rect")
							.data(nodes)
							.attr("width",function(d)
								{
									if(d.flagip==1)return maxbig;
									else {
										if(d.srtnum>(average1+4*fangcha)){return 7;}
									else{
										return srclinear(d.srtnum);

									}
								}})
							.attr("height",function(d)
								{
									if(d.flagip==1)return maxbig;
									else {
										if(d.dstnum>(average1+4*fangcha)){return 7;}
									else{
										return dstlinear(d.dstnum);

									}
								}})
							.style("fill",function(d,i){
								if(d.flagip==1)return "red";
								else{
								 return "#33ffff";
							}});
if(yvc==1){console.log("vp1");gaoliang2(vc);}
if(yvp==1){console.log("vp2");gaoliang1(vp);}
}


        $("#view2all").click(function(){
			if(document.getElementById("view2all").checked){
				change=0;draw(0);
			}});
		$("#view2day").click(function(){
			if(document.getElementById("view2day").checked){
				change=1;draw(current);
			}});
			

		 draw(0);

        
        
		view2.onMessage = function(message, data, from){
			if(message=="highlight"){
				if(from=="view3"){
					if(data[0]=="undefined"){yip=0;recoverip();}
					else
						{yip=1;ipre=data;recoverip();ipgaoliang(data);}
				}
			}
			if(message == "VCI1"){
				if(from == "view1"){

					if(data=="cancel"){yvc=0;recovervpc();}
					else
						{
							vc=parseInt(data);
							
					recovervpc();
					yvc=1;
					
					if(yvp==1)
					{
						
						yvp=0;
						console.log(parseInt(data));
						gaoliang2(parseInt(data));


					}
					else 
					{
						console.log(parseInt(data));
						gaoliang2(parseInt(data));
							}

				}
			}
			}
			if(message=="VPI1")
			{
				if(from=="view1")
				{
					if(data=="cancel"){yvp=0;recovervpc();}
					else
					{
						vp=parseInt(data);
						
					recovervpc();
					yvp=1;
					
					if(yvc==1)
					{
						console.log(parseInt(data));
						yvc=0;
						gaoliang1(parseInt(data));


					}
					else 
					{
						console.log(parseInt(data));
						gaoliang1(parseInt(data));
							}
						}
				}
			}
			if(message=="port")
			{
				if(from=="view1")
				{
					if(data=="cancel"){console.log("111");yport=0;recoverport();}
					else
				{
					yport=1;
					port=parseInt(data);
					recoverport();

					portfilter(parseInt(data));
					
				}

				}
			}
			if(message == "calendar"){
				console.log("222");
				if(from == "view5")
				{
					if(change==1)
					{
					console.log(222);
					var k=parseInt(data[6]);
					var k1=parseInt(data.slice(8,10));
					console.log(k+"and"+k1);
					var w=(k-7)*31+k1-22;
					current=w+1;
                    draw(w+1);
                }
				}
			}

		}
		Observer.addView(view2);
		return view2;
		
	}
	window["View2"] = View2;
})();
				
		
